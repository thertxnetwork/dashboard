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
} from '@mui/material';
import { Users } from 'lucide-react';
import apiClient from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';

interface BulkResult {
  success: boolean;
  total_submitted: number;
  newly_registered: number;
  already_exists: number;
  failed: number;
  message: string;
}

export default function PhoneBulkPage() {
  const [phoneNumbers, setPhoneNumbers] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BulkResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const handleBulkRegister = async () => {
    if (!phoneNumbers.trim()) {
      toast.showError('Please enter phone numbers');
      return;
    }

    // Parse phone numbers (one per line)
    const numbers = phoneNumbers
      .split('\n')
      .map(n => n.trim())
      .filter(n => n.length > 0);

    if (numbers.length === 0) {
      toast.showError('No valid phone numbers found');
      return;
    }

    if (numbers.length > 1000) {
      toast.showError('Maximum 1000 phone numbers allowed per request');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const response = await apiClient.post('/phone/bulk-register/', {
        phone_numbers: numbers,
      });

      setResult(response.data);
      toast.showSuccess(response.data.message || 'Bulk registration completed');
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to register phone numbers';
      setError(errorMsg);
      toast.showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const lineCount = phoneNumbers.split('\n').filter(n => n.trim().length > 0).length;

  return (
    <DashboardLayout>
      <Breadcrumbs items={[{ label: 'Phone Registry' }, { label: 'Bulk Register' }]} />
      
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Users size={24} />
            <Typography variant="h4" fontWeight={600}>Bulk Register Phone Numbers</Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" mb={3}>
            Register multiple phone numbers in bulk (up to 1000 per request). Enter one phone number per line.
            Note: Bulk registration sets is_bulked=TRUE and leaves other fields empty/null.
          </Typography>

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>Important:</Typography>
            <Typography variant="body2">
              • Enter one phone number per line<br />
              • Maximum 1000 phone numbers per request<br />
              • Include country code (e.g., +1234567890)<br />
              • Bulk registered numbers will have is_bulked=TRUE
            </Typography>
          </Alert>

          <TextField
            fullWidth
            multiline
            rows={12}
            label="Phone Numbers"
            placeholder="+1234567890&#10;+1234567891&#10;+1234567892"
            value={phoneNumbers}
            onChange={(e) => {
              setPhoneNumbers(e.target.value);
              setError(null);
              setResult(null);
            }}
            disabled={loading}
            helperText={`${lineCount} phone number(s) entered`}
            sx={{ mb: 3 }}
          />

          <Box display="flex" gap={2} mb={3}>
            <Button
              variant="outlined"
              onClick={() => {
                setPhoneNumbers('');
                setError(null);
                setResult(null);
              }}
              disabled={loading}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              onClick={handleBulkRegister}
              disabled={loading || lineCount === 0}
              startIcon={loading ? <CircularProgress size={20} /> : <Users size={20} />}
            >
              {loading ? 'Registering...' : `Register ${lineCount} Phone Number(s)`}
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {result && (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>Result</Typography>
                <Box display="flex" flexWrap="wrap" gap={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Total Submitted</Typography>
                    <Typography variant="h5" fontWeight={600} color="primary.main">
                      {result.total_submitted}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Newly Registered</Typography>
                    <Typography variant="h5" fontWeight={600} color="success.main">
                      {result.newly_registered}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Already Exists</Typography>
                    <Typography variant="h5" fontWeight={600} color="warning.main">
                      {result.already_exists}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Failed</Typography>
                    <Typography variant="h5" fontWeight={600} color="error.main">
                      {result.failed}
                    </Typography>
                  </Box>
                </Box>
                <Alert severity="success" sx={{ mt: 2 }}>
                  {result.message}
                </Alert>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
