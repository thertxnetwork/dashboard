from rest_framework import serializers
from .models import PaymentSettings, PaymentTransaction


class PaymentSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentSettings
        fields = ['id', 'binance_api_key', 'binance_api_secret', 'binance_enabled', 'created_at', 'updated_at']
        extra_kwargs = {
            'binance_api_key': {'write_only': True},
            'binance_api_secret': {'write_only': True},
        }
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Mask sensitive data in responses
        if instance.binance_api_key:
            data['binance_api_key_masked'] = instance.binance_api_key[:4] + '****' + instance.binance_api_key[-4:] if len(instance.binance_api_key) > 8 else '****'
        if instance.binance_api_secret:
            data['binance_api_secret_masked'] = '****'
        return data


class PaymentTransactionSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = PaymentTransaction
        fields = [
            'id', 'user', 'user_email', 'binance_order_id', 'transaction_id',
            'amount', 'currency', 'status', 'from_account', 'payer_binance_id',
            'order_type', 'transaction_time', 'verified_at', 'notes', 'metadata',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'verified_at', 'created_at', 'updated_at']


class VerifyPaymentSerializer(serializers.Serializer):
    binance_order_id = serializers.CharField(required=True)
    expected_amount = serializers.DecimalField(max_digits=20, decimal_places=8, required=True)
    currency = serializers.CharField(default='USDT')
    max_age_hours = serializers.IntegerField(default=1, min_value=1, max_value=24)
