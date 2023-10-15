# Generated by Django 4.2.5 on 2023-09-30 21:26

import assignments.models
from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Assignment',
            fields=[
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('file', models.FileField(upload_to='', validators=[assignments.models.validate_file_extension])),
                ('encrypted', models.BooleanField(default=False)),
                ('data', models.JSONField(default=[])),
            ],
        ),
    ]
