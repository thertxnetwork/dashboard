'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Typography, Card, CardContent } from '@mui/material';

export default function SecurityPage() {
  return (
    <DashboardLayout>
      <Card>
        <CardContent>
          <Typography variant="h3">Security & Audit Logs</Typography>
          <Typography variant="body1" mt={2}>Security page coming soon...</Typography>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
