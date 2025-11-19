'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Breadcrumbs from '@/components/Breadcrumbs';
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
  TablePagination,
  TextField,
  Button,
  CircularProgress,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Collapse,
  IconButton,
} from '@mui/material';
import { List, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import apiClient from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';

interface PhoneRecord {
  phone_number: string;
  registered_at: string;
  botname: string;
  country: string;
  iso2: string;
  twofa: string;
  quality: string;
  is_bulked: boolean;
}

export default function PhoneListPage() {
  const [records, setRecords] = useState<PhoneRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(100);
  const [showFilters, setShowFilters] = useState(false);
  const toast = useToast();

  const [filters, setFilters] = useState({
    botname: '',
    country: '',
    iso2: '',
    is_bulked: '',
    quality: '',
    order_by: 'registered_at',
    order_direction: 'desc',
  });

  const fetchRecords = async () => {
    try {
      setLoading(true);

      const params: any = {
        page: page + 1,
        limit: limit,
      };

      // Add filters if set
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '') {
          params[key] = value;
        }
      });

      const response = await apiClient.get('/phone/list/', { params });

      setRecords(response.data.items || []);
      setTotal(response.data.total || 0);
    } catch (error: any) {
      console.error('Error fetching records:', error);
      toast.showError(error.response?.data?.message || 'Failed to load phone records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [page, limit]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = () => {
    setPage(0);
    fetchRecords();
  };

  const handleClearFilters = () => {
    setFilters({
      botname: '',
      country: '',
      iso2: '',
      is_bulked: '',
      quality: '',
      order_by: 'registered_at',
      order_direction: 'desc',
    });
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <DashboardLayout>
      <Breadcrumbs items={[{ label: 'Phone Registry' }, { label: 'Phone List' }]} />
      
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box display="flex" alignItems="center" gap={2}>
              <List size={24} />
              <Typography variant="h4" fontWeight={600}>Phone Registry</Typography>
              <Chip label={`${total} records`} color="primary" size="small" />
            </Box>
            <Button
              variant="outlined"
              startIcon={showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
          </Box>

          <Collapse in={showFilters}>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Bot Name"
                      value={filters.botname}
                      onChange={(e) => handleFilterChange('botname', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Country"
                      value={filters.country}
                      onChange={(e) => handleFilterChange('country', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="ISO2"
                      value={filters.iso2}
                      onChange={(e) => handleFilterChange('iso2', e.target.value.toUpperCase())}
                      inputProps={{ maxLength: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Quality"
                      value={filters.quality}
                      onChange={(e) => handleFilterChange('quality', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Bulk Status</InputLabel>
                      <Select
                        value={filters.is_bulked}
                        label="Bulk Status"
                        onChange={(e) => handleFilterChange('is_bulked', e.target.value)}
                      >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="true">Bulked</MenuItem>
                        <MenuItem value="false">Individual</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Order By</InputLabel>
                      <Select
                        value={filters.order_by}
                        label="Order By"
                        onChange={(e) => handleFilterChange('order_by', e.target.value)}
                      >
                        <MenuItem value="registered_at">Registered At</MenuItem>
                        <MenuItem value="phone_number">Phone Number</MenuItem>
                        <MenuItem value="country">Country</MenuItem>
                        <MenuItem value="botname">Bot Name</MenuItem>
                        <MenuItem value="quality">Quality</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Direction</InputLabel>
                      <Select
                        value={filters.order_direction}
                        label="Direction"
                        onChange={(e) => handleFilterChange('order_direction', e.target.value)}
                      >
                        <MenuItem value="asc">Ascending</MenuItem>
                        <MenuItem value="desc">Descending</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Box display="flex" gap={2}>
                      <Button variant="contained" onClick={handleApplyFilters} startIcon={<Search size={18} />}>
                        Apply Filters
                      </Button>
                      <Button variant="outlined" onClick={handleClearFilters}>
                        Clear
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Collapse>

          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Phone Number</TableCell>
                      <TableCell>Bot Name</TableCell>
                      <TableCell>Country</TableCell>
                      <TableCell>ISO2</TableCell>
                      <TableCell>Quality</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Registered At</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {records.map((record, index) => (
                      <TableRow key={index} hover>
                        <TableCell sx={{ fontFamily: 'monospace' }}>{record.phone_number}</TableCell>
                        <TableCell>{record.botname || '-'}</TableCell>
                        <TableCell>{record.country || '-'}</TableCell>
                        <TableCell>{record.iso2 || '-'}</TableCell>
                        <TableCell>
                          {record.quality ? (
                            <Chip label={record.quality} size="small" color="primary" />
                          ) : '-'}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={record.is_bulked ? 'Bulked' : 'Individual'}
                            size="small"
                            color={record.is_bulked ? 'warning' : 'success'}
                          />
                        </TableCell>
                        <TableCell>
                          {record.registered_at ? new Date(record.registered_at).toLocaleString() : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={limit}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 25, 50, 100, 250, 500, 1000]}
              />
            </>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
