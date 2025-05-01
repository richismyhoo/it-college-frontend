import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
  Button,
  Modal,
  IconButton,
  TextField,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const TOKEN_KEY = 'jwt_token';

// Функция для форматирования даты
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

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

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Получаем роль пользователя
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) return;

      try {
        const response = await fetch('http://77.239.97.190/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserRole(data.role);
        }
      } catch (err) {
        console.error('Error fetching user role:', err);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setError('Необходима авторизация');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://77.239.97.190/api/courses', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Ошибка при загрузке курсов');
        }

        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const response = await fetch('http://77.239.97.190/api/courses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Обновляем список курсов после успешного создания
        const newCourse = await response.json();
        setCourses(prev => [...prev, newCourse]);
        setSnackbar({ open: true, message: 'Курс успешно создан!', severity: 'success' });
        handleCloseModal();
        // Очищаем форму
        setFormData({ title: '', description: '', category: '' });
      } else {
        throw new Error('Ошибка при создании курса');
      }
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ title: '', description: '', category: '' });
  };

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsSearching(true);
    
    if (query.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const filteredCourses = courses.filter(course => 
      course.title.toLowerCase().includes(query.toLowerCase()) ||
      course.category.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(filteredCourses);
    setIsSearching(false);
  };

  const handleSearchItemClick = (courseId) => {
    setSearchQuery('');
    setSearchResults([]);
    navigate(`/courses/${courseId}`);
  };

  return (
    <Box sx={{ minHeight: '100vh', width: '100%', position: 'relative', pb: 8 }}>
      <Box sx={backgroundStyle}>
        <Box sx={gradient1} />
        <Box sx={gradient2} />
        <Box sx={gradient3} />
      </Box>

      <Container 
        maxWidth="xl" 
        sx={{ 
          position: 'relative', 
          zIndex: 1, 
          pt: 8,
          px: { xs: 2, sm: 4, md: 6, lg: 8 },
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          mb: 6,
          position: 'relative',
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 2,
            justifyContent: 'center',
            width: '100%'
          }}>
            <Typography 
              variant="h2" 
              sx={{ 
                color: '#fff',
                fontWeight: 800,
                textShadow: '0 0 40px #7c3aed55',
              }}
            >
              Доступные курсы
            </Typography>
            <Tooltip 
              title="Здесь вы можете найти курсы для самообучения"
              arrow
              placement="right"
            >
              <IconButton sx={{ color: 'rgba(255,255,255,0.6)' }}>
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ 
            width: '100%',
            maxWidth: '600px',
            position: 'relative'
          }}>
            <TextField
              fullWidth
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Поиск курсов по названию или категории..."
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  backgroundColor: 'rgba(124,58,237,0.1)',
                  borderRadius: '12px',
                  '& fieldset': {
                    borderColor: 'rgba(124,58,237,0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(124,58,237,0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#7c3aed',
                  },
                },
                '& .MuiInputBase-input': {
                  padding: '16px',
                  fontSize: '1.1rem',
                  '&::placeholder': {
                    color: 'rgba(255,255,255,0.5)',
                    opacity: 1,
                  },
                },
              }}
            />
            {searchResults.length > 0 && searchQuery && (
              <Card sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                mt: 1,
                backgroundColor: 'rgba(20,20,30,0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(124,58,237,0.3)',
                borderRadius: '12px',
                zIndex: 1000,
                maxHeight: '400px',
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'rgba(255,255,255,0.05)',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(124,58,237,0.3)',
                  borderRadius: '4px',
                  '&:hover': {
                    background: 'rgba(124,58,237,0.5)',
                  },
                },
              }}>
                {searchResults.map((course) => (
                  <Box
                    key={course.id}
                    onClick={() => handleSearchItemClick(course.id)}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(124,58,237,0.1)',
                      },
                      borderBottom: '1px solid rgba(124,58,237,0.1)',
                      '&:last-child': {
                        borderBottom: 'none',
                      },
                    }}
                  >
                    <Typography sx={{ color: '#fff', fontWeight: 600, mb: 0.5 }}>
                      {course.title}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                      Категория: {course.category}
                    </Typography>
                  </Box>
                ))}
              </Card>
            )}
          </Box>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 6,
          position: 'relative',
        }}>
          <Box sx={{ 
            position: 'absolute',
            right: 0,
          }}>
            {userRole === 1 && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsModalOpen(true)}
                sx={{
                  background: 'linear-gradient(90deg, #7c3aed, #2196f3)',
                  color: '#fff',
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  fontSize: '1.1rem',
                  borderRadius: '12px',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #2196f3, #7c3aed)',
                    boxShadow: '0 8px 24px rgba(124, 58, 237, 0.3)',
                  },
                }}
              >
                Создать курс
              </Button>
            )}
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress sx={{ color: '#7c3aed' }} size={60} />
          </Box>
        ) : error ? (
          <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
            <Alert severity="error" sx={{ width: '100%' }} variant="filled">
              {error}
            </Alert>
          </Snackbar>
        ) : (
          <Grid container spacing={3} alignContent="center" flexDirection="column" sx={{ maxWidth: '80%' }}>
            {courses.map((course) => (
              <Grid item xs={12} key={course.id}>
                <Card 
                  id={`course-${course.id}`}
                  onClick={() => handleCourseClick(course.id)}
                  sx={{
                    width: '160%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'rgba(20,20,30,0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1.5px solid #7c3aed55',
                    borderRadius: 4,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px #7c3aed33',
                      borderColor: '#7c3aed',
                    },
                  }}
                >
                  <CardContent sx={{ 
                    flexGrow: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 2,
                    py: 4,
                    px: { xs: 3, sm: 4, md: 5 },
                  }}>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        color: '#fff',
                        fontWeight: 700,
                        mb: 1,
                        background: 'linear-gradient(90deg, #fff, #7c3aed)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {course.title}
                    </Typography>
                    
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'rgba(255,255,255,0.8)',
                        flexGrow: 1,
                        fontSize: '1.1rem',
                        mb: 2,
                      }}
                    >
                      {course.description}
                    </Typography>

                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      mt: 'auto'
                    }}>
                      <Chip 
                        label={course.category}
                        sx={{
                          background: 'linear-gradient(90deg, #7c3aed, #2196f3)',
                          color: '#fff',
                          fontWeight: 600,
                          fontSize: '1rem',
                          py: 0.5,
                          px: 1,
                        }}
                      />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'rgba(255,255,255,0.6)',
                          fontSize: '1rem',
                        }}
                      >
                        Создан: {formatDate(course.createdAt)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Modal
          open={isModalOpen}
          onClose={handleCloseModal}
          aria-labelledby="modal-create-course"
          aria-describedby="modal-create-course-form"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: '80%', md: '60%', lg: '50%' },
            maxWidth: '600px',
            bgcolor: 'rgba(20,20,30,0.95)',
            border: '2px solid #7c3aed55',
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(124, 58, 237, 0.2)',
            p: 4,
            color: '#fff',
            backdropFilter: 'blur(10px)',
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Создание курса
              </Typography>
              <IconButton 
                onClick={handleCloseModal}
                sx={{ 
                  color: '#fff',
                  '&:hover': { color: '#7c3aed' }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <form onSubmit={handleCreateCourse}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  required
                  name="title"
                  label="Название курса"
                  value={formData.title}
                  onChange={handleInputChange}
                  fullWidth
                  variant="filled"
                  sx={{
                    '& .MuiFilledInput-root': {
                      background: 'rgba(255,255,255,0.05)',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.08)',
                      },
                      '&.Mui-focused': {
                        background: 'rgba(255,255,255,0.08)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255,255,255,0.7)',
                    },
                    '& .MuiInputBase-input': {
                      color: '#fff',
                    },
                  }}
                />

                <TextField
                  required
                  name="description"
                  label="Описание"
                  value={formData.description}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  fullWidth
                  variant="filled"
                  sx={{
                    '& .MuiFilledInput-root': {
                      background: 'rgba(255,255,255,0.05)',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.08)',
                      },
                      '&.Mui-focused': {
                        background: 'rgba(255,255,255,0.08)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255,255,255,0.7)',
                    },
                    '& .MuiInputBase-input': {
                      color: '#fff',
                    },
                  }}
                />

                <TextField
                  required
                  name="category"
                  label="Категория"
                  value={formData.category}
                  onChange={handleInputChange}
                  fullWidth
                  variant="filled"
                  sx={{
                    '& .MuiFilledInput-root': {
                      background: 'rgba(255,255,255,0.05)',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.08)',
                      },
                      '&.Mui-focused': {
                        background: 'rgba(255,255,255,0.08)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255,255,255,0.7)',
                    },
                    '& .MuiInputBase-input': {
                      color: '#fff',
                    },
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    background: 'linear-gradient(90deg, #7c3aed, #2196f3)',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #2196f3, #7c3aed)',
                    },
                  }}
                >
                  {isSubmitting ? 'Создание...' : 'Создать курс'}
                </Button>
              </Box>
            </form>
          </Box>
        </Modal>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default Courses; 