'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Typography, Card, CardContent } from '@mui/material';

export default function MonitoringPage() {
  return (
    <DashboardLayout>
      <Card>
        <CardContent>
          <Typography variant="h3">System Monitoring</Typography>
          <Typography variant="body1" mt={2}>Monitoring page coming soon...</Typography>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
