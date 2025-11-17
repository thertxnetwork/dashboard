from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.utils import timezone
from asgiref.sync import async_to_sync
from .models import PaymentSettings, PaymentTransaction
from .serializers import (
    PaymentSettingsSerializer, 
    PaymentTransactionSerializer,
    VerifyPaymentSerializer
)
from .binance_pay import BinancePayAPI


class PaymentSettingsViewSet(viewsets.ModelViewSet):
    """ViewSet for payment settings management (admin only)"""
    queryset = PaymentSettings.objects.all()
    serializer_class = PaymentSettingsSerializer
    permission_classes = [IsAdminUser]
    
    def list(self, request, *args, **kwargs):
        # Return the first (and only) settings object or create one
        settings, created = PaymentSettings.objects.get_or_create(pk=1)
        serializer = self.get_serializer(settings)
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    def update(self, request, *args, **kwargs):
        settings, created = PaymentSettings.objects.get_or_create(pk=1)
        serializer = self.get_serializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'data': serializer.data,
                'message': 'Payment settings updated successfully'
            })
        return Response({
            'success': False,
            'message': 'Validation error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def test_connection(self, request):
        """Test Binance API connection"""
        try:
            settings = PaymentSettings.objects.first()
            if not settings or not settings.binance_enabled:
                return Response({
                    'success': False,
                    'message': 'Binance Pay is not enabled'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            client = BinancePayAPI(
                api_key=settings.binance_api_key,
                api_secret=settings.binance_api_secret
            )
            
            result = async_to_sync(client.test_connection)()
            
            if result:
                return Response({
                    'success': True,
                    'message': 'Connection successful'
                })
            else:
                return Response({
                    'success': False,
                    'message': 'Connection failed. Please check your API credentials.'
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Connection test failed: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PaymentTransactionViewSet(viewsets.ModelViewSet):
    """ViewSet for payment transactions"""
    queryset = PaymentTransaction.objects.all()
    serializer_class = PaymentTransactionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Non-admin users can only see their own transactions
        if not self.request.user.is_staff:
            queryset = queryset.filter(user=self.request.user)
        return queryset
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    @action(detail=False, methods=['post'])
    def verify_payment(self, request):
        """Verify a Binance Pay payment"""
        serializer = VerifyPaymentSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Validation error',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Check if payment settings are configured
            settings = PaymentSettings.objects.first()
            if not settings or not settings.binance_enabled:
                return Response({
                    'success': False,
                    'message': 'Binance Pay is not enabled'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if order ID already exists
            binance_order_id = serializer.validated_data['binance_order_id']
            existing = PaymentTransaction.objects.filter(binance_order_id=binance_order_id).first()
            if existing:
                return Response({
                    'success': False,
                    'message': 'This payment has already been processed',
                    'data': PaymentTransactionSerializer(existing).data
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Initialize Binance Pay client
            client = BinancePayAPI(
                api_key=settings.binance_api_key,
                api_secret=settings.binance_api_secret
            )
            
            # Verify payment
            result = async_to_sync(client.verify_payment_by_binance_order_id)(
                binance_order_id=binance_order_id,
                expected_amount=float(serializer.validated_data['expected_amount']),
                currency=serializer.validated_data['currency'],
                max_age_hours=serializer.validated_data['max_age_hours']
            )
            
            if result and result.get('verified'):
                # Create transaction record
                transaction = PaymentTransaction.objects.create(
                    user=request.user,
                    binance_order_id=binance_order_id,
                    transaction_id=result.get('transaction_id', ''),
                    amount=result.get('amount'),
                    currency=result.get('currency'),
                    status='verified',
                    from_account=result.get('from_account', ''),
                    payer_binance_id=result.get('payer_binance_id', ''),
                    order_type=result.get('order_type', ''),
                    transaction_time=result.get('transaction_time'),
                    verified_at=timezone.now(),
                    metadata=result
                )
                
                return Response({
                    'success': True,
                    'message': 'Payment verified successfully',
                    'data': PaymentTransactionSerializer(transaction).data
                })
            else:
                # Record failed verification
                transaction = PaymentTransaction.objects.create(
                    user=request.user,
                    binance_order_id=binance_order_id,
                    amount=serializer.validated_data['expected_amount'],
                    currency=serializer.validated_data['currency'],
                    status='failed',
                    notes=result.get('error', 'Verification failed') if result else 'Verification failed',
                    metadata=result or {}
                )
                
                return Response({
                    'success': False,
                    'message': result.get('error', 'Payment verification failed') if result else 'Verification failed',
                    'data': PaymentTransactionSerializer(transaction).data
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Verification error: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

