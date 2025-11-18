from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Notification
from .serializers import NotificationSerializer, SendNotificationSerializer

User = get_user_model()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def unread_count(request):
    """Get unread notification count for the current user"""
    count = Notification.objects.filter(user=request.user, is_read=False).count()
    return Response({
        'success': True,
        'unread_count': count
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def notification_list(request):
    """Get notifications for the current user"""
    notifications = Notification.objects.filter(user=request.user)
    
    # Filter by read status if provided
    is_read = request.query_params.get('is_read')
    if is_read is not None:
        is_read_bool = is_read.lower() == 'true'
        notifications = notifications.filter(is_read=is_read_bool)
    
    serializer = NotificationSerializer(notifications, many=True)
    
    unread_count = Notification.objects.filter(user=request.user, is_read=False).count()
    
    return Response({
        'success': True,
        'data': serializer.data,
        'unread_count': unread_count,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def notification_detail(request, pk):
    """Get a specific notification"""
    try:
        notification = Notification.objects.get(pk=pk, user=request.user)
        serializer = NotificationSerializer(notification)
        return Response({
            'success': True,
            'data': serializer.data,
        })
    except Notification.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Notification not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_notification_read(request, pk):
    """Mark a notification as read"""
    try:
        notification = Notification.objects.get(pk=pk, user=request.user)
        notification.is_read = True
        notification.save()
        
        serializer = NotificationSerializer(notification)
        return Response({
            'success': True,
            'data': serializer.data,
            'message': 'Notification marked as read'
        })
    except Notification.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Notification not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_all_read(request):
    """Mark all notifications as read for the current user"""
    updated_count = Notification.objects.filter(
        user=request.user, 
        is_read=False
    ).update(is_read=True)
    
    return Response({
        'success': True,
        'message': f'{updated_count} notifications marked as read'
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_notification(request):
    """Send notification to users (admin only)"""
    # Check if user is admin/staff
    if not request.user.is_staff and not request.user.is_superuser:
        return Response({
            'success': False,
            'message': 'Permission denied. Only admins can send notifications.'
        }, status=status.HTTP_403_FORBIDDEN)
    
    serializer = SendNotificationSerializer(data=request.data)
    if serializer.is_valid():
        user_ids = serializer.validated_data.get('user_ids', [])
        title = serializer.validated_data['title']
        message = serializer.validated_data['message']
        notification_type = serializer.validated_data.get('type', 'info')
        
        # Get target users
        if user_ids:
            users = User.objects.filter(id__in=user_ids)
        else:
            # Send to all users
            users = User.objects.all()
        
        # Create notifications
        notifications = []
        for user in users:
            notification = Notification.objects.create(
                user=user,
                title=title,
                message=message,
                type=notification_type
            )
            notifications.append(notification)
        
        return Response({
            'success': True,
            'message': f'Notification sent to {len(notifications)} users',
            'count': len(notifications)
        })
    
    return Response({
        'success': False,
        'message': 'Validation error',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

