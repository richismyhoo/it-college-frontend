import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, Paper, Snackbar, Alert, Chip, Stack, CircularProgress } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const backgroundStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  height: '100vh',
  zIndex: 0,
  background: '#0a0618',
  overflow: 'hidden',
};

const gradient1 = {
  position: 'absolute',
  width: '700px',
  height: '700px',
  left: '-200px',
  top: '-200px',
  background: 'radial-gradient(circle at 30% 30%, #7c3aed 0%, transparent 70%)',
  filter: 'blur(60px)',
  opacity: 0.7,
};
const gradient2 = {
  position: 'absolute',
  width: '600px',
  height: '600px',
  right: '-150px',
  top: '200px',
  background: 'radial-gradient(circle at 70% 30%, #2196f3 0%, transparent 70%)',
  filter: 'blur(80px)',
  opacity: 0.6,
};
const gradient3 = {
  position: 'absolute',
  width: '500px',
  height: '500px',
  left: '50%',
  bottom: '-200px',
  background: 'radial-gradient(circle at 50% 80%, #ff3c6e 0%, transparent 70%)',
  filter: 'blur(100px)',
  opacity: 0.4,
  transform: 'translateX(-50%)',
};

const TOKEN_KEY = 'jwt_token';
const LIVE_UNTIL_KEY = 'jwt_live_until';
const DAY_MS = 24 * 60 * 60 * 1000;

function isTokenValid() {
  const token = localStorage.getItem(TOKEN_KEY);
  const liveUntil = localStorage.getItem(LIVE_UNTIL_KEY);
  if (!token || !liveUntil) return false;
  return Date.now() < Number(liveUntil);
}

function Profile() {
  const [token, setToken] = useState(() => (isTokenValid() ? localStorage.getItem(TOKEN_KEY) : null));
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Проверка срока действия токена при монтировании
  useEffect(() => {
    const liveUntil = localStorage.getItem(LIVE_UNTIL_KEY);
    if (liveUntil && Date.now() >= Number(liveUntil)) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(LIVE_UNTIL_KEY);
      setToken(null);
    }
  }, []);

  // Получение профиля
  useEffect(() => {
    if (token) {
      setProfileLoading(true);
      fetch('http://77.239.97.190/api/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then(data => {
          setProfile({
            username: data.username,
            bio: data.bio,
            skills: Array.isArray(data.skills) ? data.skills : [],
          });
        })
        .catch(() => setProfile(null))
        .finally(() => setProfileLoading(false));
    }
  }, [token]);

  // Логин через API
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('http://77.239.97.190/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: login, password }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(LIVE_UNTIL_KEY, String(Date.now() + DAY_MS));
        setToken(data.token);
        window.location.reload();
      } else if (response.status === 401) {
        setSnackbar({ open: true, message: 'Неверный логин или пароль', severity: 'error' });
      } else if (response.status === 500) {
        setSnackbar({ open: true, message: 'Ошибка на сервере', severity: 'error' });
      } else {
        setSnackbar({ open: true, message: data.message || 'Ошибка соединения с сервером', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Ошибка соединения с сервером', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Box sx={{ minHeight: '100vh', width: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none' }}>
        <Box sx={backgroundStyle}>
          <Box sx={gradient1} />
          <Box sx={gradient2} />
          <Box sx={gradient3} />
        </Box>
        <Box sx={{ position: 'relative', zIndex: 2, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Paper elevation={6} sx={{ p: 5, borderRadius: 4, minWidth: 340, maxWidth: 380, background: 'rgba(20,20,30,0.95)', boxShadow: '0 4px 32px #7c3aed33', border: '1.5px solid #7c3aed55' }}>
            <Typography variant="h5" align="center" sx={{ mb: 2, color: '#fff', fontWeight: 800, textShadow: '0 2px 16px #7c3aed55' }}>
              Вход в личный кабинет
            </Typography>
            <form onSubmit={handleLogin}>
              <TextField
                label="Логин"
                variant="filled"
                fullWidth
                value={login}
                onChange={e => setLogin(e.target.value)}
                sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#aaa' }, background: 'rgba(33,33,55,0.7)', borderRadius: 2 }}
                InputLabelProps={{ style: { color: '#aaa' } }}
                autoComplete="username"
              />
              <TextField
                label="Пароль"
                type="password"
                variant="filled"
                fullWidth
                value={password}
                onChange={e => setPassword(e.target.value)}
                sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#aaa' }, background: 'rgba(33,33,55,0.7)', borderRadius: 2 }}
                InputLabelProps={{ style: { color: '#aaa' } }}
                autoComplete="current-password"
              />
              {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 1,
                  py: 1.2,
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  borderRadius: '2rem',
                  background: 'linear-gradient(90deg, #7c3aed 0%, #2196f3 100%)',
                  boxShadow: '0 2px 24px #7c3aed55',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #2196f3 0%, #7c3aed 100%)',
                    boxShadow: '0 4px 32px #2196f355',
                  },
                }}
              >
                {loading ? 'Вход...' : 'Войти'}
              </Button>
            </form>
            <Typography align="center" sx={{ mt: 2, color: '#fff', fontWeight: 500 }}>
              Нет аккаунта?
              <Box component={RouterLink} to="/register" sx={{ color: '#7c3aed', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', ml: 1.2, display: 'inline-block', '&:hover': { color: '#2196f3' } }}>
                Регистрация
              </Box>
            </Typography>
          </Paper>
        </Box>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    );
  }

  // Если профиль загружается
  if (profileLoading) {
    return (
      <Box sx={{ minHeight: '100vh', width: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none' }}>
        <Box sx={backgroundStyle}>
          <Box sx={gradient1} />
          <Box sx={gradient2} />
          <Box sx={gradient3} />
        </Box>
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <CircularProgress color="secondary" size={60} />
        </Box>
      </Box>
    );
  }

  // Если профиль не получен
  if (!profile) {
    return (
      <Box sx={{ minHeight: '100vh', width: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none' }}>
        <Box sx={backgroundStyle}>
          <Box sx={gradient1} />
          <Box sx={gradient2} />
          <Box sx={gradient3} />
        </Box>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom color="#fff">
              Личный кабинет
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Не удалось загрузить профиль пользователя
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  // Основной профиль
  return (
    <Box sx={{ minHeight: '100vh', width: '100%', position: 'relative', background: 'none' }}>
      <Box sx={backgroundStyle}>
        <Box sx={gradient1} />
        <Box sx={gradient2} />
        <Box sx={gradient3} />
      </Box>
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{
          mt: 8,
          mb: 8,
          p: 4,
          borderRadius: 4,
          background: 'rgba(20,20,30,0.95)',
          boxShadow: '0 4px 32px #7c3aed33',
          border: '1.5px solid #7c3aed55',
          color: '#fff',
          textAlign: 'center',
        }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#fff', textShadow: '0 2px 16px #7c3aed55' }}>
            {profile.username}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#7c3aed', mb: 2, fontWeight: 600 }}>
            Био
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', mb: 3 }}>
            {profile.bio || '—'}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#2196f3', mb: 1, fontWeight: 600 }}>
            Скиллы
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" sx={{ mb: 2 }}>
            {profile.skills.length > 0 ? profile.skills.map((skill, idx) => (
              <Chip
                key={idx}
                label={skill}
                sx={{
                  bgcolor: '#232336',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '1rem',
                  border: '1.5px solid #7c3aed55',
                  boxShadow: '0 2px 12px #7c3aed22',
                  mb: 1,
                }}
              />
            )) : (
              <Typography variant="body2" color="text.secondary">Нет скиллов</Typography>
            )}
          </Stack>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              localStorage.removeItem('jwt_token');
              localStorage.removeItem('jwt_live_until');
              window.location.href = '/profile';
            }}
            sx={{
              mt: 3,
              py: 1.2,
              fontWeight: 700,
              fontSize: '1.1rem',
              borderRadius: '2rem',
              background: 'linear-gradient(90deg, #ff3c6e 0%, #7c3aed 100%)',
              boxShadow: '0 2px 24px #ff3c6e55',
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(90deg, #7c3aed 0%, #ff3c6e 100%)',
                boxShadow: '0 4px 32px #7c3aed55',
              },
            }}
          >
            Выйти
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default Profile; 