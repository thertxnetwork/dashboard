'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Typography, Card, CardContent } from '@mui/material';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <Card>
        <CardContent>
          <Typography variant="h3">Settings</Typography>
          <Typography variant="body1" mt={2}>Settings page coming soon...</Typography>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
