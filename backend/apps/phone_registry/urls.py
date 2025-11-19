from django.urls import path
from . import views

urlpatterns = [
    path('check/', views.phone_check, name='phone-check'),
    path('register/', views.phone_register, name='phone-register'),
    path('bulk-register/', views.phone_bulk_register, name='phone-bulk-register'),
    path('list/', views.phone_list, name='phone-list'),
    path('analytics/', views.phone_analytics, name='phone-analytics'),
    path('cleanup/', views.phone_cleanup, name='phone-cleanup'),
    path('analyze-spam/', views.analyze_spam, name='analyze-spam'),
]
