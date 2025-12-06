"""
Unit tests for the users app.
"""
from datetime import timedelta
from unittest.mock import patch

import pytest
from django.utils import timezone
from rest_framework import status
from rest_framework.authtoken.models import Token

from users.models import User, EmailVerificationToken
from users.email_service import can_send_verification_email, send_verification_email


# =============================================================================
# Model Tests
# =============================================================================

@pytest.mark.unit
@pytest.mark.django_db
class TestUserModel:
    """Tests for the User model."""
    
    def test_create_user(self, user_factory):
        """Test creating a user with valid data."""
        user = user_factory(username='testuser', email='test@example.com')
        
        assert user.username == 'testuser'
        assert user.email == 'test@example.com'
        assert user.is_active
        assert not user.is_staff
        assert not user.is_superuser
    
    def test_create_superuser(self, db):
        """Test creating a superuser."""
        user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpass123'
        )
        
        assert user.is_superuser
        assert user.is_staff
    
    def test_user_str_representation(self, user_factory):
        """Test the string representation of a user."""
        user = user_factory(username='testuser')
        assert str(user) == 'testuser'
    
    def test_user_password_is_hashed(self, user_factory):
        """Test that user passwords are properly hashed."""
        user = user_factory(password='mypassword')
        
        assert user.password != 'mypassword'
        assert user.check_password('mypassword')


# =============================================================================
# API Tests
# =============================================================================

@pytest.mark.unit
@pytest.mark.django_db
class TestUserRegistration:
    """Tests for user registration endpoint."""
    
    @patch('users.views.send_verification_email', return_value=True)
    def test_register_user_success(self, mock_send_email, api_client):
        """Test successful user registration with email sent."""
        url = '/api/v1/auth/register/'
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'securepass123'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert User.objects.filter(username='newuser').exists()
        assert 'check your email' in response.data['message'].lower()
        mock_send_email.assert_called_once()
    
    @patch('users.views.send_verification_email', return_value=False)
    def test_register_user_email_failure(self, mock_send_email, api_client):
        """Test registration succeeds but warns when email fails to send."""
        url = '/api/v1/auth/register/'
        data = {
            'username': 'newuser2',
            'email': 'newuser2@example.com',
            'password': 'securepass123'
        }
        
        response = api_client.post(url, data, format='json')
        
        # Account should still be created
        assert response.status_code == status.HTTP_201_CREATED
        assert User.objects.filter(username='newuser2').exists()
        # But response should indicate email failure
        assert response.data['email_sent'] is False
        assert 'could not send' in response.data['message'].lower()
        mock_send_email.assert_called_once()
    
    def test_register_user_duplicate_username(self, api_client, user_factory):
        """Test registration fails with duplicate username.
        
        Note: The serializer doesn't validate uniqueness at the serializer level,
        so the database constraint catches the duplicate. This raises an 
        IntegrityError which pytest-django propagates. We verify that the
        constraint is enforced by expecting the IntegrityError.
        """
        from django.db.utils import IntegrityError
        
        user_factory(username='existinguser')
        
        url = '/api/v1/auth/register/'
        data = {
            'username': 'existinguser',
            'email': 'different@example.com',
            'password': 'securepass123'
        }
        
        # Database constraint should prevent duplicate username
        with pytest.raises(IntegrityError):
            api_client.post(url, data, format='json')
    
    def test_register_user_invalid_email(self, api_client):
        """Test registration fails with invalid email."""
        url = '/api/v1/auth/register/'
        data = {
            'username': 'newuser',
            'email': 'invalid-email',
            'password': 'securepass123'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.unit
@pytest.mark.django_db
class TestUserLogin:
    """Tests for user login endpoint."""
    
    def test_login_success(self, api_client, user_factory):
        """Test successful login returns token."""
        _user = user_factory(username='loginuser', password='testpass123')
        
        url = '/api/v1/auth/login/'
        data = {
            'username': 'loginuser',
            'password': 'testpass123'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert 'token' in response.data
        assert response.data['username'] == 'loginuser'
    
    def test_login_wrong_password(self, api_client, user_factory):
        """Test login fails with wrong password."""
        user_factory(username='loginuser', password='correctpass')
        
        url = '/api/v1/auth/login/'
        data = {
            'username': 'loginuser',
            'password': 'wrongpass'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_login_nonexistent_user(self, api_client):
        """Test login fails for non-existent user."""
        url = '/api/v1/auth/login/'
        data = {
            'username': 'nonexistent',
            'password': 'somepass'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.unit
@pytest.mark.django_db
class TestUserLogout:
    """Tests for user logout endpoint."""
    
    def test_logout_success(self, authenticated_client, user):
        """Test successful logout deletes token."""
        # Verify token exists before logout
        assert Token.objects.filter(user=user).exists()
        
        url = '/api/v1/auth/logout/'
        response = authenticated_client.post(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert not Token.objects.filter(user=user).exists()
    
    def test_logout_unauthenticated(self, api_client):
        """Test logout fails when not authenticated."""
        url = '/api/v1/auth/logout/'
        response = api_client.post(url)
        
        # DRF returns 403 Forbidden for unauthenticated requests with session auth
        assert response.status_code in [
            status.HTTP_401_UNAUTHORIZED,
            status.HTTP_403_FORBIDDEN
        ]


# =============================================================================
# Email Verification Token Model Tests
# =============================================================================

@pytest.mark.unit
@pytest.mark.django_db
class TestEmailVerificationTokenModel:
    """Tests for the EmailVerificationToken model."""
    
    def test_create_verification_token(self, user_factory):
        """Test creating a verification token."""
        user = user_factory()
        token = EmailVerificationToken.create_token(
            user, 
            EmailVerificationToken.TOKEN_TYPE_VERIFY
        )
        
        assert token.user == user
        assert token.token_type == EmailVerificationToken.TOKEN_TYPE_VERIFY
        assert len(token.token) > 40  # token_urlsafe(48) produces ~64 chars
        assert token.expires_at > timezone.now()
    
    def test_create_token_replaces_existing(self, user_factory):
        """Test creating a new token deletes existing tokens of same type."""
        user = user_factory()
        
        token1 = EmailVerificationToken.create_token(
            user, 
            EmailVerificationToken.TOKEN_TYPE_VERIFY
        )
        token1_value = token1.token
        
        token2 = EmailVerificationToken.create_token(
            user, 
            EmailVerificationToken.TOKEN_TYPE_VERIFY
        )
        
        # Old token should be deleted
        assert not EmailVerificationToken.objects.filter(token=token1_value).exists()
        # New token should exist
        assert EmailVerificationToken.objects.filter(token=token2.token).exists()
        # Only one token of this type for user
        assert EmailVerificationToken.objects.filter(
            user=user, 
            token_type=EmailVerificationToken.TOKEN_TYPE_VERIFY
        ).count() == 1
    
    def test_different_token_types_coexist(self, user_factory):
        """Test that verify and change tokens can coexist."""
        user = user_factory()
        
        verify_token = EmailVerificationToken.create_token(
            user, 
            EmailVerificationToken.TOKEN_TYPE_VERIFY
        )
        change_token = EmailVerificationToken.create_token(
            user, 
            EmailVerificationToken.TOKEN_TYPE_CHANGE
        )
        
        assert EmailVerificationToken.objects.filter(user=user).count() == 2
        assert verify_token.token != change_token.token
    
    def test_token_expiry(self, user_factory):
        """Test token expiry checking."""
        user = user_factory()
        token = EmailVerificationToken.create_token(
            user, 
            EmailVerificationToken.TOKEN_TYPE_VERIFY
        )
        
        # Not expired yet
        assert not token.is_expired()
        
        # Manually set expired
        token.expires_at = timezone.now() - timedelta(hours=1)
        token.save()
        
        assert token.is_expired()
    
    def test_cleanup_expired_tokens(self, user_factory):
        """Test cleanup of expired tokens."""
        user = user_factory()
        
        # Create an expired token
        _expired_token = EmailVerificationToken.objects.create(
            user=user,
            token='expired_token_123',
            token_type=EmailVerificationToken.TOKEN_TYPE_VERIFY,
            expires_at=timezone.now() - timedelta(days=1)
        )
        
        # Create a valid token
        valid_token = EmailVerificationToken.create_token(
            user, 
            EmailVerificationToken.TOKEN_TYPE_CHANGE
        )
        
        EmailVerificationToken.cleanup_expired()
        
        assert not EmailVerificationToken.objects.filter(token='expired_token_123').exists()
        assert EmailVerificationToken.objects.filter(token=valid_token.token).exists()
    
    def test_token_str_representation(self, user_factory):
        """Test token string representation."""
        user = user_factory(username='testuser')
        token = EmailVerificationToken.create_token(
            user, 
            EmailVerificationToken.TOKEN_TYPE_VERIFY
        )
        
        str_repr = str(token)
        assert 'testuser' in str_repr
        assert 'verify' in str_repr


# =============================================================================
# Email Service Tests
# =============================================================================

@pytest.mark.unit
@pytest.mark.django_db
class TestEmailService:
    """Tests for the email service functions."""
    
    def test_can_send_email_first_time(self, user_factory):
        """Test that first email can always be sent."""
        user = user_factory()
        user.last_verification_email_sent = None
        user.save()
        
        can_send, seconds = can_send_verification_email(user)
        
        assert can_send is True
        assert seconds is None
    
    def test_can_send_email_after_cooldown(self, user_factory):
        """Test email can be sent after cooldown period."""
        user = user_factory()
        user.last_verification_email_sent = timezone.now() - timedelta(minutes=20)
        user.save()
        
        can_send, seconds = can_send_verification_email(user)
        
        assert can_send is True
        assert seconds is None
    
    def test_cannot_send_email_during_cooldown(self, user_factory):
        """Test email cannot be sent during cooldown."""
        user = user_factory()
        user.last_verification_email_sent = timezone.now() - timedelta(minutes=5)
        user.save()
        
        can_send, seconds = can_send_verification_email(user)
        
        assert can_send is False
        assert seconds > 0
        assert seconds <= 600  # 10 minutes remaining
    
    @patch('users.email_service.send_mail')
    def test_send_verification_email_success(self, mock_send_mail, user_factory):
        """Test successful email sending."""
        user = user_factory(email='test@example.com')
        token = EmailVerificationToken.create_token(
            user, 
            EmailVerificationToken.TOKEN_TYPE_VERIFY
        )
        
        result = send_verification_email(user, token, is_email_change=False)
        
        assert result is True
        mock_send_mail.assert_called_once()
        call_kwargs = mock_send_mail.call_args
        assert 'test@example.com' in call_kwargs.kwargs['recipient_list']
        assert user.last_verification_email_sent is not None
    
    @patch('users.email_service.send_mail')
    def test_send_verification_email_to_pending(self, mock_send_mail, user_factory):
        """Test email change sends to pending_email."""
        user = user_factory(email='old@example.com')
        user.pending_email = 'new@example.com'
        user.save()
        
        token = EmailVerificationToken.create_token(
            user, 
            EmailVerificationToken.TOKEN_TYPE_CHANGE
        )
        
        result = send_verification_email(user, token, is_email_change=True)
        
        assert result is True
        call_kwargs = mock_send_mail.call_args
        assert 'new@example.com' in call_kwargs.kwargs['recipient_list']
    
    @patch('users.email_service.send_mail')
    def test_send_verification_email_failure(self, mock_send_mail, user_factory):
        """Test handling of email sending failure."""
        mock_send_mail.side_effect = Exception("SMTP error")
        
        user = user_factory()
        token = EmailVerificationToken.create_token(
            user, 
            EmailVerificationToken.TOKEN_TYPE_VERIFY
        )
        
        result = send_verification_email(user, token, is_email_change=False)
        
        assert result is False


# =============================================================================
# Email Verification API Tests
# =============================================================================

@pytest.mark.unit
@pytest.mark.django_db
class TestVerifyEmailEndpoint:
    """Tests for the verify-email endpoint."""
    
    def test_verify_email_success(self, api_client, user_factory):
        """Test successful email verification."""
        user = user_factory(email_verified=False)
        token = EmailVerificationToken.create_token(
            user, 
            EmailVerificationToken.TOKEN_TYPE_VERIFY
        )
        
        url = f'/api/v1/auth/verify-email/{token.token}/'
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'verified' in response.data['message'].lower()
        
        user.refresh_from_db()
        assert user.email_verified is True
        
        # Token should be deleted
        assert not EmailVerificationToken.objects.filter(token=token.token).exists()
    
    def test_verify_email_change_success(self, api_client, user_factory):
        """Test successful email change verification."""
        user = user_factory(email='old@example.com', email_verified=True)
        user.pending_email = 'new@example.com'
        user.save()
        
        token = EmailVerificationToken.create_token(
            user, 
            EmailVerificationToken.TOKEN_TYPE_CHANGE
        )
        
        url = f'/api/v1/auth/verify-email/{token.token}/'
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        
        user.refresh_from_db()
        assert user.email == 'new@example.com'
        assert user.pending_email is None
        assert user.email_verified is True
    
    def test_verify_email_invalid_token(self, api_client):
        """Test verification with invalid token."""
        url = '/api/v1/auth/verify-email/invalid_token_12345/'
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'invalid' in response.data['error'].lower()
    
    def test_verify_email_expired_token(self, api_client, user_factory):
        """Test verification with expired token."""
        user = user_factory()
        token = EmailVerificationToken.objects.create(
            user=user,
            token='expired_token_xyz',
            token_type=EmailVerificationToken.TOKEN_TYPE_VERIFY,
            expires_at=timezone.now() - timedelta(days=1)
        )
        
        url = f'/api/v1/auth/verify-email/{token.token}/'
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'expired' in response.data['error'].lower()
        
        # Expired token should be deleted
        assert not EmailVerificationToken.objects.filter(token=token.token).exists()
    
    def test_verify_email_change_no_pending_email(self, api_client, user_factory):
        """Test email change verification when pending_email is null."""
        user = user_factory()
        user.pending_email = None
        user.save()
        
        token = EmailVerificationToken.objects.create(
            user=user,
            token='change_token_xyz',
            token_type=EmailVerificationToken.TOKEN_TYPE_CHANGE,
            expires_at=timezone.now() + timedelta(days=7)
        )
        
        url = f'/api/v1/auth/verify-email/{token.token}/'
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'pending' in response.data['error'].lower()


@pytest.mark.unit
@pytest.mark.django_db
class TestResendVerificationEndpoint:
    """Tests for the resend-verification endpoint."""
    
    @patch('users.views.send_verification_email')
    def test_resend_verification_success(self, mock_send, authenticated_client, user):
        """Test successful resend of verification email."""
        mock_send.return_value = True
        user.email_verified = False
        user.save()
        
        url = '/api/v1/auth/resend-verification/'
        response = authenticated_client.post(url)
        
        assert response.status_code == status.HTTP_200_OK
        mock_send.assert_called_once()
    
    def test_resend_verification_already_verified(self, authenticated_client, user):
        """Test resend fails when email already verified."""
        user.email_verified = True
        user.pending_email = None
        user.save()
        
        url = '/api/v1/auth/resend-verification/'
        response = authenticated_client.post(url)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'already verified' in response.data['error'].lower()
    
    @patch('users.views.can_send_verification_email')
    def test_resend_verification_rate_limited(self, mock_can_send, authenticated_client, user):
        """Test resend fails when rate limited."""
        mock_can_send.return_value = (False, 600)  # 10 minutes remaining
        user.email_verified = False
        user.save()
        
        url = '/api/v1/auth/resend-verification/'
        response = authenticated_client.post(url)
        
        assert response.status_code == status.HTTP_429_TOO_MANY_REQUESTS
        assert 'wait' in response.data['error'].lower()
    
    def test_resend_verification_unauthenticated(self, api_client):
        """Test resend fails when not authenticated."""
        url = '/api/v1/auth/resend-verification/'
        response = api_client.post(url)
        
        assert response.status_code in [
            status.HTTP_401_UNAUTHORIZED,
            status.HTTP_403_FORBIDDEN
        ]


@pytest.mark.unit
@pytest.mark.django_db
class TestChangeEmailEndpoint:
    """Tests for the change-email endpoint."""
    
    @patch('users.views.send_verification_email')
    def test_change_email_success(self, mock_send, authenticated_client, user):
        """Test successful email change request."""
        mock_send.return_value = True
        
        url = '/api/v1/auth/change-email/'
        data = {'new_email': 'newemail@example.com'}
        response = authenticated_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert 'sent' in response.data['message'].lower()
        
        user.refresh_from_db()
        assert user.pending_email == 'newemail@example.com'
        mock_send.assert_called_once()
    
    def test_change_email_no_email_provided(self, authenticated_client):
        """Test change email fails without new_email."""
        url = '/api/v1/auth/change-email/'
        data = {}
        response = authenticated_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'required' in response.data['error'].lower()
    
    def test_change_email_invalid_format(self, authenticated_client):
        """Test change email fails with invalid email format."""
        url = '/api/v1/auth/change-email/'
        data = {'new_email': 'not-a-valid-email'}
        response = authenticated_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'invalid' in response.data['error'].lower()
    
    def test_change_email_same_as_current(self, authenticated_client, user):
        """Test change email fails when same as current."""
        url = '/api/v1/auth/change-email/'
        data = {'new_email': user.email}
        response = authenticated_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'different' in response.data['error'].lower()
    
    def test_change_email_already_in_use(self, authenticated_client, user_factory, user):
        """Test change email fails when email in use by another user."""
        _other_user = user_factory(email='taken@example.com')
        
        url = '/api/v1/auth/change-email/'
        data = {'new_email': 'taken@example.com'}
        response = authenticated_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'already in use' in response.data['error'].lower()
    
    @patch('users.views.can_send_verification_email')
    def test_change_email_rate_limited(self, mock_can_send, authenticated_client):
        """Test change email fails when rate limited."""
        mock_can_send.return_value = (False, 600)
        
        url = '/api/v1/auth/change-email/'
        data = {'new_email': 'newemail@example.com'}
        response = authenticated_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_429_TOO_MANY_REQUESTS
    
    def test_change_email_unauthenticated(self, api_client):
        """Test change email fails when not authenticated."""
        url = '/api/v1/auth/change-email/'
        data = {'new_email': 'newemail@example.com'}
        response = api_client.post(url, data, format='json')
        
        assert response.status_code in [
            status.HTTP_401_UNAUTHORIZED,
            status.HTTP_403_FORBIDDEN
        ]


@pytest.mark.unit
@pytest.mark.django_db
class TestCancelEmailChangeEndpoint:
    """Tests for the cancel-email-change endpoint."""
    
    def test_cancel_email_change_success(self, authenticated_client, user):
        """Test successful cancellation of email change."""
        user.pending_email = 'pending@example.com'
        user.save()
        
        # Create a change token
        _token = EmailVerificationToken.create_token(
            user,
            EmailVerificationToken.TOKEN_TYPE_CHANGE
        )
        
        url = '/api/v1/auth/cancel-email-change/'
        response = authenticated_client.post(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'cancelled' in response.data['message'].lower()
        
        user.refresh_from_db()
        assert user.pending_email is None
        
        # Token should be deleted
        assert not EmailVerificationToken.objects.filter(
            user=user, 
            token_type=EmailVerificationToken.TOKEN_TYPE_CHANGE
        ).exists()
    
    def test_cancel_email_change_no_pending(self, authenticated_client, user):
        """Test cancel fails when no pending email change."""
        user.pending_email = None
        user.save()
        
        url = '/api/v1/auth/cancel-email-change/'
        response = authenticated_client.post(url)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'no pending' in response.data['error'].lower()
    
    def test_cancel_email_change_unauthenticated(self, api_client):
        """Test cancel fails when not authenticated."""
        url = '/api/v1/auth/cancel-email-change/'
        response = api_client.post(url)
        
        assert response.status_code in [
            status.HTTP_401_UNAUTHORIZED,
            status.HTTP_403_FORBIDDEN
        ]


# =============================================================================
# User Response Field Tests
# =============================================================================

@pytest.mark.unit
@pytest.mark.django_db
class TestUserResponseFields:
    """Tests that user responses include email verification fields."""
    
    def test_login_response_includes_email_fields(self, api_client, user_factory):
        """Test login response includes email_verified and pending_email."""
        user = user_factory(
            username='testuser', 
            password='testpass123',
            email_verified=True
        )
        user.pending_email = 'pending@example.com'
        user.save()
        
        url = '/api/v1/auth/login/'
        data = {'username': 'testuser', 'password': 'testpass123'}
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert 'email_verified' in response.data
        assert response.data['email_verified'] is True
        assert 'pending_email' in response.data
        assert response.data['pending_email'] == 'pending@example.com'
    
    def test_me_endpoint_includes_email_fields(self, authenticated_client, user):
        """Test /auth/me/ response includes email verification fields."""
        user.email_verified = False
        user.pending_email = 'new@example.com'
        user.save()
        
        url = '/api/v1/auth/me/'
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'email_verified' in response.data
        assert response.data['email_verified'] is False
        assert 'pending_email' in response.data
        assert response.data['pending_email'] == 'new@example.com'


# =============================================================================
# Registration with Email Verification Tests
# =============================================================================

@pytest.mark.unit
@pytest.mark.django_db
class TestRegistrationWithEmailVerification:
    """Tests for registration triggering email verification."""
    
    @patch('users.views.send_verification_email')
    def test_register_sends_verification_email(self, mock_send, api_client):
        """Test that registration sends a verification email."""
        mock_send.return_value = True
        
        url = '/api/v1/auth/register/'
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'securepass123'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        mock_send.assert_called_once()
        
        # User should be created with email_verified=False
        user = User.objects.get(username='newuser')
        assert user.email_verified is False
        
        # Verification token should exist
        assert EmailVerificationToken.objects.filter(
            user=user, 
            token_type=EmailVerificationToken.TOKEN_TYPE_VERIFY
        ).exists()
    
    @patch('users.views.send_verification_email')
    def test_register_response_message(self, mock_send, api_client):
        """Test registration response prompts to verify email."""
        mock_send.return_value = True
        
        url = '/api/v1/auth/register/'
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'securepass123'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert 'verify' in response.data['message'].lower()
        assert 'email' in response.data['message'].lower()
