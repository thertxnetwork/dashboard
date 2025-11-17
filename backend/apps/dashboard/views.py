from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.db.models import Count
from django.utils import timezone
from datetime import timedelta

User = get_user_model()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """Get dashboard KPI statistics"""
    total_users = User.objects.count()
    active_users = User.objects.filter(is_active=True).count()
    inactive_users = total_users - active_users
    
    # Users created in last 30 days
    thirty_days_ago = timezone.now() - timedelta(days=30)
    new_users = User.objects.filter(created_at__gte=thirty_days_ago).count()
    
    return Response({
        'success': True,
        'data': {
            'total_users': total_users,
            'active_users': active_users,
            'inactive_users': inactive_users,
            'new_users_30d': new_users,
        }
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_charts(request):
    """Get data for dashboard charts"""
    # User growth chart data (last 7 days)
    chart_data = []
    for i in range(6, -1, -1):
        date = timezone.now().date() - timedelta(days=i)
        count = User.objects.filter(created_at__date=date).count()
        chart_data.append({
            'date': date.isoformat(),
            'users': count
        })
    
    # Users by role
    role_data = User.objects.values('role').annotate(count=Count('id'))
    
    return Response({
        'success': True,
        'data': {
            'user_growth': chart_data,
            'users_by_role': list(role_data)
        }
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recent_activity(request):
    """Get recent activity"""
    from apps.users.models import ActivityLog
    recent_logs = ActivityLog.objects.select_related('user').all()[:10]
    
    data = [{
        'id': log.id,
        'user': log.user.email if log.user else 'System',
        'action': log.action,
        'details': log.details,
        'created_at': log.created_at
    } for log in recent_logs]
    
    return Response({
        'success': True,
        'data': data
    })
