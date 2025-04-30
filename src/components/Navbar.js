import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuBookIcon from '@mui/icons-material/MenuBook';

function Navbar() {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: 'rgba(10,6,24,0.95)',
        boxShadow: '0 2px 24px #7c3aed33',
        borderBottom: '1.5px solid #7c3aed55',
        backdropFilter: 'blur(8px)',
        zIndex: 10,
      }}
    >
      <Toolbar sx={{ minHeight: 72, px: { xs: 2, md: 6 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
          <SchoolIcon sx={{ mr: 1, color: 'white', fontSize: 32, filter: 'drop-shadow(0 0 8px #7c3aed88)' }} />
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '1.2rem', md: '1.7rem' },
              letterSpacing: '-1px',
              background: 'linear-gradient(90deg, #7c3aed 0%, #2196f3 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 16px #7c3aed55',
              userSelect: 'none',
            }}
          >
            IT College
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexGrow: 1 }}>
          <Button
            component={RouterLink}
            to="/"
            sx={{
              color: '#fff',
              fontWeight: 700,
              fontSize: '1.05rem',
              borderRadius: '2rem',
              px: 3,
              py: 1,
              textTransform: 'none',
              transition: 'all 0.2s',
              '&:hover': {
                background: 'linear-gradient(90deg, #7c3aed 0%, #2196f3 100%)',
                color: '#fff',
                boxShadow: '0 2px 16px #7c3aed55',
              },
            }}
            startIcon={<MenuBookIcon />}
          >
            Главная
          </Button>
          <Button
            component={RouterLink}
            to="/courses"
            sx={{
              color: '#fff',
              fontWeight: 700,
              fontSize: '1.05rem',
              borderRadius: '2rem',
              px: 3,
              py: 1,
              textTransform: 'none',
              transition: 'all 0.2s',
              '&:hover': {
                background: 'linear-gradient(90deg, #2196f3 0%, #7c3aed 100%)',
                color: '#fff',
                boxShadow: '0 2px 16px #2196f355',
              },
            }}
            startIcon={<MenuBookIcon />}
          >
            Курсы
          </Button>
          <Button
            component={RouterLink}
            to="/profile"
            sx={{
              color: '#fff',
              fontWeight: 700,
              fontSize: '1.05rem',
              borderRadius: '2rem',
              px: 3,
              py: 1,
              textTransform: 'none',
              transition: 'all 0.2s',
              '&:hover': {
                background: 'linear-gradient(90deg, #ff3c6e 0%, #7c3aed 100%)',
                color: '#fff',
                boxShadow: '0 2px 16px #ff3c6e55',
              },
            }}
            startIcon={<AccountCircleIcon />}
          >
            Личный кабинет
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 