from django.urls import path
from . import views

urlpatterns = [
    path('', views.notification_list, name='notification-list'),
    path('unread-count/', views.unread_count, name='notification-unread-count'),
    path('<int:pk>/', views.notification_detail, name='notification-detail'),
    path('<int:pk>/mark-read/', views.mark_notification_read, name='mark-notification-read'),
    path('mark-all-read/', views.mark_all_read, name='mark-all-read'),
    path('send/', views.send_notification, name='send-notification'),
]
