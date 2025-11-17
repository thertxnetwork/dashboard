'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Grid,
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

const COLORS = ['#6366f1', '#ec4899', '#8b5cf6', '#f59e0b'];

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
      icon: <Users size={40} />,
      color: '#6366f1',
    },
    {
      title: 'Active Users',
      value: stats?.active_users || 0,
      icon: <UserCheck size={40} />,
      color: '#10b981',
    },
    {
      title: 'Inactive Users',
      value: stats?.inactive_users || 0,
      icon: <UserX size={40} />,
      color: '#ef4444',
    },
    {
      title: 'New Users (30d)',
      value: stats?.new_users_30d || 0,
      icon: <TrendingUp size={40} />,
      color: '#f59e0b',
    },
  ];

  return (
    <DashboardLayout>
      <Grid container spacing={3}>
        {/* Quran Ayat Card - Full Width */}
        <Grid size={{ xs: 12 }}>
          <QuranAyatCard autoChangeInterval={30000} />
        </Grid>

        {kpiCards.map((card, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h2" component="div">
                      {card.value}
                    </Typography>
                  </Box>
                  <Box sx={{ color: card.color }}>{card.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h3" gutterBottom>
                User Growth (Last 7 Days)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData?.user_growth || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h3" gutterBottom>
                Users by Role
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData?.users_by_role || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.role}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {(chartData?.users_by_role || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
