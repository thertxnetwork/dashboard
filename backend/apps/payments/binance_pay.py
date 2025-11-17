"""
Binance Pay integration for personal account.
Handles payment via Binance Pay internal transfers (no blockchain fees).
"""

import logging
import hmac
import hashlib
import time
import aiohttp
from typing import Optional, Dict, Any, List
from asgiref.sync import sync_to_async
from .models import PaymentSettings

logger = logging.getLogger(__name__)


class BinancePayAPI:
    """Binance Pay API client for personal account internal transfers."""
    
    BASE_URL = "https://api.binance.com"
    
    def __init__(self, api_key: str = None, api_secret: str = None):
        """
        Initialize Binance Pay API client.
        
        Args:
            api_key: Binance API key
            api_secret: Binance API secret
        """
        self.api_key = api_key
        self.api_secret = api_secret
        
    @classmethod
    async def from_settings(cls):
        """Create instance from database settings"""
        settings = await sync_to_async(PaymentSettings.objects.first)()
        if settings and settings.binance_enabled:
            return cls(
                api_key=settings.binance_api_key,
                api_secret=settings.binance_api_secret
            )
        return None
        
    def _generate_signature(self, params: str) -> str:
        """
        Generate signature for Binance API request.
        
        Args:
            params: Query string parameters
            
        Returns:
            str: HMAC SHA256 signature
        """
        return hmac.new(
            self.api_secret.encode('utf-8'),
            params.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
    
    async def get_pay_transaction_history(
        self, 
        start_time: int = None, 
        end_time: int = None,
        limit: int = 100
    ) -> Optional[List[Dict[str, Any]]]:
        """
        Get Binance Pay transaction history.
        
        Args:
            start_time: Start timestamp in milliseconds (optional)
            end_time: End timestamp in milliseconds (optional)
            limit: Number of records to retrieve (max 100)
            
        Returns:
            List of transaction records or None on error
        """
        try:
            timestamp = int(time.time() * 1000)
            
            # Default to last 30 days if not specified
            if not start_time:
                start_time = timestamp - (30 * 24 * 60 * 60 * 1000)
            if not end_time:
                end_time = timestamp
            
            params = f"startTime={start_time}&endTime={end_time}&limit={limit}&recvWindow=60000&timestamp={timestamp}"
            signature = self._generate_signature(params)
            
            headers = {
                "X-MBX-APIKEY": self.api_key
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.BASE_URL}/sapi/v1/pay/transactions?{params}&signature={signature}",
                    headers=headers
                ) as response:
                    result = await response.json()
                    
                    if response.status == 200:
                        # Binance Pay API returns data in 'data' field
                        transactions = result.get('data', [])
                        logger.info(f"Retrieved {len(transactions)} Binance Pay transactions")
                        logger.debug(f"Binance Pay API full response: {result}")
                        return transactions
                    else:
                        logger.error(f"Binance Pay transaction history failed: {result}")
                        return None
                        
        except Exception as e:
            logger.error(f"Error getting Binance Pay transaction history: {e}")
            return None
    
    async def verify_payment_by_binance_order_id(
        self, 
        binance_order_id: str, 
        expected_amount: float, 
        currency: str = "USDT",
        max_age_hours: int = 1
    ) -> Optional[Dict[str, Any]]:
        """
        Verify Binance Pay payment by Binance's order ID directly.
        User provides the order ID they see in their Binance Pay transaction.
        
        Args:
            binance_order_id: The order ID from Binance Pay transaction
            expected_amount: Expected payment amount
            currency: Currency symbol (default: USDT)
            max_age_hours: Maximum age of transaction in hours (default: 1)
            
        Returns:
            Dict with verification result or None on error
        """
        try:
            # Get recent transactions (last N hours + buffer)
            current_time = int(time.time() * 1000)
            start_time = current_time - ((max_age_hours + 1) * 60 * 60 * 1000)
            
            transactions = await self.get_pay_transaction_history(
                start_time=start_time,
                end_time=current_time,
                limit=100
            )
            
            if not transactions:
                logger.warning("No transactions retrieved from Binance Pay API")
                return {
                    'verified': False,
                    'error': 'Unable to retrieve transaction history'
                }
            
            logger.info(f"Searching for Binance order ID '{binance_order_id}' in {len(transactions)} transactions")
            logger.info(f"Search criteria: currency={currency}, expected_amount={expected_amount}, max_age_hours={max_age_hours}")
            
            # Search for transaction with matching Binance order ID
            for idx, tx in enumerate(transactions, 1):
                logger.debug(f"Transaction {idx}/{len(transactions)}: {tx}")
                
                # Check if this is an incoming payment
                tx_type = tx.get('orderType')
                amount_val = float(tx.get('amount', 0))
                is_incoming = amount_val > 0
                
                if not is_incoming:
                    logger.debug(f"  Skipped: amount={amount_val} (not incoming transfer)")
                    continue
                
                # Check currency
                tx_currency = tx.get('currency')
                if tx_currency != currency:
                    logger.debug(f"  Skipped: currency mismatch (expected {currency}, got {tx_currency})")
                    continue
                
                # Match Binance order ID (use 'orderId' field from API)
                tx_order_id = str(tx.get('orderId', ''))
                logger.debug(f"  Checking order ID: tx_order_id='{tx_order_id}' vs binance_order_id='{binance_order_id}'")
                
                if tx_order_id == binance_order_id:
                    logger.info(f"  ✅ Order ID matched! Transaction found: {tx}")
                    
                    # Check transaction age
                    tx_time = tx.get('transactionTime', 0)
                    age_hours = (current_time - tx_time) / (1000 * 60 * 60)
                    
                    if age_hours > max_age_hours:
                        logger.warning(f"  Transaction too old: {age_hours:.1f} hours (max {max_age_hours} hours)")
                        return {
                            'verified': False,
                            'error': f'Transaction is too old ({age_hours:.1f} hours). Must be within {max_age_hours} hour(s).'
                        }
                    
                    # Verify amount
                    tx_amount = float(tx.get('amount', 0))
                    logger.info(f"  Amount check: expected={expected_amount}, received={tx_amount}, diff={abs(tx_amount - expected_amount)}")
                    
                    # Allow small difference (0.01) for rounding
                    if abs(tx_amount - expected_amount) < 0.01:
                        logger.info(f"  ✅ Payment verified successfully!")
                        
                        # Get payer info
                        payer_info = tx.get('payerInfo', {}) or {}
                        payer_name = payer_info.get('name', 'Unknown') if isinstance(payer_info, dict) else 'Unknown'
                        
                        return {
                            'verified': True,
                            'amount': tx_amount,
                            'currency': tx.get('currency'),
                            'binance_order_id': binance_order_id,
                            'transaction_id': tx.get('transactionId', 'N/A'),
                            'transaction_time': tx.get('transactionTime'),
                            'age_hours': age_hours,
                            'from_account': payer_name,
                            'payer_binance_id': payer_info.get('binanceId', 'N/A') if isinstance(payer_info, dict) else 'N/A',
                            'order_type': tx.get('orderType', 'N/A')
                        }
                    else:
                        logger.error(f"  ❌ Amount mismatch: expected {expected_amount} {currency}, received {tx_amount} {currency}")
                        return {
                            'verified': False,
                            'error': f'Amount mismatch: expected {expected_amount} {currency}, received {tx_amount} {currency}'
                        }
            
            # Transaction not found
            logger.error(f"❌ Transaction with Binance order ID '{binance_order_id}' not found in {len(transactions)} recent payments")
            logger.info(f"All order IDs checked: {[str(tx.get('orderId', 'N/A')) for tx in transactions if float(tx.get('amount', 0)) > 0]}")
            return {
                'verified': False,
                'error': f'Transaction with Binance order ID "{binance_order_id}" not found in recent payments'
            }
                        
        except Exception as e:
            logger.error(f"Error verifying Binance Pay payment: {e}")
            return None
    
    async def test_connection(self) -> bool:
        """
        Test connection to Binance API.
        
        Returns:
            bool: True if connection is successful
        """
        try:
            timestamp = int(time.time() * 1000)
            params = f"timestamp={timestamp}"
            signature = self._generate_signature(params)
            
            headers = {
                "X-MBX-APIKEY": self.api_key
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.BASE_URL}/sapi/v1/account/status?{params}&signature={signature}",
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as response:
                    return response.status == 200
                    
        except Exception as e:
            logger.error(f"Binance connection test failed: {e}")
            return False
