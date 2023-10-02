from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, re_path, include, reverse_lazy
from django.contrib import admin
from django.contrib.auth.decorators import login_required
from django.views.generic.base import RedirectView
from django.views.static import serve
from rest_framework.routers import DefaultRouter

from users.views import UserViewSet, UserLogin, UserLogout, UserCreate
from assignments.views import AssignmentViewSet

@login_required
def protected_serve(request, path, document_root=None, show_indexes=False):
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
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    re_path(r'^$', RedirectView.as_view(url=reverse_lazy('api-root'), permanent=False)),
    re_path(r'^media/(?P<path>.*)$' % static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT),
            protected_serve, {'document_root': settings.MEDIA_ROOT})
]