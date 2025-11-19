from django.db import models
from django.conf import settings


class CheckAPIConfig(models.Model):
    """Store configuration for external Check API"""
    name = models.CharField(max_length=100, unique=True, default='default')
    api_key = models.CharField(max_length=255, help_text="API Key for Check API")
    base_url = models.URLField(default='http://checkapi.org', help_text="Base URL for Check API")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'phone_registry_api_config'
        verbose_name = 'Check API Configuration'
        verbose_name_plural = 'Check API Configurations'

    def __str__(self):
        return f"{self.name} - {self.base_url}"
