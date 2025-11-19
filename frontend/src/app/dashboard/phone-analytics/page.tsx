'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Breadcrumbs from '@/components/Breadcrumbs';
import {
  Typography,
  Card,
  CardContent,
  Box,
  CircularProgress,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from '@mui/material';
import { TrendingUp, TrendingDown, Users as UsersIcon, Package } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import apiClient from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6'];

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

  // Prepare chart data
  const countryData = analytics?.by_country ? Object.entries(analytics.by_country).map(([name, value]) => ({
    name,
    value: value as number
  })).sort((a, b) => b.value - a.value).slice(0, 10) : [];

  const botnameData = analytics?.by_botname ? Object.entries(analytics.by_botname).map(([name, value]) => ({
    name,
    value: value as number
  })).sort((a, b) => b.value - a.value).slice(0, 10) : [];

  const qualityData = analytics?.by_quality ? Object.entries(analytics.by_quality).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: value as number
  })) : [];

  const distributionData = analytics ? [
    { name: 'Individual', value: analytics.individual_count || 0, color: '#10b981' },
    { name: 'Bulked', value: analytics.bulked_count || 0, color: '#f59e0b' },
  ] : [];

  const twofaData = analytics ? [
    { name: '2FA Enabled', value: analytics.twofa_enabled || 0, color: '#10b981' },
    { name: '2FA Disabled', value: analytics.twofa_disabled || 0, color: '#ef4444' },
  ] : [];

  return (
    <DashboardLayout>
      <Breadcrumbs items={[{ label: 'Phone Registry' }, { label: 'Analytics' }]} />
      
      <Box mb={3}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Phone Registry Analytics
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Comprehensive statistics and insights for phone number registry
        </Typography>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Filters
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap" alignItems="flex-end">
            <Box flex="1" minWidth="200px">
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Box>
            <Box flex="1" minWidth="200px">
              <TextField
                fullWidth
                type="date"
                label="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Box>
            <Box flex="1" minWidth="200px">
              <FormControl fullWidth size="small">
                <InputLabel>Bulk Status</InputLabel>
                <Select value={isBulked} label="Bulk Status" onChange={(e) => setIsBulked(e.target.value)}>
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="true">Bulked</MenuItem>
                  <MenuItem value="false">Individual</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Button variant="contained" onClick={fetchAnalytics} disabled={loading} sx={{ height: 40 }}>
              {loading ? <CircularProgress size={20} /> : 'Apply'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {loading && !analytics ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : analytics ? (
        <>
          {/* Key Metrics */}
          <Box display="flex" gap={3} flexWrap="wrap" mb={3}>
            <Card sx={{ flex: '1', minWidth: '200px' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Total Records
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color="primary.main">
                      {analytics.total_count?.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    width: 56, 
                    height: 56, 
                    borderRadius: 2, 
                    bgcolor: 'primary.main', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    opacity: 0.1
                  }}>
                    <Package size={28} />
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ flex: '1', minWidth: '200px' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Bulked
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color="warning.main">
                      {analytics.bulked_count?.toLocaleString()}
                    </Typography>
                  </Box>
                  <TrendingUp size={28} color="#f59e0b" opacity={0.3} />
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ flex: '1', minWidth: '200px' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Individual
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color="success.main">
                      {analytics.individual_count?.toLocaleString()}
                    </Typography>
                  </Box>
                  <UsersIcon size={28} color="#10b981" opacity={0.3} />
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ flex: '1', minWidth: '200px' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      2FA Enabled
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      {analytics.twofa_enabled?.toLocaleString()}
                    </Typography>
                  </Box>
                  <TrendingDown size={28} opacity={0.3} />
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Charts Row 1 */}
          <Box display="flex" gap={3} flexWrap="wrap" mb={3}>
            {/* Distribution Pie Chart */}
            <Card sx={{ flex: '1', minWidth: '300px' }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Registration Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => `${name}: ${value} (${((percent || 0) * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* 2FA Status Pie Chart */}
            <Card sx={{ flex: '1', minWidth: '300px' }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  2FA Status
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={twofaData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => `${name}: ${value} (${((percent || 0) * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {twofaData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Box>

          {/* Charts Row 2 */}
          <Box display="flex" gap={3} flexWrap="wrap" mb={3}>
            {/* Top Countries Bar Chart */}
            {countryData.length > 0 && (
              <Card sx={{ flex: '1', minWidth: '400px' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Top 10 Countries
                  </Typography>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={countryData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Top Bot Names Bar Chart */}
            {botnameData.length > 0 && (
              <Card sx={{ flex: '1', minWidth: '400px' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Top 10 Bot Names
                  </Typography>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={botnameData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </Box>

          {/* Quality Distribution */}
          {qualityData.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Quality Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={qualityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </>
      ) : null}
    </DashboardLayout>
  );
}
