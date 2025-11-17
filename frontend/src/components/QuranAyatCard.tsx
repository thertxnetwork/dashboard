'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Fade } from '@mui/material';
import { BookOpen } from 'lucide-react';
import { QuranAyat, getRandomAyat } from '@/lib/quranData';

interface QuranAyatCardProps {
  autoChangeInterval?: number; // in milliseconds, default 30 seconds
}

export default function QuranAyatCard({ autoChangeInterval = 30000 }: QuranAyatCardProps) {
  const [currentAyat, setCurrentAyat] = useState<QuranAyat | null>(null);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    // Load initial ayat
    setCurrentAyat(getRandomAyat());
  }, []);

  useEffect(() => {
    // Auto-rotate ayat
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentAyat(getRandomAyat());
        setFadeIn(true);
      }, 500); // Wait for fade out before changing
    }, autoChangeInterval);

    return () => clearInterval(interval);
  }, [autoChangeInterval]);

  if (!currentAyat) return null;

  return (
    <Card
      sx={{
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
            : 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? '#1e293b' : '#bbf7d0'}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <BookOpen size={20} color="#16a34a" />
          <Typography variant="h5" color="#16a34a" fontWeight={600}>
            Ayat of the Moment
          </Typography>
        </Box>

        <Fade in={fadeIn} timeout={500}>
          <Box>
            {/* Arabic Text */}
            <Typography
              variant="h4"
              sx={{
                fontFamily: 'Arial, sans-serif',
                textAlign: 'center',
                mb: 3,
                fontSize: { xs: '1.5rem', sm: '2rem' },
                lineHeight: 1.8,
                color: (theme) => theme.palette.text.primary,
              }}
              dir="rtl"
            >
              {currentAyat.arabic}
            </Typography>

            {/* English Translation */}
            <Box mb={2}>
              <Typography
                variant="caption"
                fontWeight={600}
                color="text.secondary"
                sx={{ textTransform: 'uppercase', letterSpacing: 1 }}
              >
                English
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontStyle: 'italic',
                  mt: 0.5,
                  lineHeight: 1.7,
                  fontSize: '0.9375rem',
                }}
              >
                "{currentAyat.english}"
              </Typography>
            </Box>

            {/* Bengali Translation */}
            <Box mb={2}>
              <Typography
                variant="caption"
                fontWeight={600}
                color="text.secondary"
                sx={{ textTransform: 'uppercase', letterSpacing: 1 }}
              >
                বাংলা (Bengali)
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontStyle: 'italic',
                  mt: 0.5,
                  lineHeight: 1.7,
                  fontSize: '0.9375rem',
                }}
              >
                "{currentAyat.bengali}"
              </Typography>
            </Box>

            {/* Reference */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                pt: 2,
                borderTop: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                color="primary"
                sx={{ fontSize: '0.8125rem' }}
              >
                {currentAyat.reference}
              </Typography>
            </Box>
          </Box>
        </Fade>
      </CardContent>
    </Card>
  );
}
