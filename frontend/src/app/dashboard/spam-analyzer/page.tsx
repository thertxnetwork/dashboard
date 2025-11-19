'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Breadcrumbs from '@/components/Breadcrumbs';
import {
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  Chip,
  Grid,
  Divider,
  LinearProgress,
} from '@mui/material';
import { Shield, AlertTriangle } from 'lucide-react';
import apiClient from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';

interface SpamAnalysisResult {
  status: string;
  detected_language: string;
  translated_text: string;
  indicators_found: {
    free: number;
    limited: number;
    registered: number;
    frozen: number;
  };
  template_similarities: {
    free: number;
    limited: number;
    registered: number;
    frozen: number;
  };
  sentiment_polarity: number;
  message_length: number;
  confidence: string;
}

export default function SpamAnalyzerPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SpamAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const handleAnalyze = async () => {
    if (!message.trim()) {
      toast.showError('Please enter a message to analyze');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const response = await apiClient.post('/phone/analyze-spam/', { message });
      setResult(response.data);
      toast.showSuccess('Analysis completed');
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to analyze message';
      setError(errorMsg);
      toast.showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'free': return 'success';
      case 'limited': return 'warning';
      case 'registered': return 'info';
      case 'frozen': return 'error';
      default: return 'default';
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'success';
      case 'medium': return 'warning';
      case 'low': return 'error';
      default: return 'default';
    }
  };

  return (
    <DashboardLayout>
      <Breadcrumbs items={[{ label: 'Phone Registry' }, { label: 'Spam Analyzer' }]} />
      
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Shield size={24} />
            <Typography variant="h4" fontWeight={600}>Spam & Account Status Analyzer</Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" mb={3}>
            Analyze account status messages using multilingual NLP detection with FastText.
            Detects: free, limited, registered, and frozen account statuses.
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={6}
            label="Message to Analyze"
            placeholder="Your account was blocked for violations of the Telegram Terms of Service..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setError(null);
              setResult(null);
            }}
            disabled={loading}
            sx={{ mb: 3 }}
          />

          <Button
            variant="contained"
            onClick={handleAnalyze}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Shield size={20} />}
            fullWidth
          >
            {loading ? 'Analyzing...' : 'Analyze Message'}
          </Button>

          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}

          {result && (
            <Card variant="outlined" sx={{ mt: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Typography variant="h6" fontWeight={600}>Analysis Result</Typography>
                  <Chip 
                    label={result.status.toUpperCase()} 
                    color={getStatusColor(result.status) as any}
                  />
                  <Chip 
                    label={`${result.confidence} confidence`}
                    color={getConfidenceColor(result.confidence) as any}
                    size="small"
                  />
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Detected Language
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {result.detected_language.toUpperCase()}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Message Length
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {result.message_length} words
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Sentiment Polarity
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.abs(result.sentiment_polarity) * 100}
                        color={result.sentiment_polarity >= 0 ? 'success' : 'error'}
                        sx={{ flex: 1, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="body2" fontWeight={600}>
                        {result.sentiment_polarity.toFixed(2)}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Translated Text
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      bgcolor: 'action.hover', 
                      p: 2, 
                      borderRadius: 1,
                      fontStyle: 'italic'
                    }}>
                      {result.translated_text}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Indicators Found
                    </Typography>
                    <Grid container spacing={2}>
                      {Object.entries(result.indicators_found).map(([key, value]) => (
                        <Grid item xs={6} sm={3} key={key}>
                          <Card variant="outlined">
                            <CardContent sx={{ textAlign: 'center' }}>
                              <Typography variant="caption" color="text.secondary">
                                {key.toUpperCase()}
                              </Typography>
                              <Typography variant="h5" fontWeight={600}>
                                {value}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Template Similarities
                    </Typography>
                    <Grid container spacing={2}>
                      {Object.entries(result.template_similarities).map(([key, value]) => (
                        <Grid item xs={6} sm={3} key={key}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              {key.toUpperCase()}
                            </Typography>
                            <LinearProgress 
                              variant="determinate" 
                              value={value * 100}
                              sx={{ height: 8, borderRadius: 4, mt: 0.5 }}
                            />
                            <Typography variant="caption" fontWeight={600}>
                              {(value * 100).toFixed(1)}%
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
