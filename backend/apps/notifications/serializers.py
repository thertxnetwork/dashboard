from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for Notification model"""
    
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'type', 'is_read', 'created_at']
        read_only_fields = ['id', 'created_at']


class SendNotificationSerializer(serializers.Serializer):
    """Serializer for sending notifications"""
    user_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        help_text="List of user IDs to send notification to. If empty, sends to all users."
    )
    title = serializers.CharField(max_length=255)
    message = serializers.CharField()
    type = serializers.ChoiceField(
        choices=['info', 'success', 'warning', 'error'],
        default='info'
    )
