'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Typography, Card, CardContent } from '@mui/material';

export default function DatabasePage() {
  return (
    <DashboardLayout>
      <Card>
        <CardContent>
          <Typography variant="h3">Database Management</Typography>
          <Typography variant="body1" mt={2}>Database management page coming soon...</Typography>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
