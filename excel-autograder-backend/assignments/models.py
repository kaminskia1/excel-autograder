import uuid
from django.db import models
from rest_framework.exceptions import ValidationError


def validate_file_extension(value):
	file_extension = value.name.split('.')[-1].lower()
	allowed_extensions = ['xlsx']
	if file_extension not in allowed_extensions:
		raise ValidationError('Invalid file extension. Allowed extensions are: xlsx')


class Assignment(models.Model):
	uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	name = models.CharField(max_length=100)
	owner = models.ForeignKey('users.User', related_name='user', on_delete=models.CASCADE)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	file = models.FileField(upload_to='assignments/', validators=[validate_file_extension])
	encrypted = models.BooleanField(default=False)
	data = models.JSONField(default=dict)

	def __str__(self):
		return self.name

