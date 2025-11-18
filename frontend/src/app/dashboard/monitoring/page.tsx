'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Grid } from "@mui/material";
import { 
  Typography, 
  Card, 
  CardContent, 
  Box, 
  LinearProgress,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Cpu, HardDrive, Activity, Server, CheckCircle, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SystemMetrics {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  active_connections: number;
}

export default function MonitoringPage() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu_usage: 45,
    memory_usage: 62,
    disk_usage: 38,
    status: 'healthy',
    uptime: 864000,
    active_connections: 124,
  });
  const [loading, setLoading] = useState(true);
  const [historicalData, setHistoricalData] = useState<Array<{ time: string; cpu: number; memory: number }>>([]);

  useEffect(() => {
    // Simulate real-time data fetching
    const fetchMetrics = async () => {
      try {
        // In production, fetch from actual API
        // const response = await apiClient.get('/monitoring/metrics/');
        
        // Simulate data
        const now = new Date();
        const newData = Array.from({ length: 20 }, (_, i) => ({
          time: new Date(now.getTime() - (19 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          cpu: Math.random() * 40 + 30,
          memory: Math.random() * 30 + 50,
        }));
        
        setHistoricalData(newData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching metrics:', error);
        setLoading(false);
      }
    };

    fetchMetrics();
    
    // Update metrics every 30 seconds
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpu_usage: Math.max(0, Math.min(100, prev.cpu_usage + (Math.random() - 0.5) * 10)),
        memory_usage: Math.max(0, Math.min(100, prev.memory_usage + (Math.random() - 0.5) * 5)),
        active_connections: Math.max(0, prev.active_connections + Math.floor((Math.random() - 0.5) * 20)),
      }));

      setHistoricalData(prev => {
        const newPoint = {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          cpu: Math.random() * 40 + 30,
          memory: Math.random() * 30 + 50,
        };
        return [...prev.slice(1), newPoint];
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'success';
      case 'warning': return 'warning';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const getUsageColor = (usage: number) => {
    if (usage < 60) return 'success';
    if (usage < 80) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Breadcrumbs items={[{ label: 'System Monitoring' }]} />
      
      <Box mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h4" fontWeight={600}>System Status</Typography>
          <Chip 
            label={metrics.status.toUpperCase()} 
            color={getStatusColor(metrics.status) as any}
            icon={metrics.status === 'healthy' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Real-time system metrics and performance monitoring
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Box
                  sx={{
                    bgcolor: 'rgba(16, 185, 129, 0.1)',
                    p: 1.5,
                    borderRadius: 2,
                    color: '#10b981',
                  }}
                >
                  <Cpu size={24} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">CPU Usage</Typography>
                  <Typography variant="h4" fontWeight={700}>{metrics.cpu_usage.toFixed(1)}%</Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={metrics.cpu_usage} 
                color={getUsageColor(metrics.cpu_usage) as any}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Box
                  sx={{
                    bgcolor: 'rgba(59, 130, 246, 0.1)',
                    p: 1.5,
                    borderRadius: 2,
                    color: '#3b82f6',
                  }}
                >
                  <HardDrive size={24} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Memory Usage</Typography>
                  <Typography variant="h4" fontWeight={700}>{metrics.memory_usage.toFixed(1)}%</Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={metrics.memory_usage} 
                color={getUsageColor(metrics.memory_usage) as any}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Box
                  sx={{
                    bgcolor: 'rgba(139, 92, 246, 0.1)',
                    p: 1.5,
                    borderRadius: 2,
                    color: '#8b5cf6',
                  }}
                >
                  <Server size={24} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Disk Usage</Typography>
                  <Typography variant="h4" fontWeight={700}>{metrics.disk_usage.toFixed(1)}%</Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={metrics.disk_usage} 
                color={getUsageColor(metrics.disk_usage) as any}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Box
                  sx={{
                    bgcolor: 'rgba(245, 158, 11, 0.1)',
                    p: 1.5,
                    borderRadius: 2,
                    color: '#f59e0b',
                  }}
                >
                  <Activity size={24} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Active Connections</Typography>
                  <Typography variant="h4" fontWeight={700}>{metrics.active_connections}</Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Uptime: {formatUptime(metrics.uptime)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
                Resource Usage Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis 
                    dataKey="time" 
                    style={{ fontSize: '0.75rem' }}
                    stroke="#737373"
                  />
                  <YAxis 
                    style={{ fontSize: '0.75rem' }}
                    stroke="#737373"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: 8, 
                      border: '1px solid #e5e5e5',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cpu" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="CPU %"
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="memory" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Memory %"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom fontWeight={600} sx={{ mb: 2 }}>
                System Information
              </Typography>
              <Box display="flex" flexDirection="column" gap={1.5}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">OS</Typography>
                  <Typography variant="body2" fontWeight={500}>Linux Ubuntu 22.04</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Kernel</Typography>
                  <Typography variant="body2" fontWeight={500}>5.15.0-91</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Architecture</Typography>
                  <Typography variant="body2" fontWeight={500}>x86_64</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">CPU Cores</Typography>
                  <Typography variant="body2" fontWeight={500}>8</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Total Memory</Typography>
                  <Typography variant="body2" fontWeight={500}>16 GB</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom fontWeight={600} sx={{ mb: 2 }}>
                Service Status
              </Typography>
              <Box display="flex" flexDirection="column" gap={1.5}>
                {[
                  { name: 'Database', status: 'Running', color: 'success' },
                  { name: 'Web Server', status: 'Running', color: 'success' },
                  { name: 'Cache Server', status: 'Running', color: 'success' },
                  { name: 'Background Workers', status: 'Running', color: 'success' },
                  { name: 'Email Service', status: 'Running', color: 'success' },
                ].map((service, index) => (
                  <Box key={index} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">{service.name}</Typography>
                    <Chip 
                      label={service.status} 
                      size="small" 
                      color={service.color as any}
                      sx={{ height: 24, fontSize: '0.75rem' }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
