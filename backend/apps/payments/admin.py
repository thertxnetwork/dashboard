from django.contrib import admin
from .models import PaymentSettings, PaymentTransaction


@admin.register(PaymentSettings)
class PaymentSettingsAdmin(admin.ModelAdmin):
    list_display = ['id', 'binance_enabled', 'updated_at']
    fieldsets = (
        ('Binance Pay Settings', {
            'fields': ('binance_api_key', 'binance_api_secret', 'binance_enabled')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ('created_at', 'updated_at')


@admin.register(PaymentTransaction)
class PaymentTransactionAdmin(admin.ModelAdmin):
    list_display = ['binance_order_id', 'user', 'amount', 'currency', 'status', 'created_at']
    list_filter = ['status', 'currency', 'created_at']
    search_fields = ['binance_order_id', 'transaction_id', 'user__email', 'user__username']
    readonly_fields = ('created_at', 'updated_at', 'verified_at')
    fieldsets = (
        ('Transaction Info', {
            'fields': ('user', 'binance_order_id', 'transaction_id', 'status')
        }),
        ('Payment Details', {
            'fields': ('amount', 'currency', 'from_account', 'payer_binance_id', 'order_type')
        }),
        ('Timestamps', {
            'fields': ('transaction_time', 'verified_at', 'created_at', 'updated_at')
        }),
        ('Additional Info', {
            'fields': ('notes', 'metadata'),
            'classes': ('collapse',)
        }),
    )

