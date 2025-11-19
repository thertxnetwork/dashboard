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
  
} from '@mui/material';
import { UserPlus } from 'lucide-react';
import apiClient from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';

export default function PhoneRegisterPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const [formData, setFormData] = useState({
    phone_number: '',
    botname: '',
    country: '',
    iso2: '',
    twofa: '',
    session_string: '',
    quality: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = ['phone_number', 'botname', 'country', 'iso2', 'twofa', 'session_string'];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData].trim()) {
        toast.showError(`${field.replace('_', ' ')} is required`);
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const payload = { ...formData };
      if (!payload.quality) delete (payload as any).quality;

      const response = await apiClient.post('/phone/register/', payload);

      if (response.data.success) {
        setSuccess(true);
        toast.showSuccess(response.data.message || 'Phone number registered successfully');
        // Reset form
        setFormData({
          phone_number: '',
          botname: '',
          country: '',
          iso2: '',
          twofa: '',
          session_string: '',
          quality: '',
        });
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to register phone number';
      setError(errorMsg);
      toast.showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Breadcrumbs items={[{ label: 'Phone Registry' }, { label: 'Register Phone' }]} />
      
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <UserPlus size={24} />
            <Typography variant="h4" fontWeight={600}>Register Phone Number</Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" mb={3}>
            Register a new phone number with complete details in the registry.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Phone number registered successfully!
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box display="flex" flexWrap="wrap" gap={2}>
              <Box flex="1" minWidth="100%">
                <TextField
                  fullWidth
                  required
                  label="Phone Number"
                  placeholder="+1234567890"
                  value={formData.phone_number}
                  onChange={(e) => handleChange('phone_number', e.target.value)}
                  disabled={loading}
                  helperText="Max 20 characters"
                  inputProps={{ maxLength: 20 }}
                />
              </Box>
              <Box flex="1" minWidth="100%">
                <TextField
                  fullWidth
                  required
                  label="Bot Name"
                  placeholder="MyTelegramBot"
                  value={formData.botname}
                  onChange={(e) => handleChange('botname', e.target.value)}
                  disabled={loading}
                  helperText="Max 100 characters"
                  inputProps={{ maxLength: 100 }}
                />
              </Box>
              <Box flex="1" minWidth="100%">
                <TextField
                  fullWidth
                  required
                  label="Country"
                  placeholder="United States"
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  disabled={loading}
                  helperText="Max 100 characters"
                  inputProps={{ maxLength: 100 }}
                />
              </Box>
              <Box flex="1" minWidth="100%">
                <TextField
                  fullWidth
                  required
                  label="ISO2 Code"
                  placeholder="US"
                  value={formData.iso2}
                  onChange={(e) => handleChange('iso2', e.target.value.toUpperCase())}
                  disabled={loading}
                  helperText="2-character country code (auto-uppercased)"
                  inputProps={{ maxLength: 2 }}
                />
              </Box>
              <Box flex="1" minWidth="100%">
                <TextField
                  fullWidth
                  required
                  label="2FA Password"
                  placeholder="1234"
                  value={formData.twofa}
                  onChange={(e) => handleChange('twofa', e.target.value)}
                  disabled={loading}
                  helperText="4 digits to long characters (max 1000)"
                  inputProps={{ maxLength: 1000 }}
                />
              </Box>
              <Box flex="1" minWidth="100%">
                <TextField
                  fullWidth
                  label="Quality"
                  placeholder="high"
                  value={formData.quality}
                  onChange={(e) => handleChange('quality', e.target.value)}
                  disabled={loading}
                  helperText="Optional (max 50 characters)"
                  inputProps={{ maxLength: 50 }}
                />
              </Box>
              <Box flex="1" minWidth="100%">
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={4}
                  label="Session String"
                  placeholder="1AbCdEfGhIjKlMnOpQrStUvWxYz..."
                  value={formData.session_string}
                  onChange={(e) => handleChange('session_string', e.target.value)}
                  disabled={loading}
                  helperText="Session string for authentication (max 10000 characters)"
                  inputProps={{ maxLength: 10000 }}
                />
              </Box>
              <Box flex="1" minWidth="100%">
                <Box display="flex" gap={2} justifyContent="flex-end">
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => setFormData({
                      phone_number: '',
                      botname: '',
                      country: '',
                      iso2: '',
                      twofa: '',
                      session_string: '',
                      quality: '',
                    })}
                    disabled={loading}
                  >
                    Clear
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <UserPlus size={20} />}
                  >
                    {loading ? 'Registering...' : 'Register Phone'}
                  </Button>
                </Box>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
