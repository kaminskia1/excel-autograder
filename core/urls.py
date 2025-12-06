from django.conf import settings
from django.urls import path, re_path, include, reverse_lazy
from django.contrib import admin
from django.http import HttpResponseForbidden
from django.views.generic.base import RedirectView
from django.views.static import serve
from rest_framework.routers import DefaultRouter
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed

from users.views import (
    UserViewSet, UserLogin, UserLogout, UserCreate, UserMe, ChangePassword,
    VerifyEmail, ResendVerification, ChangeEmail, CancelEmailChange
)
from assignments.views import AssignmentViewSet
from assignments.models import Assignment


def protected_serve(request, path, document_root=None, show_indexes=False):
    """
    Serve media files only to authenticated users who own the associated assignment.
    Prevents IDOR vulnerability by verifying file ownership.
    """
    # Authenticate the request using DRF's token or session authentication
    user = None
    
    # Try token authentication first
    token_auth = TokenAuthentication()
    try:
        auth_result = token_auth.authenticate(request)
        if auth_result:
            user, _ = auth_result
    except AuthenticationFailed:
        pass
    
    # Fall back to session authentication (check if user is already authenticated via Django session)
    if not user and hasattr(request, 'user') and request.user.is_authenticated:
        user = request.user
    
    # If no authenticated user, deny access
    if not user:
        return HttpResponseForbidden("Authentication required")
    
    # Verify ownership by checking if user owns an assignment with this exact file path
    # The file field stores the path relative to MEDIA_ROOT, which should match the requested path
    if not Assignment.objects.filter(owner=user, file=path).exists():
        return HttpResponseForbidden("Access denied")
    
    return serve(request, path, document_root, show_indexes)


router = DefaultRouter()
router.register(r'auth', UserViewSet, basename='users')
router.register(r'assignments', AssignmentViewSet, basename='assignment')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include(router.urls)),
    path('api/v1/auth/login/', UserLogin.as_view()),
    path('api/v1/auth/register/', UserCreate.as_view()),
    path('api/v1/auth/logout/', UserLogout.as_view()),
    path('api/v1/auth/me/', UserMe.as_view()),
    path('api/v1/auth/change-password/', ChangePassword.as_view()),
    path('api/v1/auth/verify-email/<str:token>/', VerifyEmail.as_view()),
    path('api/v1/auth/resend-verification/', ResendVerification.as_view()),
    path('api/v1/auth/change-email/', ChangeEmail.as_view()),
    path('api/v1/auth/cancel-email-change/', CancelEmailChange.as_view()),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    re_path(r'^$', RedirectView.as_view(url=reverse_lazy('api-root'), permanent=False)),
    re_path(r'^api/v1/files/(?P<path>.*)$', protected_serve, {'document_root': settings.MEDIA_ROOT}),
]