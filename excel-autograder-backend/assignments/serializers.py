import time
import uuid

from rest_framework import serializers
from .models import Assignment


class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = ('uuid', 'name', 'file', 'created_at', 'updated_at', 'encrypted')
        read_only_fields = ('created_at', 'updated_at')

    def create(self, validated_data):
        return Assignment.objects.create(uuid=uuid.uuid4(), created_at=time.time(),
                                         updated_at=time.time(), **validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.file = validated_data.get('file', instance.file)
        instance.encrypted = validated_data.get('encrypted', instance.encrypted)
        instance.data = validated_data.get('data', instance.data)
        instance.updated_at = time.time()
        instance.save()
        return instance
