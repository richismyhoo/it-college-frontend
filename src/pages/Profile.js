import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, Paper, Snackbar, Alert, Chip, Stack, CircularProgress, Tooltip } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
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
  width: '36.46vw',
  height: '64.81vh',
  left: '-10.42vw',
  top: '-18.52vh',
  background: 'radial-gradient(circle at 30% 30%, #7c3aed 0%, transparent 70%)',
  filter: 'blur(3.13vw)',
  opacity: 0.7,
};
const gradient2 = {
  position: 'absolute',
  width: '31.25vw',
  height: '55.56vh',
  right: '-7.81vw',
  top: '18.52vh',
  background: 'radial-gradient(circle at 70% 30%, #2196f3 0%, transparent 70%)',
  filter: 'blur(4.17vw)',
  opacity: 0.6,
};
const gradient3 = {
  position: 'absolute',
  width: '26.04vw',
  height: '46.30vh',
  left: '50%',
  bottom: '-18.52vh',
  background: 'radial-gradient(circle at 50% 80%, #ff3c6e 0%, transparent 70%)',
  filter: 'blur(5.21vw)',
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
  const [isEditing, setIsEditing] = useState(false);
  const [newBio, setNewBio] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newSkills, setNewSkills] = useState([]);
  const [profileId, setProfileId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [roleChangeLoading, setRoleChangeLoading] = useState(false);

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
          if (data && data.profile) {
            setProfile({
              username: data.profile.username || 'Пользователь',
              bio: data.profile.bio || '',
              skills: Array.isArray(data.profile.skills) ? data.profile.skills : [],
            });
            setProfileId(data.profile.id);
            setUserId(data.profile.userId);
            setUserRole(data.role);
            
            if (!data.profile.bio && (!data.profile.skills || data.profile.skills.length === 0)) {
              setIsEditing(true);
              setNewBio('');
              setNewSkills([]);
            } else {
              setNewBio(data.profile.bio || '');
              setNewSkills(Array.isArray(data.profile.skills) ? [...data.profile.skills] : []);
            }
          } else {
            setProfile({
              username: 'Пользователь',
              bio: '',
              skills: [],
            });
            setIsEditing(true);
          }
        })
        .catch((error) => {
          console.error('Error fetching profile:', error);
          setProfile({
            username: 'Пользователь',
            bio: '',
            skills: [],
          });
          setIsEditing(true);
        })
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

  // Создание профиля
  const handleCreateProfile = async () => {
    if (!newBio.trim()) {
      setSnackbar({ open: true, message: 'Пожалуйста, заполните поле "О себе"', severity: 'error' });
      return;
    }

    setProfileLoading(true);
    try {
      const response = await fetch('http://77.239.97.190/api/profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bio: newBio,
          skills: newSkills,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile({
          username: data.username,
          bio: data.bio,
          skills: data.skills,
        });
        setIsEditing(false);
        setSnackbar({ open: true, message: 'Профиль успешно создан!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Ошибка при создании профиля', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Ошибка соединения с сервером', severity: 'error' });
    } finally {
      setProfileLoading(false);
    }
  };

  // Обновление профиля
  const handleUpdateProfile = async () => {
    if (!newBio.trim()) {
      setSnackbar({ open: true, message: 'Пожалуйста, заполните поле "О себе"', severity: 'error' });
      return;
    }

    setProfileLoading(true);
    try {
      const response = await fetch('http://77.239.97.190/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: profile.username,
          bio: newBio,
          skills: newSkills,
          id: profileId,
          userId: userId
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile({
          ...profile,
          bio: data.bio,
          skills: data.skills,
        });
        setIsEditing(false);
        setSnackbar({ open: true, message: 'Профиль успешно обновлен!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Ошибка при обновлении профиля', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Ошибка соединения с сервером', severity: 'error' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !newSkills.includes(newSkill.trim())) {
      setNewSkills([...newSkills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setNewSkills(newSkills.filter(skill => skill !== skillToRemove));
  };

  const handleRoleChange = async () => {
    setRoleChangeLoading(true);
    try {
      const endpoint = userRole === 0 
        ? 'http://77.239.97.190/api/user/become/teacher'
        : 'http://77.239.97.190/api/user/become/student';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setUserRole(userRole === 0 ? 1 : 0);
        setSnackbar({ 
          open: true, 
          message: `Вы успешно стали ${userRole === 0 ? 'преподавателем' : 'студентом'}!`, 
          severity: 'success' 
        });
      } else {
        setSnackbar({ 
          open: true, 
          message: 'Ошибка при смене роли', 
          severity: 'error' 
        });
      }
    } catch (err) {
      setSnackbar({ 
        open: true, 
        message: 'Ошибка соединения с сервером', 
        severity: 'error' 
      });
    } finally {
      setRoleChangeLoading(false);
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
          <Paper elevation={6} sx={{ p: '2.60vw', borderRadius: '0.21vw', minWidth: '17.71vw', maxWidth: '19.79vw', background: 'rgba(20,20,30,0.95)', boxShadow: '0 0.21vw 1.67vw #7c3aed33', border: '0.078vw solid #7c3aed55' }}>
            <Typography variant="h5" align="center" sx={{ mb: '1.04vh', color: '#fff', fontWeight: 800, textShadow: '0 0.104vw 0.83vw #7c3aed55' }}>
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

  // Основной профиль
  if (profile && !isEditing) {
    return (
      <Box sx={{ minHeight: '100vh', width: '100%', position: 'relative', background: 'none' }}>
        <Box sx={backgroundStyle}>
          <Box sx={gradient1} />
          <Box sx={gradient2} />
          <Box sx={gradient3} />
        </Box>
        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{
            mt: '4.17vh',
            mb: '4.17vh',
            p: '2.08vw',
            borderRadius: '0.21vw',
            background: 'rgba(20,20,30,0.95)',
            boxShadow: '0 0.21vw 1.67vw #7c3aed33',
            border: '0.078vw solid #7c3aed55',
            color: '#fff',
            textAlign: 'center',
          }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#fff', textShadow: '0 0.104vw 0.83vw #7c3aed55' }}>
              {profile.username}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                setIsEditing(true);
                setNewBio(profile.bio);
                setNewSkills([...profile.skills]);
              }}
              sx={{
                mb: 3,
                color: '#7c3aed',
                borderColor: '#7c3aed',
                '&:hover': {
                  borderColor: '#2196f3',
                  color: '#2196f3',
                  background: 'rgba(33,150,243,0.1)',
                },
              }}
            >
              Редактировать профиль
            </Button>
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
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ color: '#7c3aed', mb: 2, fontWeight: 600, textAlign: 'center' }}>
                Роль: {userRole === 0 ? 'Студент' : 'Преподаватель'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={handleRoleChange}
                  disabled={roleChangeLoading}
                  sx={{
                    color: '#2196f3',
                    borderColor: '#2196f3',
                    '&:hover': {
                      borderColor: '#7c3aed',
                      color: '#7c3aed',
                      background: 'rgba(124,58,237,0.1)',
                    },
                  }}
                >
                  {roleChangeLoading ? 'Загрузка...' : (userRole === 0 ? 'Стать преподавателем' : 'Стать студентом')}
                </Button>
                <Tooltip 
                  title={userRole === 0 
                    ? "Возможность создавать и вести курсы на сайте" 
                    : "Стандартная роль для обычного прохождения курсов на сайте"
                  }
                  arrow
                  placement="right"
                >
                  <HelpOutlineIcon 
                    sx={{ 
                      color: '#7c3aed', 
                      cursor: 'help',
                      '&:hover': {
                        color: '#2196f3'
                      }
                    }} 
                  />
                </Tooltip>
              </Box>
            </Box>
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

  // Форма редактирования/создания профиля
  return (
    <Box sx={{ minHeight: '100vh', width: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none' }}>
      <Box sx={backgroundStyle}>
        <Box sx={gradient1} />
        <Box sx={gradient2} />
        <Box sx={gradient3} />
      </Box>
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{
          mt: '4.17vh',
          mb: '4.17vh',
          p: '2.08vw',
          borderRadius: '0.21vw',
          background: 'rgba(20,20,30,0.95)',
          boxShadow: '0 0.21vw 1.67vw #7c3aed33',
          border: '0.078vw solid #7c3aed55',
          color: '#fff',
        }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, color: '#fff', textShadow: '0 0.104vw 0.83vw #7c3aed55', textAlign: 'center' }}>
            {profileId ? 'Редактирование профиля' : 'Создание профиля'}
          </Typography>
          <TextField
            label="О себе"
            multiline
            rows={4}
            fullWidth
            value={newBio}
            onChange={(e) => setNewBio(e.target.value)}
            sx={{ 
              mb: 3, 
              input: { color: '#fff' },
              textarea: { color: '#fff' },
              label: { color: '#aaa' }, 
              background: 'rgba(33,33,55,0.7)', 
              borderRadius: 2,
              '& .MuiInputBase-root': {
                color: '#fff'
              }
            }}
            InputLabelProps={{ style: { color: '#aaa' } }}
          />
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ color: '#2196f3', mb: 1, fontWeight: 600 }}>
              Скиллы
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                label="Добавить скилл"
                fullWidth
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newSkill.trim()) {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                sx={{ 
                  input: { color: '#fff' },
                  textarea: { color: '#fff' },
                  label: { color: '#aaa' }, 
                  background: 'rgba(33,33,55,0.7)', 
                  borderRadius: 2,
                  '& .MuiInputBase-root': {
                    color: '#fff'
                  }
                }}
                InputLabelProps={{ style: { color: '#aaa' } }}
              />
              <Button
                variant="contained"
                onClick={handleAddSkill}
                sx={{
                  px: 3,
                  background: 'linear-gradient(90deg, #7c3aed 0%, #2196f3 100%)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #2196f3 0%, #7c3aed 100%)',
                  },
                }}
              >
                Добавить
              </Button>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {newSkills.map((skill, idx) => (
                <Chip
                  key={idx}
                  label={skill}
                  onDelete={() => handleRemoveSkill(skill)}
                  sx={{
                    bgcolor: '#232336',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '1rem',
                    border: '1.5px solid #7c3aed55',
                    boxShadow: '0 2px 12px #7c3aed22',
                    mb: 1,
                    '& .MuiChip-deleteIcon': {
                      color: '#ff3c6e',
                      '&:hover': {
                        color: '#ff3c6e',
                      },
                    },
                  }}
                />
              ))}
            </Stack>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {profileId && (
              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  setIsEditing(false);
                  setNewBio(profile.bio);
                  setNewSkills([...profile.skills]);
                }}
                sx={{
                  py: 1.2,
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  borderRadius: '2rem',
                  color: '#fff',
                  borderColor: '#fff',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#ff3c6e',
                    color: '#ff3c6e',
                  },
                }}
              >
                Отмена
              </Button>
            )}
            <Button
              variant="contained"
              fullWidth
              onClick={profileId ? handleUpdateProfile : handleCreateProfile}
              disabled={profileLoading}
              sx={{
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
              {profileLoading ? 'Сохранение...' : (profileId ? 'Сохранить' : 'Создать профиль')}
            </Button>
          </Box>
        </Box>
      </Container>
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

export default Profile; 