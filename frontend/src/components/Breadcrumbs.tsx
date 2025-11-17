'use client';

import React from 'react';
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography, Box } from '@mui/material';
import { ChevronRight, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const router = useRouter();

  return (
    <Box sx={{ mb: 2 }}>
      <MuiBreadcrumbs 
        separator={<ChevronRight size={14} />}
        sx={{ 
          fontSize: '0.875rem',
          '& .MuiBreadcrumbs-separator': {
            mx: 0.5,
          },
        }}
      >
        <Link
          component="button"
          onClick={() => router.push('/dashboard')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            color: 'text.secondary',
            textDecoration: 'none',
            '&:hover': {
              color: 'primary.main',
              textDecoration: 'underline',
            },
          }}
        >
          <Home size={14} />
          Home
        </Link>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          if (isLast) {
            return (
              <Typography key={index} color="text.primary" fontSize="0.875rem" fontWeight={500}>
                {item.label}
              </Typography>
            );
          }
          
          return (
            <Link
              key={index}
              component="button"
              onClick={() => item.href && router.push(item.href)}
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline',
                },
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
}
