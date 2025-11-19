'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Breadcrumbs from '@/components/Breadcrumbs';
import {
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  Chip,
  Divider,
} from '@mui/material';
import { Search, Phone } from 'lucide-react';
import apiClient from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';

interface PhoneCheckResult {
  exists: boolean;
  registered_at?: string;
  botname?: string;
  country?: string;
  iso2?: string;
  twofa?: string;
  session_string?: string;
  quality?: string;
  is_bulked?: boolean;
}

export default function PhoneCheckPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PhoneCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const handleCheck = async () => {
    if (!phoneNumber.trim()) {
      toast.showError('Please enter a phone number');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const response = await apiClient.post('/phone/check/', {
        phone_number: phoneNumber,
      });

      setResult(response.data);
      if (response.data.exists) {
        toast.showSuccess('Phone number found in registry');
      } else {
        toast.showInfo('Phone number not found in registry');
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to check phone number';
      setError(errorMsg);
      toast.showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCheck();
    }
  };

  return (
    <DashboardLayout>
      <Breadcrumbs items={[{ label: 'Phone Registry' }, { label: 'Check Phone' }]} />
      
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Phone size={24} />
            <Typography variant="h4" fontWeight={600}>Check Phone Number</Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" mb={3}>
            Check if a phone number exists in the registry and view its details.
          </Typography>

          <Box display="flex" gap={2} mb={3}>
            <TextField
              fullWidth
              label="Phone Number"
              placeholder="+1234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              helperText="Enter phone number with country code (e.g., +1234567890)"
            />
            <Button
              variant="contained"
              onClick={handleCheck}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Search size={20} />}
              sx={{ minWidth: 120, height: 56 }}
            >
              {loading ? 'Checking...' : 'Check'}
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {result && (
            <Card variant="outlined" sx={{ mt: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Typography variant="h6" fontWeight={600}>Result</Typography>
                  <Chip 
                    label={result.exists ? 'Exists' : 'Not Found'} 
                    color={result.exists ? 'success' : 'default'}
                    size="small"
                  />
                </Box>

                {result.exists ? (
                  <Box>
                    <Divider sx={{ my: 2 }} />
                    <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={2}>
                      {result.registered_at && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">Registered At</Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {new Date(result.registered_at).toLocaleString()}
                          </Typography>
                        </Box>
                      )}
                      {result.botname && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">Bot Name</Typography>
                          <Typography variant="body2" fontWeight={500}>{result.botname}</Typography>
                        </Box>
                      )}
                      {result.country && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">Country</Typography>
                          <Typography variant="body2" fontWeight={500}>{result.country}</Typography>
                        </Box>
                      )}
                      {result.iso2 && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">ISO2 Code</Typography>
                          <Typography variant="body2" fontWeight={500}>{result.iso2}</Typography>
                        </Box>
                      )}
                      {result.quality && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">Quality</Typography>
                          <Chip label={result.quality} size="small" color="primary" />
                        </Box>
                      )}
                      {result.twofa && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">2FA</Typography>
                          <Typography variant="body2" fontWeight={500}>Enabled</Typography>
                        </Box>
                      )}
                      <Box>
                        <Typography variant="caption" color="text.secondary">Bulk Status</Typography>
                        <Chip 
                          label={result.is_bulked ? 'Bulked' : 'Individual'} 
                          size="small" 
                          color={result.is_bulked ? 'warning' : 'success'}
                        />
                      </Box>
                    </Box>
                    {result.session_string && (
                      <Box mt={2}>
                        <Typography variant="caption" color="text.secondary">Session String</Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: 'monospace', 
                            fontSize: '0.85rem',
                            wordBreak: 'break-all',
                            bgcolor: 'action.hover',
                            p: 1,
                            borderRadius: 1,
                            mt: 0.5
                          }}
                        >
                          {result.session_string.substring(0, 100)}...
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    This phone number is not registered in the system.
                  </Typography>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
