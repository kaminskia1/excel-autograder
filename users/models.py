import secrets
from datetime import timedelta

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from rest_framework.authtoken.models import Token


class User(AbstractUser):
    metadata = models.JSONField(default=dict, blank=True)
    email_verified = models.BooleanField(default=False)
    pending_email = models.EmailField(blank=True, null=True)
    last_verification_email_sent = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.username


class EmailVerificationToken(models.Model):
    TOKEN_TYPE_VERIFY = 'verify'
    TOKEN_TYPE_CHANGE = 'change'
    TOKEN_TYPE_CHOICES = [
        (TOKEN_TYPE_VERIFY, 'Verify'),
        (TOKEN_TYPE_CHANGE, 'Change'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='verification_tokens')
    token = models.CharField(max_length=64, unique=True)
    token_type = models.CharField(max_length=10, choices=TOKEN_TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    class Meta:
        indexes = [
            models.Index(fields=['token']),
            models.Index(fields=['expires_at']),
        ]

    @classmethod
    def create_token(cls, user, token_type, expiry_days=7):
        """Generate a cryptographically secure token for email verification."""
        token = secrets.token_urlsafe(48)
        expires = timezone.now() + timedelta(days=expiry_days)
        # Delete any existing tokens for this user/type
        cls.objects.filter(user=user, token_type=token_type).delete()
        return cls.objects.create(
            user=user,
            token=token,
            token_type=token_type,
            expires_at=expires
        )

    @classmethod
    def cleanup_expired(cls):
        """Delete all expired tokens."""
        cls.objects.filter(expires_at__lt=timezone.now()).delete()

    def is_expired(self):
        return timezone.now() > self.expires_at

    def __str__(self):
        return f"{self.user.username} - {self.token_type} - {self.token[:8]}..."


def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
