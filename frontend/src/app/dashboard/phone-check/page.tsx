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
  Grid,
  Divider,
} from '@mui/material';
import { Phone, Search } from 'lucide-react';
import apiClient from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';

export default function PhoneCheckPage() {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Check Phone
  const [checkPhone, setCheckPhone] = useState('');
  const [checkResult, setCheckResult] = useState<any>(null);

  // Register Phone
  const [registerData, setRegisterData] = useState({
    phone_number: '',
    botname: '',
    country: '',
    iso2: '',
    twofa: '',
    session_string: '',
    quality: '',
  });
  const [registerResult, setRegisterResult] = useState<any>(null);

  const handleCheckPhone = async () => {
    if (!checkPhone) {
      toast.showError('Please enter a phone number');
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.post('/phone/check/', { phone_number: checkPhone });
      setCheckResult(response.data);
      if (response.data.exists) {
        toast.showSuccess('Phone number found');
      } else {
        toast.showInfo('Phone number not found');
      }
    } catch (error: any) {
      console.error('Error checking phone:', error);
      toast.showError(error.response?.data?.message || 'Failed to check phone');
      setCheckResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterPhone = async () => {
    const required = ['phone_number', 'botname', 'country', 'iso2', 'twofa', 'session_string'];
    for (const field of required) {
      if (!registerData[field as keyof typeof registerData]) {
        toast.showError(`${field} is required`);
        return;
      }
    }

    try {
      setLoading(true);
      const response = await apiClient.post('/phone/register/', registerData);
      setRegisterResult(response.data);
      toast.showSuccess(response.data.message || 'Phone registered successfully');
      setRegisterData({
        phone_number: '',
        botname: '',
        country: '',
        iso2: '',
        twofa: '',
        session_string: '',
        quality: '',
      });
    } catch (error: any) {
      console.error('Error registering phone:', error);
      toast.showError(error.response?.data?.message || 'Failed to register phone');
      setRegisterResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Breadcrumbs items={[{ label: 'Phone Check & Register' }]} />
      
      <Grid container spacing={3}>
        {/* Check Phone Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Search size={24} />
                <Typography variant="h5" fontWeight={600}>Check Phone Number</Typography>
              </Box>

              <Box display="flex" gap={2} mb={2}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={checkPhone}
                  onChange={(e) => setCheckPhone(e.target.value)}
                  placeholder="+1234567890"
                  size="small"
                />
                <Button
                  variant="contained"
                  onClick={handleCheckPhone}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={16} /> : <Search size={16} />}
                >
                  Check
                </Button>
              </Box>

              {checkResult && (
                <Alert severity={checkResult.exists ? 'success' : 'info'} sx={{ mt: 2 }}>
                  {checkResult.exists ? (
                    <Box>
                      <Typography variant="subtitle2">Phone number exists</Typography>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2"><strong>Botname:</strong> {checkResult.botname || 'N/A'}</Typography>
                        <Typography variant="body2"><strong>Country:</strong> {checkResult.country || 'N/A'}</Typography>
                        <Typography variant="body2"><strong>ISO2:</strong> {checkResult.iso2 || 'N/A'}</Typography>
                        <Typography variant="body2"><strong>Quality:</strong> {checkResult.quality || 'N/A'}</Typography>
                        <Typography variant="body2"><strong>Is Bulked:</strong> {checkResult.is_bulked ? 'Yes' : 'No'}</Typography>
                        <Typography variant="body2"><strong>Registered At:</strong> {new Date(checkResult.registered_at).toLocaleString()}</Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Typography>Phone number not found in registry</Typography>
                  )}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Register Phone Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Phone size={24} />
                <Typography variant="h5" fontWeight={600}>Register Phone Number</Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Phone Number*"
                    value={registerData.phone_number}
                    onChange={(e) => setRegisterData({ ...registerData, phone_number: e.target.value })}
                    size="small"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Bot Name*"
                    value={registerData.botname}
                    onChange={(e) => setRegisterData({ ...registerData, botname: e.target.value })}
                    size="small"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Country*"
                    value={registerData.country}
                    onChange={(e) => setRegisterData({ ...registerData, country: e.target.value })}
                    size="small"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="ISO2 Code*"
                    value={registerData.iso2}
                    onChange={(e) => setRegisterData({ ...registerData, iso2: e.target.value.toUpperCase() })}
                    size="small"
                    inputProps={{ maxLength: 2 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Quality"
                    value={registerData.quality}
                    onChange={(e) => setRegisterData({ ...registerData, quality: e.target.value })}
                    size="small"
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="2FA Password*"
                    value={registerData.twofa}
                    onChange={(e) => setRegisterData({ ...registerData, twofa: e.target.value })}
                    size="small"
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Session String*"
                    value={registerData.session_string}
                    onChange={(e) => setRegisterData({ ...registerData, session_string: e.target.value })}
                    multiline
                    rows={3}
                    size="small"
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleRegisterPhone}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} /> : <Phone size={16} />}
                  >
                    Register Phone
                  </Button>
                </Grid>
              </Grid>

              {registerResult && registerResult.success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  {registerResult.message}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
