import { AppBar } from '@mui/material';
import type React from 'react';
import Navigation from '../Navigation/Navigation';

export const Header: React.FC = () => {
  return (
    <AppBar position="static" sx={{ padding: '2px 15px 2px 15px' }}>
      <Navigation />
    </AppBar>
  );
};
