from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
import aiohttp
import asyncio
import os


# External API configuration
EXTERNAL_API_BASE_URL = os.environ.get('PHONE_API_URL', 'http://checkapi.org/api')
EXTERNAL_API_KEY = os.environ.get('PHONE_API_KEY', 'your-api-key')


async def make_external_request(method, endpoint, data=None, params=None):
    """Make async request to external phone API"""
    url = f"{EXTERNAL_API_BASE_URL}{endpoint}"
    headers = {
        'X-API-Key': EXTERNAL_API_KEY,
        'Content-Type': 'application/json'
    }
    
    async with aiohttp.ClientSession() as session:
        try:
            if method.upper() == 'GET':
                async with session.get(url, headers=headers, params=params, timeout=30) as response:
                    return await response.json(), response.status
            elif method.upper() == 'POST':
                async with session.post(url, headers=headers, json=data, timeout=30) as response:
                    return await response.json(), response.status
            elif method.upper() == 'DELETE':
                async with session.delete(url, headers=headers, json=data, timeout=30) as response:
                    return await response.json(), response.status
        except aiohttp.ClientError as e:
            return {'error': str(e), 'success': False}, 500
        except asyncio.TimeoutError:
            return {'error': 'Request timeout', 'success': False}, 504


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def check_phone(request):
    """
    Check if a phone number exists in the registry.
    Proxies to external API: POST /api/phone/check
    """
    phone_number = request.data.get('phone_number')
    if not phone_number:
        return Response({
            'success': False,
            'message': 'phone_number is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Make request to external API
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        result, status_code = loop.run_until_complete(
            make_external_request('POST', '/phone/check', {'phone_number': phone_number})
        )
        return Response(result, status=status_code)
    finally:
        loop.close()


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def register_phone(request):
    """
    Register a new phone number with full details.
    Proxies to external API: POST /api/phone/register
    """
    required_fields = ['phone_number', 'botname', 'country', 'iso2', 'twofa', 'session_string']
    for field in required_fields:
        if field not in request.data:
            return Response({
                'success': False,
                'message': f'{field} is required'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    # Make request to external API
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        result, status_code = loop.run_until_complete(
            make_external_request('POST', '/phone/register', request.data)
        )
        return Response(result, status=status_code)
    finally:
        loop.close()


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def bulk_register(request):
    """
    Register multiple phone numbers in bulk (up to 1000 per request).
    Proxies to external API: POST /api/phone/bulk-register
    """
    phone_numbers = request.data.get('phone_numbers', [])
    if not phone_numbers:
        return Response({
            'success': False,
            'message': 'phone_numbers array is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if len(phone_numbers) > 1000:
        return Response({
            'success': False,
            'message': 'Maximum 1000 phone numbers allowed per request'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Make request to external API
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        result, status_code = loop.run_until_complete(
            make_external_request('POST', '/phone/bulk-register', {'phone_numbers': phone_numbers})
        )
        return Response(result, status=status_code)
    finally:
        loop.close()


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def list_phones(request):
    """
    Retrieve phone registry with pagination and filtering.
    Proxies to external API: GET /api/phone/list
    """
    params = {}
    
    # Pagination
    if 'page' in request.query_params:
        params['page'] = request.query_params['page']
    if 'limit' in request.query_params:
        params['limit'] = request.query_params['limit']
    
    # Filters
    for key in ['botname', 'country', 'iso2', 'is_bulked', 'quality', 'order_by', 'order_direction']:
        if key in request.query_params:
            params[key] = request.query_params[key]
    
    # Make request to external API
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        result, status_code = loop.run_until_complete(
            make_external_request('GET', '/phone/list', params=params)
        )
        return Response(result, status=status_code)
    finally:
        loop.close()


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def analytics(request):
    """
    Get analytics and statistics for phone number registry.
    Proxies to external API: GET /api/phone/analytics
    """
    params = {}
    
    for key in ['start_date', 'end_date', 'is_bulked']:
        if key in request.query_params:
            params[key] = request.query_params[key]
    
    # Make request to external API
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        result, status_code = loop.run_until_complete(
            make_external_request('GET', '/phone/analytics', params=params)
        )
        return Response(result, status=status_code)
    finally:
        loop.close()


@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def cleanup(request):
    """
    Delete phone records older than the specified retention period.
    Proxies to external API: DELETE /api/phone/cleanup
    """
    retention_days = request.data.get('retention_days')
    if not retention_days:
        return Response({
            'success': False,
            'message': 'retention_days is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Make request to external API
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        result, status_code = loop.run_until_complete(
            make_external_request('DELETE', '/phone/cleanup', {'retention_days': retention_days})
        )
        return Response(result, status=status_code)
    finally:
        loop.close()


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def analyze_spam(request):
    """
    Analyze account status message using multilingual NLP detection.
    Proxies to external API: POST /api/analyze-spam
    """
    message = request.data.get('message')
    if not message:
        return Response({
            'success': False,
            'message': 'message is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Make request to external API
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        result, status_code = loop.run_until_complete(
            make_external_request('POST', '/analyze-spam', {'message': message})
        )
        return Response(result, status=status_code)
    finally:
        loop.close()
