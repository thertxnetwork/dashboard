from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaymentSettingsViewSet, PaymentTransactionViewSet

router = DefaultRouter()
router.register(r'settings', PaymentSettingsViewSet, basename='payment-settings')
router.register(r'transactions', PaymentTransactionViewSet, basename='payment-transactions')

urlpatterns = [
    path('', include(router.urls)),
]
