from django.db import models
from django.conf import settings


class Report(models.Model):
    """Generated reports"""
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    type = models.CharField(
        max_length=50,
        choices=[
            ('user', 'User Report'),
            ('activity', 'Activity Report'),
            ('system', 'System Report'),
        ]
    )
    filters = models.JSONField(default=dict, blank=True)
    file_path = models.CharField(max_length=500, blank=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('processing', 'Processing'),
            ('completed', 'Completed'),
            ('failed', 'Failed'),
        ],
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'reports'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.status}"
