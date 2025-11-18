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

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];

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
      icon: <Users size={32} />,
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
    },
    {
      title: 'Active Users',
      value: stats?.active_users || 0,
      icon: <UserCheck size={32} />,
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)',
    },
    {
      title: 'Inactive Users',
      value: stats?.inactive_users || 0,
      icon: <UserX size={32} />,
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)',
    },
    {
      title: 'New Users (30d)',
      value: stats?.new_users_30d || 0,
      icon: <TrendingUp size={32} />,
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)',
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
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: '0.8125rem' }}>
                      {card.title}
                    </Typography>
                    <Typography variant="h3" component="div" sx={{ fontWeight: 700, mt: 1 }}>
                      {card.value.toLocaleString()}
                    </Typography>
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
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
                User Growth (Last 7 Days)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData?.user_growth || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis 
                    dataKey="date" 
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
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
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
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: 8, 
                      border: '1px solid #e5e5e5',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
