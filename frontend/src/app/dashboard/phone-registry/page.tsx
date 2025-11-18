'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Breadcrumbs from '@/components/Breadcrumbs';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Grid,
  Paper,
  Divider,
} from '@mui/material';
import { Phone, Search, Upload, List, BarChart, Trash2, MessageSquare } from 'lucide-react';
import apiClient from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function PhoneRegistryPage() {
  const [tabValue, setTabValue] = useState(0);
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

  // Bulk Register
  const [bulkPhones, setBulkPhones] = useState('');
  const [bulkResult, setBulkResult] = useState<any>(null);

  // List Phones
  const [phones, setPhones] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    botname: '',
    country: '',
    iso2: '',
    quality: '',
  });

  // Analytics
  const [analytics, setAnalytics] = useState<any>(null);

  // Cleanup
  const [retentionDays, setRetentionDays] = useState('7');
  const [cleanupResult, setCleanupResult] = useState<any>(null);

  // Spam Analysis
  const [spamMessage, setSpamMessage] = useState('');
  const [spamResult, setSpamResult] = useState<any>(null);

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

  const fetchPhones = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: page + 1,
        limit: rowsPerPage,
      };

      Object.keys(filters).forEach(key => {
        if (filters[key as keyof typeof filters]) {
          params[key] = filters[key as keyof typeof filters];
        }
      });

      const response = await apiClient.get('/phone/list/', { params });
      setPhones(response.data.items || []);
      setTotal(response.data.total || 0);
    } catch (error: any) {
      console.error('Error fetching phones:', error);
      toast.showError(error.response?.data?.message || 'Failed to fetch phones');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/phone/analytics/');
      setAnalytics(response.data);
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      toast.showError(error.response?.data?.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleCleanup = async () => {
    if (!retentionDays || parseInt(retentionDays) < 1) {
      toast.showError('Please enter valid retention days');
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.delete('/phone/cleanup/', {
        data: { retention_days: parseInt(retentionDays) }
      });
      setCleanupResult(response.data);
      toast.showSuccess(response.data.message || 'Cleanup completed');
    } catch (error: any) {
      console.error('Error during cleanup:', error);
      toast.showError(error.response?.data?.message || 'Failed to cleanup');
      setCleanupResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeSpam = async () => {
    if (!spamMessage) {
      toast.showError('Please enter a message to analyze');
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.post('/phone/analyze-spam/', { message: spamMessage });
      setSpamResult(response.data);
      toast.showSuccess('Analysis completed');
    } catch (error: any) {
      console.error('Error analyzing spam:', error);
      toast.showError(error.response?.data?.message || 'Failed to analyze');
      setSpamResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Breadcrumbs items={[{ label: 'Phone Registry' }]} />
      
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Phone size={32} />
            <Typography variant="h4" fontWeight={600}>Phone Registry Management</Typography>
          </Box>

          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} aria-label="phone registry tabs">
            <Tab icon={<Search size={16} />} label="Check" iconPosition="start" />
            <Tab icon={<Phone size={16} />} label="Register" iconPosition="start" />
            <Tab icon={<Upload size={16} />} label="Bulk Register" iconPosition="start" />
            <Tab icon={<List size={16} />} label="List" iconPosition="start" />
            <Tab icon={<BarChart size={16} />} label="Analytics" iconPosition="start" />
            <Tab icon={<Trash2 size={16} />} label="Cleanup" iconPosition="start" />
            <Tab icon={<MessageSquare size={16} />} label="Spam Analysis" iconPosition="start" />
          </Tabs>

          {/* Check Phone Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ maxWidth: 600 }}>
              <Typography variant="h6" gutterBottom>Check Phone Number</Typography>
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
            </Box>
          </TabPanel>

          {/* Register Phone Tab */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>Register Phone Number</Typography>
            <Grid container spacing={2} sx={{ maxWidth: 800 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number*"
                  value={registerData.phone_number}
                  onChange={(e) => setRegisterData({ ...registerData, phone_number: e.target.value })}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Bot Name*"
                  value={registerData.botname}
                  onChange={(e) => setRegisterData({ ...registerData, botname: e.target.value })}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country*"
                  value={registerData.country}
                  onChange={(e) => setRegisterData({ ...registerData, country: e.target.value })}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ISO2 Code*"
                  value={registerData.iso2}
                  onChange={(e) => setRegisterData({ ...registerData, iso2: e.target.value.toUpperCase() })}
                  size="small"
                  inputProps={{ maxLength: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="2FA Password*"
                  value={registerData.twofa}
                  onChange={(e) => setRegisterData({ ...registerData, twofa: e.target.value })}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Quality"
                  value={registerData.quality}
                  onChange={(e) => setRegisterData({ ...registerData, quality: e.target.value })}
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
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
              <Grid item xs={12}>
                <Button
                  variant="contained"
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
          </TabPanel>

          {/* Bulk Register Tab */}
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ maxWidth: 600 }}>
              <Typography variant="h6" gutterBottom>Bulk Register Phone Numbers</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Enter phone numbers (one per line, max 1000)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={10}
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
            </Box>
          </TabPanel>

          {/* List Tab */}
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" gutterBottom>Phone Registry List</Typography>
            <Box display="flex" gap={2} mb={2} flexWrap="wrap">
              <TextField
                label="Bot Name"
                value={filters.botname}
                onChange={(e) => setFilters({ ...filters, botname: e.target.value })}
                size="small"
              />
              <TextField
                label="Country"
                value={filters.country}
                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                size="small"
              />
              <TextField
                label="ISO2"
                value={filters.iso2}
                onChange={(e) => setFilters({ ...filters, iso2: e.target.value })}
                size="small"
              />
              <TextField
                label="Quality"
                value={filters.quality}
                onChange={(e) => setFilters({ ...filters, quality: e.target.value })}
                size="small"
              />
              <Button
                variant="contained"
                onClick={fetchPhones}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} /> : <Search size={16} />}
              >
                Search
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Phone Number</TableCell>
                    <TableCell>Bot Name</TableCell>
                    <TableCell>Country</TableCell>
                    <TableCell>ISO2</TableCell>
                    <TableCell>Quality</TableCell>
                    <TableCell>Bulked</TableCell>
                    <TableCell>Registered At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {phones.map((phone, index) => (
                    <TableRow key={index}>
                      <TableCell>{phone.phone_number}</TableCell>
                      <TableCell>{phone.botname || 'N/A'}</TableCell>
                      <TableCell>{phone.country || 'N/A'}</TableCell>
                      <TableCell>{phone.iso2 || 'N/A'}</TableCell>
                      <TableCell>{phone.quality || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={phone.is_bulked ? 'Yes' : 'No'} 
                          size="small"
                          color={phone.is_bulked ? 'default' : 'primary'}
                        />
                      </TableCell>
                      <TableCell>{new Date(phone.registered_at).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[10, 25, 50, 100]}
              component="div"
              count={total}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            />
          </TabPanel>

          {/* Analytics Tab */}
          <TabPanel value={tabValue} index={4}>
            <Typography variant="h6" gutterBottom>Phone Registry Analytics</Typography>
            <Button
              variant="contained"
              onClick={fetchAnalytics}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} /> : <BarChart size={16} />}
              sx={{ mb: 3 }}
            >
              Load Analytics
            </Button>

            {analytics && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" color="primary">{analytics.total_count}</Typography>
                    <Typography variant="body2" color="text.secondary">Total Phones</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" color="success.main">{analytics.individual_count}</Typography>
                    <Typography variant="body2" color="text.secondary">Individual</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" color="warning.main">{analytics.bulked_count}</Typography>
                    <Typography variant="body2" color="text.secondary">Bulked</Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>By Country</Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {Object.entries(analytics.by_country || {}).map(([country, count]: [string, any]) => (
                      <Chip key={country} label={`${country}: ${count}`} />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>By Bot Name</Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {Object.entries(analytics.by_botname || {}).map(([botname, count]: [string, any]) => (
                      <Chip key={botname} label={`${botname}: ${count}`} color="primary" />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>By Quality</Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {Object.entries(analytics.by_quality || {}).map(([quality, count]: [string, any]) => (
                      <Chip key={quality} label={`${quality}: ${count}`} color="success" />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            )}
          </TabPanel>

          {/* Cleanup Tab */}
          <TabPanel value={tabValue} index={5}>
            <Box sx={{ maxWidth: 600 }}>
              <Typography variant="h6" gutterBottom>Cleanup Old Records</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Delete phone records older than specified days
              </Typography>
              <Box display="flex" gap={2} mb={2} alignItems="center">
                <TextField
                  label="Retention Days"
                  type="number"
                  value={retentionDays}
                  onChange={(e) => setRetentionDays(e.target.value)}
                  size="small"
                  inputProps={{ min: 1 }}
                />
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleCleanup}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={16} /> : <Trash2 size={16} />}
                >
                  Cleanup
                </Button>
              </Box>

              <Box display="flex" gap={1} mb={2}>
                {[7, 30, 90, 365].map((days) => (
                  <Chip
                    key={days}
                    label={`${days} days`}
                    onClick={() => setRetentionDays(days.toString())}
                    color={retentionDays === days.toString() ? 'primary' : 'default'}
                  />
                ))}
              </Box>

              {cleanupResult && cleanupResult.success && (
                <Alert severity="success">
                  {cleanupResult.message}
                </Alert>
              )}
            </Box>
          </TabPanel>

          {/* Spam Analysis Tab */}
          <TabPanel value={tabValue} index={6}>
            <Box sx={{ maxWidth: 800 }}>
              <Typography variant="h6" gutterBottom>Spam/Status Analysis</Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Message to Analyze"
                value={spamMessage}
                onChange={(e) => setSpamMessage(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                onClick={handleAnalyzeSpam}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} /> : <MessageSquare size={16} />}
              >
                Analyze Message
              </Button>

              {spamResult && (
                <Box sx={{ mt: 3 }}>
                  <Alert severity={
                    spamResult.status === 'frozen' ? 'error' :
                    spamResult.status === 'limited' ? 'warning' :
                    spamResult.status === 'registered' ? 'info' : 'success'
                  }>
                    <Typography variant="subtitle2">
                      Status: <strong>{spamResult.status.toUpperCase()}</strong>
                    </Typography>
                    <Typography variant="body2">
                      Confidence: {spamResult.confidence}
                    </Typography>
                  </Alert>

                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>Indicators Found</Typography>
                        {Object.entries(spamResult.indicators_found || {}).map(([key, value]: [string, any]) => (
                          <Typography key={key} variant="body2">
                            {key}: {value}
                          </Typography>
                        ))}
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>Template Similarities</Typography>
                        {Object.entries(spamResult.template_similarities || {}).map(([key, value]: [string, any]) => (
                          <Typography key={key} variant="body2">
                            {key}: {(value * 100).toFixed(1)}%
                          </Typography>
                        ))}
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          </TabPanel>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
