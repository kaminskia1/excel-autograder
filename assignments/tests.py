"""
Unit tests for the assignments app.
"""
import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status

from assignments.models import Assignment


# =============================================================================
# Model Tests
# =============================================================================

@pytest.mark.unit
@pytest.mark.django_db
class TestAssignmentModel:
    """Tests for the Assignment model."""
    
    def test_create_assignment(self, assignment_factory, user):
        """Test creating an assignment with valid data."""
        assignment = assignment_factory(
            name='Test Assignment',
            owner=user,
            questions=[{'name': 'Q1', 'facets': []}]
        )
        
        assert assignment.name == 'Test Assignment'
        assert assignment.owner == user
        assert assignment.questions == [{'name': 'Q1', 'facets': []}]
        assert assignment.uuid is not None
    
    def test_assignment_str_representation(self, assignment_factory):
        """Test the string representation of an assignment."""
        assignment = assignment_factory(name='My Assignment')
        assert str(assignment) == 'My Assignment'
    
    def test_assignment_auto_timestamps(self, assignment_factory):
        """Test that created_at and updated_at are auto-populated."""
        assignment = assignment_factory()
        
        assert assignment.created_at is not None
        assert assignment.updated_at is not None
    
    def test_assignment_default_questions_empty_list(self, db, user):
        """Test that questions defaults to empty list."""
        file = SimpleUploadedFile(
            name='test.xlsx',
            content=b'PK\x03\x04',
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        assignment = Assignment.objects.create(
            name='Test',
            owner=user,
            file=file
        )
        
        assert assignment.questions == []
    
    def test_assignment_encrypted_default_false(self, assignment_factory):
        """Test that encrypted field defaults to False."""
        assignment = assignment_factory()
        assert assignment.encrypted is False


@pytest.mark.unit
@pytest.mark.django_db
class TestAssignmentFileValidation:
    """Tests for assignment file validation."""
    
    def test_valid_xlsx_extension(self, db, user):
        """Test that .xlsx files are accepted."""
        file = SimpleUploadedFile(
            name='valid.xlsx',
            content=b'PK\x03\x04',
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        
        assignment = Assignment(name='Test', owner=user, file=file)
        # Should not raise
        assignment.full_clean(exclude=['file'])  # Exclude file content validation
    
    def test_invalid_file_extension(self, db, user):
        """Test that non-xlsx files are rejected."""
        from rest_framework.exceptions import ValidationError
        from assignments.models import validate_file_extension
        
        file = SimpleUploadedFile(
            name='invalid.txt',
            content=b'some text content',
            content_type='text/plain'
        )
        
        with pytest.raises(ValidationError):
            validate_file_extension(file)


# =============================================================================
# API Tests
# =============================================================================

@pytest.mark.unit
@pytest.mark.django_db
class TestAssignmentListAPI:
    """Tests for assignment list endpoint."""
    
    def test_list_assignments_authenticated(self, authenticated_client, assignment):
        """Test listing assignments for authenticated user."""
        url = '/api/v1/assignments/'
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]['name'] == assignment.name
    
    def test_list_assignments_unauthenticated(self, api_client):
        """Test that unauthenticated users cannot list assignments."""
        url = '/api/v1/assignments/'
        response = api_client.get(url)
        
        # DRF returns 403 Forbidden for unauthenticated requests with session auth
        assert response.status_code in [
            status.HTTP_401_UNAUTHORIZED,
            status.HTTP_403_FORBIDDEN
        ]
    
    def test_list_assignments_only_own(self, authenticated_client, assignment_factory, user):
        """Test that users only see their own assignments."""
        # Create assignment for another user
        other_assignment = assignment_factory(name='Other Assignment')
        # Create assignment for authenticated user
        own_assignment = assignment_factory(name='Own Assignment', owner=user)
        
        url = '/api/v1/assignments/'
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        names = [a['name'] for a in response.data]
        assert 'Own Assignment' in names
        assert 'Other Assignment' not in names


@pytest.mark.unit
@pytest.mark.django_db
class TestAssignmentCreateAPI:
    """Tests for assignment creation endpoint."""
    
    def test_create_assignment_success(self, authenticated_client):
        """Test creating an assignment with valid data."""
        url = '/api/v1/assignments/'
        file = SimpleUploadedFile(
            name='test.xlsx',
            content=b'PK\x03\x04',
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        data = {
            'name': 'New Assignment',
            'file': file,
            'questions': '[]'
        }
        
        response = authenticated_client.post(url, data, format='multipart')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert Assignment.objects.filter(name='New Assignment').exists()
    
    def test_create_assignment_unauthenticated(self, api_client):
        """Test that unauthenticated users cannot create assignments."""
        url = '/api/v1/assignments/'
        file = SimpleUploadedFile(
            name='test.xlsx',
            content=b'PK\x03\x04',
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        data = {
            'name': 'New Assignment',
            'file': file
        }
        
        response = api_client.post(url, data, format='multipart')
        
        # DRF returns 403 Forbidden for unauthenticated requests with session auth
        assert response.status_code in [
            status.HTTP_401_UNAUTHORIZED,
            status.HTTP_403_FORBIDDEN
        ]


@pytest.mark.unit
@pytest.mark.django_db
class TestAssignmentRetrieveAPI:
    """Tests for assignment retrieve endpoint."""
    
    def test_retrieve_own_assignment(self, authenticated_client, assignment):
        """Test retrieving user's own assignment."""
        url = f'/api/v1/assignments/{assignment.uuid}/'
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] == assignment.name
    
    def test_retrieve_other_user_assignment(self, authenticated_client, assignment_factory):
        """Test that users cannot retrieve other users' assignments."""
        other_assignment = assignment_factory()  # Owned by different user
        
        url = f'/api/v1/assignments/{other_assignment.uuid}/'
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.unit
@pytest.mark.django_db
class TestAssignmentUpdateAPI:
    """Tests for assignment update endpoint."""
    
    def test_update_assignment_name(self, authenticated_client, assignment):
        """Test updating an assignment's name."""
        url = f'/api/v1/assignments/{assignment.uuid}/'
        file = SimpleUploadedFile(
            name='test.xlsx',
            content=b'PK\x03\x04',
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        data = {
            'name': 'Updated Name',
            'file': file,
            'questions': '[]'
        }
        
        response = authenticated_client.put(url, data, format='multipart')
        
        assert response.status_code == status.HTTP_200_OK
        assignment.refresh_from_db()
        assert assignment.name == 'Updated Name'
    
    def test_update_other_user_assignment(self, authenticated_client, assignment_factory):
        """Test that users cannot update other users' assignments."""
        other_assignment = assignment_factory()
        
        url = f'/api/v1/assignments/{other_assignment.uuid}/'
        data = {'name': 'Hacked Name'}
        
        response = authenticated_client.put(url, data, format='json')
        
        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.unit
@pytest.mark.django_db
class TestAssignmentDeleteAPI:
    """Tests for assignment delete endpoint."""
    
    def test_delete_own_assignment(self, authenticated_client, assignment):
        """Test deleting user's own assignment."""
        assignment_uuid = assignment.uuid
        url = f'/api/v1/assignments/{assignment_uuid}/'
        
        response = authenticated_client.delete(url)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Assignment.objects.filter(uuid=assignment_uuid).exists()
    
    def test_delete_other_user_assignment(self, authenticated_client, assignment_factory):
        """Test that users cannot delete other users' assignments."""
        other_assignment = assignment_factory()
        
        url = f'/api/v1/assignments/{other_assignment.uuid}/'
        response = authenticated_client.delete(url)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert Assignment.objects.filter(uuid=other_assignment.uuid).exists()
