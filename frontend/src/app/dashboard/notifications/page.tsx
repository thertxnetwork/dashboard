'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Typography, Card, CardContent } from '@mui/material';

export default function NotificationsPage() {
  return (
    <DashboardLayout>
      <Card>
        <CardContent>
          <Typography variant="h3">Notifications</Typography>
          <Typography variant="body1" mt={2}>Notifications page coming soon...</Typography>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
