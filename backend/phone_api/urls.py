from django.urls import path
from . import views

urlpatterns = [
    path('check/', views.check_phone, name='phone-check'),
    path('register/', views.register_phone, name='phone-register'),
    path('bulk-register/', views.bulk_register, name='phone-bulk-register'),
    path('list/', views.list_phones, name='phone-list'),
    path('analytics/', views.analytics, name='phone-analytics'),
    path('cleanup/', views.cleanup, name='phone-cleanup'),
    path('analyze-spam/', views.analyze_spam, name='analyze-spam'),
]
