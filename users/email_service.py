"""
Email service for sending verification emails with rate limiting.
"""
import hmac
from datetime import timedelta

from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.html import strip_tags


def can_send_verification_email(user):
    """
    Check if we can send a verification email to this user based on rate limiting.
    Returns (can_send: bool, seconds_remaining: int or None)
    """
    rate_limit_minutes = getattr(settings, 'EMAIL_RATE_LIMIT_MINUTES', 15)
    
    if not user.last_verification_email_sent:
        return True, None
    
    time_since_last = timezone.now() - user.last_verification_email_sent
    cooldown = timedelta(minutes=rate_limit_minutes)
    
    if time_since_last >= cooldown:
        return True, None
    
    remaining = cooldown - time_since_last
    return False, int(remaining.total_seconds())


def send_verification_email(user, token, is_email_change=False):
    """
    Send a verification email to the user.
    
    Args:
        user: The User instance
        token: The EmailVerificationToken instance
        is_email_change: If True, send to pending_email instead of current email
    
    Returns:
        bool: True if email was sent successfully
    """
    frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:4200')
    verification_url = f"{frontend_url}/verify-email/{token.token}"
    
    # Determine recipient email
    recipient_email = user.pending_email if is_email_change else user.email
    
    # Render email content
    context = {
        'username': user.username,
        'verification_url': verification_url,
        'is_email_change': is_email_change,
        'expiry_days': getattr(settings, 'EMAIL_VERIFICATION_EXPIRY_DAYS', 7),
    }
    
    html_message = render_to_string('emails/verification_email.html', context)
    plain_message = strip_tags(html_message)
    
    subject = 'Verify your email address' if not is_email_change else 'Verify your new email address'
    from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@autograder.com')
    
    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=from_email,
            recipient_list=[recipient_email],
            html_message=html_message,
            fail_silently=False,
        )
        
        # Update rate limit timestamp
        user.last_verification_email_sent = timezone.now()
        user.save(update_fields=['last_verification_email_sent'])
        
        return True
    except Exception as e:
        # Log the error in production
        print(f"Failed to send verification email: {e}")
        return False


def constant_time_compare(val1, val2):
    """
    Return True if the two strings are equal, using constant-time comparison.
    This prevents timing attacks.
    """
    return hmac.compare_digest(val1, val2)


