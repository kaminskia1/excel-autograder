"""
Test settings for running unit tests.

Uses SQLite for faster test execution and doesn't require PostgreSQL.
"""
from .settings import *  # noqa: F401, F403

# Use SQLite for tests (faster, no external dependencies)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }
}

# Faster password hashing for tests
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]

# Disable migrations for faster test setup
class DisableMigrations:
    def __contains__(self, item):
        return True

    def __getitem__(self, item):
        return None


MIGRATION_MODULES = DisableMigrations()

# Use a local memory cache for tests
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    }
}

# Disable debug mode in tests
DEBUG = False

# Media files for tests
MEDIA_ROOT = '/tmp/excel-autograder-test-media/'

