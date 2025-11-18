'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Breadcrumbs from '@/components/Breadcrumbs';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Upload } from 'lucide-react';
import apiClient from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';

export default function PhoneBulkPage() {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const [bulkPhones, setBulkPhones] = useState('');
  const [bulkResult, setBulkResult] = useState<any>(null);

  const handleBulkRegister = async () => {
    const phoneNumbers = bulkPhones.split('\n').map(p => p.trim()).filter(p => p);
    if (phoneNumbers.length === 0) {
      toast.showError('Please enter at least one phone number');
      return;
    }

    if (phoneNumbers.length > 1000) {
      toast.showError('Maximum 1000 phone numbers allowed');
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.post('/phone/bulk-register/', { phone_numbers: phoneNumbers });
      setBulkResult(response.data);
      toast.showSuccess(response.data.message || 'Bulk registration completed');
    } catch (error: any) {
      console.error('Error bulk registering:', error);
      toast.showError(error.response?.data?.message || 'Failed to bulk register');
      setBulkResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Breadcrumbs items={[{ label: 'Bulk Phone Registration' }]} />
      
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Upload size={32} />
            <Typography variant="h4" fontWeight={600}>Bulk Register Phone Numbers</Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Enter phone numbers (one per line, max 1000)
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={15}
            value={bulkPhones}
            onChange={(e) => setBulkPhones(e.target.value)}
            placeholder="+1234567890&#10;+1234567891&#10;+1234567892"
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleBulkRegister}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <Upload size={16} />}
          >
            Bulk Register
          </Button>

          {bulkResult && (
            <Alert severity="success" sx={{ mt: 2 }}>
              <Typography variant="subtitle2">{bulkResult.message}</Typography>
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2">Total Submitted: {bulkResult.total_submitted}</Typography>
                <Typography variant="body2">Newly Registered: {bulkResult.newly_registered}</Typography>
                <Typography variant="body2">Already Exists: {bulkResult.already_exists}</Typography>
                <Typography variant="body2">Failed: {bulkResult.failed}</Typography>
              </Box>
            </Alert>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
