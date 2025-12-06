from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from rest_framework import viewsets, status, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User, EmailVerificationToken
from .serializers import UserSerializer
from .email_service import (
    send_verification_email,
    can_send_verification_email,
)


class UserViewSet(viewsets.ViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = User.objects.filter(username=self.request.user.username)
        return queryset

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class UserLogin(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'id': user.pk,
            'username': user.username,
            'email': user.email,
            'email_verified': user.email_verified,
            'pending_email': user.pending_email,
            'metadata': user.metadata,
        })


class UserLogout(APIView):

    def post(self, request):
        try:
            request.user.auth_token.delete()
        except ValueError:
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_200_OK)


class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Create verification token and send email
        token = EmailVerificationToken.create_token(
            user,
            EmailVerificationToken.TOKEN_TYPE_VERIFY
        )
        email_sent = send_verification_email(user, token, is_email_change=False)

        if email_sent:
            return Response({
                'message': 'Account created! Please check your email to verify your account.',
                'username': user.username,
            }, status=status.HTTP_201_CREATED)
        else:
            # Account created but email failed - user can resend from profile
            return Response({
                'message': 'Account created, but we could not send the verification email. '
                           'Please try resending from your profile settings.',
                'username': user.username,
                'email_sent': False,
            }, status=status.HTTP_201_CREATED)


class UserMe(APIView):
    """Get current user info or update metadata"""
    permission_classes = [IsAuthenticated]

    def _get_user_response(self, user, include_token=False):
        """Helper to build consistent user response"""
        response = {
            'uuid': str(user.pk),
            'username': user.username,
            'email': user.email,
            'email_verified': user.email_verified,
            'pending_email': user.pending_email,
            'metadata': user.metadata,
        }
        if include_token:
            token, _ = Token.objects.get_or_create(user=user)
            response['token'] = token.key
        return response

    def get(self, request):
        """Return current user info"""
        return Response(self._get_user_response(request.user, include_token=True))

    def patch(self, request):
        """Update user metadata"""
        user = request.user
        if 'metadata' in request.data:
            user.metadata = request.data['metadata']
            user.save()
        return Response(self._get_user_response(user))

    def post(self, request):
        """Alias for patch - update user metadata"""
        return self.patch(request)


class ChangePassword(APIView):
    """Change user password"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        if not current_password or not new_password:
            return Response(
                {'error': 'Both current_password and new_password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not user.check_password(current_password):
            return Response(
                {'error': 'Current password is incorrect'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(new_password) < 8:
            return Response(
                {'error': 'Password must be at least 8 characters'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        return Response({'message': 'Password changed successfully'})


class VerifyEmail(APIView):
    """Verify email address using token"""
    permission_classes = [AllowAny]

    def get(self, request, token):
        # Find the token
        try:
            verification_token = EmailVerificationToken.objects.get(token=token)
        except EmailVerificationToken.DoesNotExist:
            return Response(
                {'error': 'Invalid verification link'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if expired
        if verification_token.is_expired():
            verification_token.delete()
            return Response(
                {'error': 'Verification link has expired. Please request a new one.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = verification_token.user

        # Handle based on token type
        if verification_token.token_type == EmailVerificationToken.TOKEN_TYPE_VERIFY:
            user.email_verified = True
            user.save(update_fields=['email_verified'])
            message = 'Email verified successfully'
        elif verification_token.token_type == EmailVerificationToken.TOKEN_TYPE_CHANGE:
            # Update email to pending_email
            if user.pending_email:
                user.email = user.pending_email
                user.pending_email = None
                user.email_verified = True
                user.save(update_fields=['email', 'pending_email', 'email_verified'])
                message = 'Email changed and verified successfully'
            else:
                return Response(
                    {'error': 'No pending email change found'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            return Response(
                {'error': 'Invalid token type'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Delete the used token
        verification_token.delete()

        return Response({'message': message})


class ResendVerification(APIView):
    """Resend verification email (rate limited)"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        # Check if already verified
        if user.email_verified and not user.pending_email:
            return Response(
                {'error': 'Email is already verified'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check rate limit
        can_send, seconds_remaining = can_send_verification_email(user)
        if not can_send:
            minutes = seconds_remaining // 60
            seconds = seconds_remaining % 60
            return Response(
                {
                    'error': f'Please wait {minutes}m {seconds}s before requesting another email',
                    'seconds_remaining': seconds_remaining
                },
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )

        # Determine token type and target email
        if user.pending_email:
            token_type = EmailVerificationToken.TOKEN_TYPE_CHANGE
            is_email_change = True
        else:
            token_type = EmailVerificationToken.TOKEN_TYPE_VERIFY
            is_email_change = False

        # Create new token
        token = EmailVerificationToken.create_token(user, token_type)

        # Send email
        if send_verification_email(user, token, is_email_change=is_email_change):
            return Response({'message': 'Verification email sent'})
        else:
            return Response(
                {'error': 'Failed to send email. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ChangeEmail(APIView):
    """Request email change (requires verification of new email)"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        new_email = request.data.get('new_email', '').strip().lower()

        if not new_email:
            return Response(
                {'error': 'New email is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate email format
        try:
            validate_email(new_email)
        except ValidationError:
            return Response(
                {'error': 'Invalid email format'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if same as current email
        if new_email.lower() == user.email.lower():
            return Response(
                {'error': 'New email must be different from current email'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if email is already in use by another user (case-insensitive)
        if User.objects.filter(email__iexact=new_email).exclude(pk=user.pk).exists():
            return Response(
                {'error': 'This email is already in use'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check rate limit
        can_send, seconds_remaining = can_send_verification_email(user)
        if not can_send:
            minutes = seconds_remaining // 60
            seconds = seconds_remaining % 60
            return Response(
                {
                    'error': f'Please wait {minutes}m {seconds}s before requesting another email',
                    'seconds_remaining': seconds_remaining
                },
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )

        # Set pending email
        user.pending_email = new_email
        user.save(update_fields=['pending_email'])

        # Create token for email change
        token = EmailVerificationToken.create_token(
            user,
            EmailVerificationToken.TOKEN_TYPE_CHANGE
        )

        # Send verification to NEW email
        if send_verification_email(user, token, is_email_change=True):
            return Response({
                'message': 'Verification email sent to your new email address',
                'pending_email': new_email
            })
        else:
            # Rollback pending email on failure
            user.pending_email = None
            user.save(update_fields=['pending_email'])
            return Response(
                {'error': 'Failed to send email. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CancelEmailChange(APIView):
    """Cancel a pending email change"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        if not user.pending_email:
            return Response(
                {'error': 'No pending email change to cancel'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Clear pending email and delete any change tokens
        user.pending_email = None
        user.save(update_fields=['pending_email'])

        # Delete any pending email change tokens
        EmailVerificationToken.objects.filter(
            user=user,
            token_type=EmailVerificationToken.TOKEN_TYPE_CHANGE
        ).delete()

        return Response({'message': 'Email change cancelled'})