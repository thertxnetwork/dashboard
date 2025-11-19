'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Grid } from "@mui/material";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { Users, UserCheck, UserX, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import apiClient from '@/lib/api';
import QuranAyatCard from '@/components/QuranAyatCard';

interface Stats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  new_users_30d: number;
}

interface ChartData {
  user_growth: Array<{ date: string; users: number }>;
  users_by_role: Array<{ role: string; count: number }>;
}

const COLORS = ['#0D5C47', '#10875F', '#7CB342', '#F57C00'];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, chartsRes] = await Promise.all([
          apiClient.get('/dashboard/stats/'),
          apiClient.get('/dashboard/charts/'),
        ]);

        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }

        if (chartsRes.data.success) {
          setChartData(chartsRes.data.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  const kpiCards = [
    {
      title: 'Total Users',
      value: stats?.total_users || 0,
      icon: <Users size={28} />,
      color: '#0D5C47',
      bgColor: 'rgba(13, 92, 71, 0.1)',
      trend: '+12.5%',
      trendUp: true,
    },
    {
      title: 'Active Users',
      value: stats?.active_users || 0,
      icon: <UserCheck size={28} />,
      color: '#10875F',
      bgColor: 'rgba(16, 135, 95, 0.1)',
      trend: '+8.2%',
      trendUp: true,
    },
    {
      title: 'Inactive Users',
      value: stats?.inactive_users || 0,
      icon: <UserX size={28} />,
      color: '#C62828',
      bgColor: 'rgba(198, 40, 40, 0.1)',
      trend: '-3.1%',
      trendUp: false,
    },
    {
      title: 'New Users (30d)',
      value: stats?.new_users_30d || 0,
      icon: <TrendingUp size={28} />,
      color: '#F57C00',
      bgColor: 'rgba(245, 124, 0, 0.1)',
      trend: '+24.3%',
      trendUp: true,
    },
  ];

  return (
    <DashboardLayout>
      <Breadcrumbs items={[{ label: 'Dashboard' }]} />
      
      <Grid container spacing={3}>
        {/* Quran Ayat Card - Full Width */}
        <Grid size={{ xs: 12 }}>
          <QuranAyatCard autoChangeInterval={30000} />
        </Grid>

        {kpiCards.map((card, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card sx={{ 
              height: '100%',
              minHeight: '140px',
              transition: 'all 200ms ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
              }
            }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="h3" component="div" sx={{ fontWeight: 700, mt: 1, mb: 1.5 }}>
                      {card.value.toLocaleString()}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: card.trendUp ? '#2E7D32' : '#C62828',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }}
                      >
                        {card.trend}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        vs last period
                      </Typography>
                    </Box>
                  </Box>
                  <Box 
                    sx={{ 
                      color: card.color,
                      bgcolor: card.bgColor,
                      p: 1.5,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
                User Growth (Last 7 Days)
              </Typography>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={chartData?.user_growth || []}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D5C47" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#0D5C47" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
                  <XAxis 
                    dataKey="date" 
                    style={{ fontSize: '0.75rem' }}
                    stroke="#626B67"
                    tick={{ fill: '#626B67' }}
                  />
                  <YAxis 
                    style={{ fontSize: '0.75rem' }}
                    stroke="#626B67"
                    tick={{ fill: '#626B67' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: 8, 
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '16px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#0D5C47" 
                    strokeWidth={3}
                    dot={{ fill: '#0D5C47', r: 5, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 7 }}
                    fill="url(#colorUsers)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
                Users by Role
              </Typography>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={chartData?.users_by_role || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.role}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="count"
                    strokeWidth={2}
                    stroke="#fff"
                  >
                    {(chartData?.users_by_role || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: 8, 
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
