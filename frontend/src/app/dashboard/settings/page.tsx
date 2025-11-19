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
import { Save, CheckCircle, Phone } from 'lucide-react';
import apiClient from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testingCheckApi, setTestingCheckApi] = useState(false);
  const [savingCheckApi, setSavingCheckApi] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.is_staff || user?.is_superuser;
  
  const [settings, setSettings] = useState({
    binance_api_key: '',
    binance_api_secret: '',
    binance_enabled: false,
  });
  
  const [checkApiSettings, setCheckApiSettings] = useState({
    base_url: '',
    api_key: '',
    is_active: false,
    exists: false,
  });
  
  const [error, setError] = useState('');
  const [checkApiError, setCheckApiError] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetchSettings();
    if (isAdmin) {
      fetchCheckApiSettings();
    }
  }, [isAdmin]);

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
  
  const fetchCheckApiSettings = async () => {
    try {
      const response = await apiClient.get('/phone/config/');
      if (response.data.success) {
        const data = response.data.data;
        setCheckApiSettings({
          base_url: data.base_url || '',
          api_key: '', // Don't populate the key field for security
          is_active: data.is_active || false,
          exists: data.exists || false,
        });
      }
    } catch (error: any) {
      console.error('Error fetching Check API settings:', error);
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
  
  const handleSaveCheckApi = async () => {
    if (!checkApiSettings.base_url || !checkApiSettings.api_key) {
      toast.showError('Please fill in all Check API fields');
      return;
    }
    
    try {
      setSavingCheckApi(true);
      setCheckApiError('');
      
      const response = await apiClient.post('/phone/config/update/', {
        base_url: checkApiSettings.base_url,
        api_key: checkApiSettings.api_key,
        is_active: checkApiSettings.is_active,
      });
      
      if (response.data.success) {
        toast.showSuccess('Check API configuration saved successfully');
        // Clear API key field for security
        setCheckApiSettings(prev => ({
          ...prev,
          api_key: '',
          exists: true,
        }));
        fetchCheckApiSettings(); // Refresh to get masked key
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to save Check API configuration';
      setCheckApiError(message);
      toast.showError(message);
    } finally {
      setSavingCheckApi(false);
    }
  };
  
  const handleTestCheckApi = async () => {
    try {
      setTestingCheckApi(true);
      setCheckApiError('');
      
      const response = await apiClient.post('/phone/config/test/');
      if (response.data.success) {
        toast.showSuccess('Check API connection successful!');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Check API connection test failed';
      setCheckApiError(message);
      toast.showError(message);
    } finally {
      setTestingCheckApi(false);
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
      <Typography variant="h3" mb={3}>
        Settings
      </Typography>

      {/* Check API Configuration - Admin Only */}
      {isAdmin && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Phone size={24} />
              <Typography variant="h5">
                Check API Configuration
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Configure the external Check API for phone registry management
            </Typography>

            {checkApiError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {checkApiError}
              </Alert>
            )}

            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Check API Base URL"
                value={checkApiSettings.base_url}
                onChange={(e) =>
                  setCheckApiSettings({ ...checkApiSettings, base_url: e.target.value })
                }
                placeholder="http://checkapi.org"
                size="small"
                helperText="The base URL of the Check API service"
              />

              <TextField
                fullWidth
                label="API Key"
                type="password"
                value={checkApiSettings.api_key}
                onChange={(e) =>
                  setCheckApiSettings({ ...checkApiSettings, api_key: e.target.value })
                }
                placeholder={checkApiSettings.exists ? "Enter new API key to change" : "Enter your Check API key"}
                size="small"
                helperText={checkApiSettings.exists ? "Leave blank to keep current API key" : "Your Check API authentication key"}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={checkApiSettings.is_active}
                    onChange={(e) =>
                      setCheckApiSettings({ ...checkApiSettings, is_active: e.target.checked })
                    }
                  />
                }
                label="Enable Check API"
              />

              <Divider />

              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  startIcon={savingCheckApi ? <CircularProgress size={20} /> : <Save size={20} />}
                  onClick={handleSaveCheckApi}
                  disabled={savingCheckApi}
                >
                  Save Check API Config
                </Button>
                <Button
                  variant="outlined"
                  startIcon={testingCheckApi ? <CircularProgress size={20} /> : <CheckCircle size={20} />}
                  onClick={handleTestCheckApi}
                  disabled={testingCheckApi || !checkApiSettings.exists}
                >
                  Test Connection
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Binance Pay Configuration */}
      <Card>
        <CardContent>
          <Typography variant="h5" mb={2}>
            Binance Pay Integration
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Configure Binance Pay API for payment processing
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

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
