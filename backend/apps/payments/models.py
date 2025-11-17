from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class PaymentSettings(models.Model):
    """Store Binance Pay API settings"""
    binance_api_key = models.CharField(max_length=500, blank=True)
    binance_api_secret = models.CharField(max_length=500, blank=True)
    binance_enabled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'payment_settings'
        verbose_name = 'Payment Settings'
        verbose_name_plural = 'Payment Settings'
    
    def __str__(self):
        return f"Payment Settings (Updated: {self.updated_at})"


class PaymentTransaction(models.Model):
    """Store payment transaction records"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('verified', 'Verified'),
        ('failed', 'Failed'),
        ('expired', 'Expired'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='payment_transactions')
    binance_order_id = models.CharField(max_length=255, unique=True)
    transaction_id = models.CharField(max_length=255, blank=True)
    amount = models.DecimalField(max_digits=20, decimal_places=8)
    currency = models.CharField(max_length=10, default='USDT')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    from_account = models.CharField(max_length=255, blank=True)
    payer_binance_id = models.CharField(max_length=255, blank=True)
    order_type = models.CharField(max_length=50, blank=True)
    transaction_time = models.BigIntegerField(null=True, blank=True)  # Timestamp in milliseconds
    verified_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'payment_transactions'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['binance_order_id']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.binance_order_id} - {self.amount} {self.currency} ({self.status})"

