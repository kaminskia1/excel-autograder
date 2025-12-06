from rest_framework import viewsets, status, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User
from .serializers import UserSerializer


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


class UserMe(APIView):
    """Get current user info or update metadata"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Return current user info"""
        user = request.user
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'uuid': str(user.pk),
            'username': user.username,
            'email': user.email,
            'token': token.key,
            'metadata': user.metadata,
        })

    def patch(self, request):
        """Update user metadata"""
        user = request.user
        if 'metadata' in request.data:
            user.metadata = request.data['metadata']
            user.save()
        return Response({
            'uuid': str(user.pk),
            'username': user.username,
            'email': user.email,
            'metadata': user.metadata,
        })

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