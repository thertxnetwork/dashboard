'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Typography, Card, CardContent } from '@mui/material';

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <Card>
        <CardContent>
          <Typography variant="h3">Reports</Typography>
          <Typography variant="body1" mt={2}>Reports page coming soon...</Typography>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
