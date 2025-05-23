import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';

export const EmailVerification: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    if (!token) {
      setError('Invalid verification link');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error('Email verification failed');
      }

      setVerified(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Email verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  if (loading) {
    return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Verifying your email...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {error ? (
            <>
              <Typography component="h1" variant="h5" color="error" gutterBottom>
                Verification Failed
              </Typography>
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {error}
              </Alert>
              <Button
                variant="contained"
                color="primary"
                onClick={handleLogin}
                sx={{ mt: 2 }}
              >
                Return to Login
              </Button>
            </>
          ) : verified ? (
            <>
              <Typography component="h1" variant="h5" color="success.main" gutterBottom>
                Email Verified
              </Typography>
              <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
                Your email has been successfully verified. You can now log in to your account.
              </Alert>
              <Button
                variant="contained"
                color="primary"
                onClick={handleLogin}
                sx={{ mt: 2 }}
              >
                Proceed to Login
              </Button>
            </>
          ) : null}
        </Paper>
      </Box>
    </Container>
  );
}; 