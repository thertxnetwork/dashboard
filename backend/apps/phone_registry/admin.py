from django.contrib import admin
from .models import CheckAPIConfig


@admin.register(CheckAPIConfig)
class CheckAPIConfigAdmin(admin.ModelAdmin):
    list_display = ('name', 'base_url', 'is_active', 'created_at', 'updated_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'base_url')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'is_active')
        }),
        ('API Configuration', {
            'fields': ('base_url', 'api_key')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
