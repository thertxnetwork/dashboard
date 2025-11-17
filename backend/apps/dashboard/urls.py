from django.urls import path
from . import views

urlpatterns = [
    path('stats/', views.dashboard_stats, name='dashboard_stats'),
    path('charts/', views.dashboard_charts, name='dashboard_charts'),
    path('recent-activity/', views.recent_activity, name='recent_activity'),
]
