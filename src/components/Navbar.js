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
      <Toolbar sx={{ 
        minHeight: { xs: '8vh', md: '6.67vh' }, 
        px: { xs: '2.08vw', md: '3.13vw' },
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 2, md: 0 }
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mr: { xs: 0, md: '2.08vw' },
          width: { xs: '100%', md: 'auto' },
          justifyContent: { xs: 'center', md: 'flex-start' }
        }}>
          <SchoolIcon sx={{ 
            mr: '0.52vw', 
            color: 'white', 
            fontSize: { xs: '6vw', md: '1.67vw' },
            filter: 'drop-shadow(0 0 0.42vw #7c3aed88)' 
          }} />
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '1.2rem', md: '1.7rem' },
              letterSpacing: '-0.052vw',
              background: 'linear-gradient(90deg, #7c3aed 0%, #2196f3 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0.104vw 0.83vw #7c3aed55',
              userSelect: 'none',
            }}
          >
            IT College
          </Typography>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          gap: { xs: 1, md: 2 }, 
          flexGrow: 1,
          width: { xs: '100%', md: 'auto' },
          justifyContent: { xs: 'center', md: 'flex-start' },
          flexWrap: { xs: 'wrap', md: 'nowrap' }
        }}>
          <Button
            component={RouterLink}
            to="/"
            sx={{
              color: '#fff',
              fontWeight: 700,
              fontSize: { xs: '0.9rem', md: '1.05rem' },
              borderRadius: '2rem',
              px: { xs: '2.08vw', md: '1.56vw' },
              py: { xs: '1.04vh', md: '0.52vh' },
              textTransform: 'none',
              transition: 'all 0.2s',
              width: { xs: '100%', md: 'auto' },
              '&:hover': {
                background: 'linear-gradient(90deg, #7c3aed 0%, #2196f3 100%)',
                color: '#fff',
                boxShadow: '0 0.104vw 0.83vw #7c3aed55',
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
              fontSize: { xs: '0.9rem', md: '1.05rem' },
              borderRadius: '2rem',
              px: { xs: '2.08vw', md: '1.56vw' },
              py: { xs: '1.04vh', md: '0.52vh' },
              textTransform: 'none',
              transition: 'all 0.2s',
              width: { xs: '100%', md: 'auto' },
              '&:hover': {
                background: 'linear-gradient(90deg, #2196f3 0%, #7c3aed 100%)',
                color: '#fff',
                boxShadow: '0 0.104vw 0.83vw #2196f355',
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
              fontSize: { xs: '0.9rem', md: '1.05rem' },
              borderRadius: '2rem',
              px: { xs: '2.08vw', md: '1.56vw' },
              py: { xs: '1.04vh', md: '0.52vh' },
              textTransform: 'none',
              transition: 'all 0.2s',
              width: { xs: '100%', md: 'auto' },
              '&:hover': {
                background: 'linear-gradient(90deg, #ff3c6e 0%, #7c3aed 100%)',
                color: '#fff',
                boxShadow: '0 0.104vw 0.83vw #ff3c6e55',
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