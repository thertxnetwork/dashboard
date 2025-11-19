'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Breadcrumbs from '@/components/Breadcrumbs';
import {
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  CircularProgress,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { BarChart, PieChart } from 'lucide-react';
import apiClient from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';

export default function PhoneAnalyticsPage() {
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isBulked, setIsBulked] = useState('');
  const toast = useToast();

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      if (isBulked !== '') params.is_bulked = isBulked;

      const response = await apiClient.get('/phone/analytics/', { params });
      setAnalytics(response.data);
    } catch (error: any) {
      toast.showError(error.response?.data?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <DashboardLayout>
      <Breadcrumbs items={[{ label: 'Phone Registry' }, { label: 'Analytics' }]} />
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" fontWeight={600} mb={3}>Phone Registry Analytics</Typography>
          
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Bulk Status</InputLabel>
                <Select value={isBulked} label="Bulk Status" onChange={(e) => setIsBulked(e.target.value)}>
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="true">Bulked</MenuItem>
                  <MenuItem value="false">Individual</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={fetchAnalytics}>Apply Filters</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : analytics ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">Total Count</Typography>
                <Typography variant="h3" fontWeight={600}>{analytics.total_count}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">Bulked</Typography>
                <Typography variant="h3" fontWeight={600} color="warning.main">{analytics.bulked_count}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">Individual</Typography>
                <Typography variant="h3" fontWeight={600} color="success.main">{analytics.individual_count}</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {analytics.by_country && Object.keys(analytics.by_country).length > 0 && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={2}>By Country</Typography>
                  {Object.entries(analytics.by_country).map(([country, count]: [string, any]) => (
                    <Box key={country} display="flex" justifyContent="space-between" mb={1}>
                      <Typography>{country}</Typography>
                      <Typography fontWeight={600}>{count}</Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          )}
          
          {analytics.by_botname && Object.keys(analytics.by_botname).length > 0 && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={2}>By Bot Name</Typography>
                  {Object.entries(analytics.by_botname).map(([botname, count]: [string, any]) => (
                    <Box key={botname} display="flex" justifyContent="space-between" mb={1}>
                      <Typography>{botname}</Typography>
                      <Typography fontWeight={600}>{count}</Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          )}
          
          {analytics.by_quality && Object.keys(analytics.by_quality).length > 0 && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={2}>By Quality</Typography>
                  {Object.entries(analytics.by_quality).map(([quality, count]: [string, any]) => (
                    <Box key={quality} display="flex" justifyContent="space-between" mb={1}>
                      <Typography>{quality}</Typography>
                      <Typography fontWeight={600}>{count}</Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          )}
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>2FA Status</Typography>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography>Enabled</Typography>
                  <Typography fontWeight={600}>{analytics.twofa_enabled || 0}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography>Disabled</Typography>
                  <Typography fontWeight={600}>{analytics.twofa_disabled || 0}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : null}
    </DashboardLayout>
  );
}
