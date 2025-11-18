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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  TablePagination,
} from '@mui/material';
import { Shield, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

interface AuditLog {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  status: 'success' | 'failed' | 'warning';
  ip_address: string;
}

interface SecurityStats {
  total_events: number;
  failed_logins: number;
  successful_logins: number;
  suspicious_activities: number;
}

export default function SecurityPage() {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [stats, setStats] = useState<SecurityStats>({
    total_events: 1247,
    failed_logins: 23,
    successful_logins: 892,
    suspicious_activities: 5,
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 1,
      timestamp: new Date().toISOString(),
      user: 'admin@example.com',
      action: 'User Login',
      resource: '/api/auth/login',
      status: 'success',
      ip_address: '192.168.1.100',
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 300000).toISOString(),
      user: 'john.doe@example.com',
      action: 'View Users',
      resource: '/api/users',
      status: 'success',
      ip_address: '192.168.1.105',
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 600000).toISOString(),
      user: 'unknown',
      action: 'Failed Login',
      resource: '/api/auth/login',
      status: 'failed',
      ip_address: '103.45.67.89',
    },
    {
      id: 4,
      timestamp: new Date(Date.now() - 900000).toISOString(),
      user: 'jane.smith@example.com',
      action: 'Update User',
      resource: '/api/users/45',
      status: 'success',
      ip_address: '192.168.1.110',
    },
    {
      id: 5,
      timestamp: new Date(Date.now() - 1200000).toISOString(),
      user: 'admin@example.com',
      action: 'Delete User',
      resource: '/api/users/23',
      status: 'success',
      ip_address: '192.168.1.100',
    },
    {
      id: 6,
      timestamp: new Date(Date.now() - 1500000).toISOString(),
      user: 'unknown',
      action: 'Unauthorized Access',
      resource: '/api/admin',
      status: 'warning',
      ip_address: '185.234.56.78',
    },
    {
      id: 7,
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      user: 'john.doe@example.com',
      action: 'Export Data',
      resource: '/api/reports/export',
      status: 'success',
      ip_address: '192.168.1.105',
    },
    {
      id: 8,
      timestamp: new Date(Date.now() - 2100000).toISOString(),
      user: 'unknown',
      action: 'Failed Login',
      resource: '/api/auth/login',
      status: 'failed',
      ip_address: '103.45.67.89',
    },
  ]);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'success';
      case 'failed': return 'error';
      case 'warning': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle size={16} />;
      case 'failed': return <XCircle size={16} />;
      case 'warning': return <AlertTriangle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
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
      <Breadcrumbs items={[{ label: 'Security & Audit Logs' }]} />
      
      <Box mb={3}>
        <Typography variant="h4" fontWeight={600}>Security Dashboard</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Monitor security events and audit logs
        </Typography>
      </Box>

      <Grid container spacing={3} mb={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    bgcolor: 'rgba(16, 185, 129, 0.1)',
                    p: 1.5,
                    borderRadius: 2,
                    color: '#10b981',
                  }}
                >
                  <Shield size={24} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Total Events</Typography>
                  <Typography variant="h4" fontWeight={700}>{stats.total_events.toLocaleString()}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    bgcolor: 'rgba(59, 130, 246, 0.1)',
                    p: 1.5,
                    borderRadius: 2,
                    color: '#3b82f6',
                  }}
                >
                  <CheckCircle size={24} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Successful Logins</Typography>
                  <Typography variant="h4" fontWeight={700}>{stats.successful_logins.toLocaleString()}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    bgcolor: 'rgba(239, 68, 68, 0.1)',
                    p: 1.5,
                    borderRadius: 2,
                    color: '#ef4444',
                  }}
                >
                  <XCircle size={24} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Failed Logins</Typography>
                  <Typography variant="h4" fontWeight={700}>{stats.failed_logins.toLocaleString()}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    bgcolor: 'rgba(245, 158, 11, 0.1)',
                    p: 1.5,
                    borderRadius: 2,
                    color: '#f59e0b',
                  }}
                >
                  <AlertTriangle size={24} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Suspicious Activities</Typography>
                  <Typography variant="h4" fontWeight={700}>{stats.suspicious_activities.toLocaleString()}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ maxWidth: '100%', overflow: 'hidden' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
            Recent Audit Logs
          </Typography>
          
          <Box sx={{ width: '100%', overflowX: 'auto', overflowY: 'visible' }}>
            <Table sx={{ minWidth: 800, tableLayout: 'auto' }}>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Resource</TableCell>
                  <TableCell>IP Address</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditLogs
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((log) => (
                    <TableRow key={log.id} hover>
                      <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                          {log.resource}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                          {log.ip_address}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={log.status}
                          size="small"
                          color={getStatusColor(log.status) as any}
                          icon={getStatusIcon(log.status)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Box>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={auditLogs.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
