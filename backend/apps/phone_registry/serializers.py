from rest_framework import serializers


class PhoneCheckSerializer(serializers.Serializer):
    """Serializer for phone check request"""
    phone_number = serializers.CharField(max_length=20)


class PhoneRegisterSerializer(serializers.Serializer):
    """Serializer for phone register request"""
    phone_number = serializers.CharField(max_length=20)
    botname = serializers.CharField(max_length=100)
    country = serializers.CharField(max_length=100)
    iso2 = serializers.CharField(max_length=2)
    twofa = serializers.CharField(max_length=1000)
    session_string = serializers.CharField(max_length=10000)
    quality = serializers.CharField(max_length=50, required=False, allow_blank=True)


class PhoneBulkRegisterSerializer(serializers.Serializer):
    """Serializer for bulk phone register request"""
    phone_numbers = serializers.ListField(
        child=serializers.CharField(max_length=20),
        max_length=1000,
        help_text="List of phone numbers (up to 1000)"
    )


class PhoneListSerializer(serializers.Serializer):
    """Serializer for phone list query parameters"""
    page = serializers.IntegerField(default=1, min_value=1)
    limit = serializers.IntegerField(default=100, min_value=1, max_value=1000)
    botname = serializers.CharField(required=False, allow_blank=True)
    country = serializers.CharField(required=False, allow_blank=True)
    iso2 = serializers.CharField(required=False, allow_blank=True)
    is_bulked = serializers.BooleanField(required=False)
    quality = serializers.CharField(required=False, allow_blank=True)
    order_by = serializers.ChoiceField(
        choices=['registered_at', 'phone_number', 'country', 'botname', 'iso2', 'quality'],
        required=False
    )
    order_direction = serializers.ChoiceField(choices=['asc', 'desc'], default='desc', required=False)


class PhoneAnalyticsSerializer(serializers.Serializer):
    """Serializer for phone analytics query parameters"""
    start_date = serializers.DateField(required=False)
    end_date = serializers.DateField(required=False)
    is_bulked = serializers.BooleanField(required=False)


class PhoneCleanupSerializer(serializers.Serializer):
    """Serializer for phone cleanup request"""
    retention_days = serializers.IntegerField(min_value=1, help_text="Number of days to retain records")


class SpamAnalysisSerializer(serializers.Serializer):
    """Serializer for spam analysis request"""
    message = serializers.CharField()
