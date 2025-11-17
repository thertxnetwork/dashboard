'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import { FileText, Download, Calendar, TrendingUp, Users, DollarSign } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('users');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [generating, setGenerating] = useState(false);
  const toast = useToast();

  const reportTypes = [
    { value: 'users', label: 'User Report', icon: <Users size={20} /> },
    { value: 'activity', label: 'Activity Report', icon: <TrendingUp size={20} /> },
    { value: 'payments', label: 'Payment Report', icon: <DollarSign size={20} /> },
    { value: 'audit', label: 'Security Audit Report', icon: <FileText size={20} /> },
  ];

  const handleGenerateReport = async (format: 'pdf' | 'csv' | 'excel') => {
    setGenerating(true);
    try {
      // Simulate report generation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.showSuccess(`${format.toUpperCase()} report generated successfully!`);
      
      // In a real implementation, you would call the backend API here
      // const response = await apiClient.post('/reports/generate', {
      //   type: reportType,
      //   format,
      //   dateFrom,
      //   dateTo
      // });
    } catch (error) {
      toast.showError('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      <Card>
        <CardContent>
          <Typography variant="h3" mb={3}>
            Reports Generation
          </Typography>

          <Stack spacing={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                label="Report Type"
              >
                {reportTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box display="flex" alignItems="center" gap={1}>
                      {type.icon}
                      {type.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box display="flex" gap={2}>
              <TextField
                fullWidth
                label="From Date"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
              <TextField
                fullWidth
                label="To Date"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Box>

            <Box>
              <Typography variant="h5" mb={2}>
                Export Format
              </Typography>
              <Box display="flex" gap={2} flexWrap="wrap">
                <Button
                  variant="outlined"
                  startIcon={<Download size={18} />}
                  onClick={() => handleGenerateReport('pdf')}
                  disabled={generating}
                >
                  Export as PDF
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Download size={18} />}
                  onClick={() => handleGenerateReport('csv')}
                  disabled={generating}
                >
                  Export as CSV
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Download size={18} />}
                  onClick={() => handleGenerateReport('excel')}
                  disabled={generating}
                >
                  Export as Excel
                </Button>
              </Box>
            </Box>

            <Card sx={{ bgcolor: 'action.hover', border: '1px dashed', borderColor: 'divider' }}>
              <CardContent>
                <Box display="flex" alignItems="start" gap={2}>
                  <FileText size={24} color="#16a34a" />
                  <Box>
                    <Typography variant="h5" mb={1}>
                      Report Preview
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Selected: <strong>{reportTypes.find((t) => t.value === reportType)?.label}</strong>
                    </Typography>
                    {dateFrom && dateTo && (
                      <Typography variant="body2" color="text.secondary">
                        Date Range: {dateFrom} to {dateTo}
                      </Typography>
                    )}
                    {!dateFrom && !dateTo && (
                      <Typography variant="body2" color="text.secondary">
                        Date Range: All time
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Stack>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
