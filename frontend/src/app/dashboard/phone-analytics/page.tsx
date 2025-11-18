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
  Paper,
  Divider,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import { BarChart, Trash2, MessageSquare } from 'lucide-react';
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

export default function PhoneAnalyticsPage() {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Analytics
  const [analytics, setAnalytics] = useState<any>(null);

  // Cleanup
  const [retentionDays, setRetentionDays] = useState('7');
  const [cleanupResult, setCleanupResult] = useState<any>(null);

  // Spam Analysis
  const [spamMessage, setSpamMessage] = useState('');
  const [spamResult, setSpamResult] = useState<any>(null);

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
      <Breadcrumbs items={[{ label: 'Phone Analytics & Tools' }]} />
      
      <Card>
        <CardContent>
          <Typography variant="h4" fontWeight={600} mb={3}>Phone Analytics & Tools</Typography>

          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} aria-label="analytics tabs">
            <Tab icon={<BarChart size={16} />} label="Statistics" iconPosition="start" />
            <Tab icon={<MessageSquare size={16} />} label="Spam Analyzer" iconPosition="start" />
            <Tab icon={<Trash2 size={16} />} label="Cleanup" iconPosition="start" />
          </Tabs>

          {/* Statistics Tab */}
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom>Phone Registry Statistics</Typography>
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
                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" color="primary">{analytics.total_count}</Typography>
                    <Typography variant="body2" color="text.secondary">Total Phones</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" color="success.main">{analytics.individual_count}</Typography>
                    <Typography variant="body2" color="text.secondary">Individual</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" color="warning.main">{analytics.bulked_count}</Typography>
                    <Typography variant="body2" color="text.secondary">Bulked</Typography>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>By Country</Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {Object.entries(analytics.by_country || {}).map(([country, count]: [string, any]) => (
                      <Chip key={country} label={`${country}: ${count}`} />
                    ))}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom>By Bot Name</Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {Object.entries(analytics.by_botname || {}).map(([botname, count]: [string, any]) => (
                      <Chip key={botname} label={`${botname}: ${count}`} color="primary" />
                    ))}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
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

          {/* Spam Analyzer Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ maxWidth: 800 }}>
              <Typography variant="h6" gutterBottom>Spam/Status Analysis</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Analyze account status messages using NLP detection
              </Typography>
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
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>Indicators Found</Typography>
                        {Object.entries(spamResult.indicators_found || {}).map(([key, value]: [string, any]) => (
                          <Typography key={key} variant="body2">
                            {key}: {value}
                          </Typography>
                        ))}
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
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

          {/* Cleanup Tab */}
          <TabPanel value={tabValue} index={2}>
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
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
