"""
Pytest configuration and shared fixtures for the Excel Autograder project.
"""
import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token

from users.models import User


@pytest.fixture
def api_client():
    """Return an unauthenticated API client."""
    return APIClient()


@pytest.fixture
def user_factory(db):
    """Factory for creating test users."""
    def create_user(
        username=None,
        email=None,
        password='testpass123',
        **kwargs
    ):
        from faker import Faker
        fake = Faker()
        
        if username is None:
            username = fake.user_name()
        if email is None:
            email = fake.email()
            
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            **kwargs
        )
        return user
    return create_user


@pytest.fixture
def user(user_factory):
    """Return a single test user."""
    return user_factory()


@pytest.fixture
def authenticated_client(api_client, user):
    """Return an API client authenticated with a test user."""
    token, _ = Token.objects.get_or_create(user=user)
    api_client.credentials(HTTP_AUTHORIZATION=f'Token {token.key}')
    return api_client


@pytest.fixture
def sample_xlsx_file():
    """Return a minimal valid XLSX file for testing."""
    # This is a minimal valid XLSX file (empty workbook)
    # In production tests, you might want to use openpyxl to create actual test files
    xlsx_content = (
        b'PK\x03\x04\x14\x00\x00\x00\x08\x00\x00\x00!\x00'
        b'\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'
    )
    return SimpleUploadedFile(
        name='test.xlsx',
        content=xlsx_content,
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )


@pytest.fixture
def assignment_factory(db, user_factory):
    """Factory for creating test assignments."""
    def create_assignment(
        name=None,
        owner=None,
        questions=None,
        **kwargs
    ):
        from faker import Faker
        from assignments.models import Assignment
        from django.core.files.uploadedfile import SimpleUploadedFile
        
        fake = Faker()
        
        if name is None:
            name = f"Test Assignment {fake.word()}"
        if owner is None:
            owner = user_factory()
        if questions is None:
            questions = []
            
        # Create a simple test file
        file = SimpleUploadedFile(
            name='test.xlsx',
            content=b'PK\x03\x04',  # Minimal file header
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        
        assignment = Assignment.objects.create(
            name=name,
            owner=owner,
            file=file,
            questions=questions,
            **kwargs
        )
        return assignment
    return create_assignment


@pytest.fixture
def assignment(assignment_factory, user):
    """Return a single test assignment owned by the test user."""
    return assignment_factory(owner=user)


# Markers for test categorization
def pytest_configure(config):
    """Register custom markers."""
    config.addinivalue_line("markers", "unit: mark test as a unit test")
    config.addinivalue_line("markers", "integration: mark test as an integration test")
    config.addinivalue_line("markers", "slow: mark test as slow running")

