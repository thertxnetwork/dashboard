# Generated migration

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CheckAPIConfig',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='default', max_length=100, unique=True)),
                ('api_key', models.CharField(help_text='API Key for Check API', max_length=255)),
                ('base_url', models.URLField(default='http://checkapi.org', help_text='Base URL for Check API')),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Check API Configuration',
                'verbose_name_plural': 'Check API Configurations',
                'db_table': 'phone_registry_api_config',
            },
        ),
    ]
