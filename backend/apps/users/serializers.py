from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import ActivityLog

User = get_user_model()


class UserListSerializer(serializers.ModelSerializer):
    """Serializer for user list"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'is_staff', 'is_superuser', 'created_at']


class UserDetailSerializer(serializers.ModelSerializer):
    """Serializer for user detail"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone', 'role', 'avatar', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating users"""
    password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'phone', 'role', 'password', 'is_active']
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save()
        return user
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class ActivityLogSerializer(serializers.ModelSerializer):
    """Serializer for activity logs"""
    user = UserListSerializer(read_only=True)
    
    class Meta:
        model = ActivityLog
        fields = ['id', 'user', 'action', 'details', 'ip_address', 'user_agent', 'created_at']
        read_only_fields = fields
