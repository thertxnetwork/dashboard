'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Typography,
  Card,
  CardContent,
  Box,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Divider,
  Stack,
} from '@mui/material';
import { Save, CheckCircle } from 'lucide-react';
import apiClient from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [settings, setSettings] = useState({
    binance_api_key: '',
    binance_api_secret: '',
    binance_enabled: false,
  });
  const [error, setError] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/payments/settings/');
      if (response.data.success) {
        const data = response.data.data;
        setSettings({
          binance_api_key: '',
          binance_api_secret: '',
          binance_enabled: data.binance_enabled || false,
        });
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      
      const payload: any = {
        binance_enabled: settings.binance_enabled,
      };
      
      // Only send API keys if they're not empty
      if (settings.binance_api_key) {
        payload.binance_api_key = settings.binance_api_key;
      }
      if (settings.binance_api_secret) {
        payload.binance_api_secret = settings.binance_api_secret;
      }

      const response = await apiClient.put('/payments/settings/1/', payload);
      if (response.data.success) {
        toast.showSuccess('Settings saved successfully');
        // Clear the input fields after successful save
        setSettings(prev => ({
          ...prev,
          binance_api_key: '',
          binance_api_secret: '',
        }));
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to save settings';
      setError(message);
      toast.showError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      setTesting(true);
      setError('');
      const response = await apiClient.post('/payments/settings/test_connection/');
      if (response.data.success) {
        toast.showSuccess('Connection test successful!');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Connection test failed';
      setError(message);
      toast.showError(message);
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Card>
        <CardContent>
          <Typography variant="h3" mb={3}>
            Settings
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Typography variant="h5" mb={2}>
            Binance Pay Integration
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Configure Binance Pay API for payment processing
          </Typography>

          <Stack spacing={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.binance_enabled}
                  onChange={(e) =>
                    setSettings({ ...settings, binance_enabled: e.target.checked })
                  }
                />
              }
              label="Enable Binance Pay"
            />

            <TextField
              fullWidth
              label="Binance API Key"
              value={settings.binance_api_key}
              onChange={(e) =>
                setSettings({ ...settings, binance_api_key: e.target.value })
              }
              placeholder="Enter new API key or leave blank to keep current"
              size="small"
              disabled={!settings.binance_enabled}
            />

            <TextField
              fullWidth
              label="Binance API Secret"
              type="password"
              value={settings.binance_api_secret}
              onChange={(e) =>
                setSettings({ ...settings, binance_api_secret: e.target.value })
              }
              placeholder="Enter new API secret or leave blank to keep current"
              size="small"
              disabled={!settings.binance_enabled}
            />

            <Divider />

            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                startIcon={saving ? <CircularProgress size={20} /> : <Save size={20} />}
                onClick={handleSave}
                disabled={saving}
              >
                Save Settings
              </Button>
              <Button
                variant="outlined"
                startIcon={testing ? <CircularProgress size={20} /> : <CheckCircle size={20} />}
                onClick={handleTestConnection}
                disabled={testing || !settings.binance_enabled}
              >
                Test Connection
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
