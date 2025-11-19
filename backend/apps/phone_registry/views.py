from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
import aiohttp
import asyncio
from .models import CheckAPIConfig
from .serializers import (
    PhoneCheckSerializer, PhoneRegisterSerializer, PhoneBulkRegisterSerializer,
    PhoneListSerializer, PhoneAnalyticsSerializer, PhoneCleanupSerializer,
    SpamAnalysisSerializer
)


def get_api_config():
    """Get the active API configuration"""
    try:
        config = CheckAPIConfig.objects.filter(is_active=True).first()
        if not config:
            return None, "No active API configuration found. Please configure Check API in admin panel."
        return config, None
    except Exception as e:
        return None, str(e)


async def make_api_request(method, endpoint, headers, data=None, params=None):
    """Make async API request to external Check API"""
    async with aiohttp.ClientSession() as session:
        async with session.request(
            method=method,
            url=endpoint,
            headers=headers,
            json=data,
            params=params,
            timeout=aiohttp.ClientTimeout(total=30)
        ) as response:
            response_data = await response.json()
            return response.status, response_data


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def phone_check(request):
    """Check if a phone number exists in the registry"""
    serializer = PhoneCheckSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            'success': False,
            'message': 'Validation error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    config, error = get_api_config()
    if error:
        return Response({
            'success': False,
            'message': error
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    try:
        endpoint = f"{config.base_url}/api/phone/check"
        headers = {
            'X-API-Key': config.api_key,
            'Content-Type': 'application/json'
        }
        
        # Run async request
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        response_status, response_data = loop.run_until_complete(
            make_api_request('POST', endpoint, headers, data=serializer.validated_data)
        )
        loop.close()
        
        return Response(response_data, status=response_status)
        
    except Exception as e:
        return Response({
            'success': False,
            'message': f'Error connecting to Check API: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def phone_register(request):
    """Register a new phone number with full details"""
    serializer = PhoneRegisterSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            'success': False,
            'message': 'Validation error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    config, error = get_api_config()
    if error:
        return Response({
            'success': False,
            'message': error
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    try:
        endpoint = f"{config.base_url}/api/phone/register"
        headers = {
            'X-API-Key': config.api_key,
            'Content-Type': 'application/json'
        }
        
        # Run async request
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        response_status, response_data = loop.run_until_complete(
            make_api_request('POST', endpoint, headers, data=serializer.validated_data)
        )
        loop.close()
        
        return Response(response_data, status=response_status)
        
    except Exception as e:
        return Response({
            'success': False,
            'message': f'Error connecting to Check API: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def phone_bulk_register(request):
    """Register multiple phone numbers in bulk"""
    serializer = PhoneBulkRegisterSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            'success': False,
            'message': 'Validation error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    config, error = get_api_config()
    if error:
        return Response({
            'success': False,
            'message': error
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    try:
        endpoint = f"{config.base_url}/api/phone/bulk-register"
        headers = {
            'X-API-Key': config.api_key,
            'Content-Type': 'application/json'
        }
        
        # Run async request
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        response_status, response_data = loop.run_until_complete(
            make_api_request('POST', endpoint, headers, data=serializer.validated_data)
        )
        loop.close()
        
        return Response(response_data, status=response_status)
        
    except Exception as e:
        return Response({
            'success': False,
            'message': f'Error connecting to Check API: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def phone_list(request):
    """Retrieve phone registry with pagination and filtering"""
    config, error = get_api_config()
    if error:
        return Response({
            'success': False,
            'message': error
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    try:
        endpoint = f"{config.base_url}/api/phone/list"
        headers = {
            'X-API-Key': config.api_key,
        }
        
        # Get query parameters
        params = {}
        for key in ['page', 'limit', 'botname', 'country', 'iso2', 'is_bulked', 'quality', 'order_by', 'order_direction']:
            value = request.query_params.get(key)
            if value is not None:
                params[key] = value
        
        # Run async request
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        response_status, response_data = loop.run_until_complete(
            make_api_request('GET', endpoint, headers, params=params)
        )
        loop.close()
        
        return Response(response_data, status=response_status)
        
    except Exception as e:
        return Response({
            'success': False,
            'message': f'Error connecting to Check API: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def phone_analytics(request):
    """Get analytics and statistics for phone number registry"""
    config, error = get_api_config()
    if error:
        return Response({
            'success': False,
            'message': error
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    try:
        endpoint = f"{config.base_url}/api/phone/analytics"
        headers = {
            'X-API-Key': config.api_key,
        }
        
        # Get query parameters
        params = {}
        for key in ['start_date', 'end_date', 'is_bulked']:
            value = request.query_params.get(key)
            if value is not None:
                params[key] = value
        
        # Run async request
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        response_status, response_data = loop.run_until_complete(
            make_api_request('GET', endpoint, headers, params=params)
        )
        loop.close()
        
        return Response(response_data, status=response_status)
        
    except Exception as e:
        return Response({
            'success': False,
            'message': f'Error connecting to Check API: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def phone_cleanup(request):
    """Delete phone records older than the specified retention period"""
    serializer = PhoneCleanupSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            'success': False,
            'message': 'Validation error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    config, error = get_api_config()
    if error:
        return Response({
            'success': False,
            'message': error
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    try:
        endpoint = f"{config.base_url}/api/phone/cleanup"
        headers = {
            'X-API-Key': config.api_key,
            'Content-Type': 'application/json'
        }
        
        # Run async request
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        response_status, response_data = loop.run_until_complete(
            make_api_request('DELETE', endpoint, headers, data=serializer.validated_data)
        )
        loop.close()
        
        return Response(response_data, status=response_status)
        
    except Exception as e:
        return Response({
            'success': False,
            'message': f'Error connecting to Check API: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def analyze_spam(request):
    """Analyze account status message using multilingual NLP detection"""
    serializer = SpamAnalysisSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            'success': False,
            'message': 'Validation error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    config, error = get_api_config()
    if error:
        return Response({
            'success': False,
            'message': error
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    try:
        endpoint = f"{config.base_url}/api/analyze-spam"
        headers = {
            'X-API-Key': config.api_key,
            'Content-Type': 'application/json'
        }
        
        # Run async request
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        response_status, response_data = loop.run_until_complete(
            make_api_request('POST', endpoint, headers, data=serializer.validated_data)
        )
        loop.close()
        
        return Response(response_data, status=response_status)
        
    except Exception as e:
        return Response({
            'success': False,
            'message': f'Error connecting to Check API: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
