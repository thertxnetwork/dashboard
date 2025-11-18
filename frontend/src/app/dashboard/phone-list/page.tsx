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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Paper,
} from '@mui/material';
import { List, Search } from 'lucide-react';
import apiClient from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';

export default function PhoneListPage() {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

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

  return (
    <DashboardLayout>
      <Breadcrumbs items={[{ label: 'Phone List' }]} />
      
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <List size={32} />
            <Typography variant="h4" fontWeight={600}>Phone Registry List</Typography>
          </Box>

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
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
