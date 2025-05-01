import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Chip,
  Alert,
  Snackbar,
  IconButton,
  Modal,
  TextField,
  Button,
  createTheme,
  ThemeProvider,
  Tooltip
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const TOKEN_KEY = 'jwt_token';

// Создаем темную тему для DateTimePicker
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7c3aed',
    },
    background: {
      paper: 'rgba(20,20,30,0.95)',
      default: 'rgba(20,20,30,0.95)',
    },
    text: {
      primary: '#fff',
      secondary: 'rgba(255,255,255,0.7)',
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiFilledInput-root': {
            backgroundColor: 'rgba(255,255,255,0.05)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.08)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255,255,255,0.08)',
            },
          },
        },
      },
    },
  },
});

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

function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [moduleFormData, setModuleFormData] = useState({
    title: '',
    description: '',
    dueDate: new Date(),
  });
  const [assignmentFormData, setAssignmentFormData] = useState({
    title: '',
    description: '',
    dueDate: new Date(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [selectedModule, setSelectedModule] = useState(null);
  const [isModuleDetailsOpen, setIsModuleDetailsOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isAssignmentDetailsOpen, setIsAssignmentDetailsOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isStudentProfileOpen, setIsStudentProfileOpen] = useState(false);
  const [studentProfile, setStudentProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

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
          console.log('User profile:', data); // Для отладки
          setIsTeacher(data.role === 1);
          setIsStudent(data.role === 0);
          setUserId(data.profile.id);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setError('Необходима авторизация');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://77.239.97.190/api/courses/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Ошибка при загрузке курса');
        }

        const data = await response.json();
        console.log('Course details:', data); // Для отладки
        setCourse(data);
        
        // Проверяем, является ли текущий пользователь автором курса
        console.log('Checking author:', { 
          teacherId: data.teacherId, 
          userId: userId, 
          isMatch: data.teacherId === userId 
        });
        setIsAuthor(data.teacherId === userId);

        // Проверяем, записан ли текущий пользователь на курс
        const isUserEnrolled = data.enrollments?.some(enrollment => enrollment.userId === userId);
        setIsEnrolled(isUserEnrolled);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id && userId) {
      fetchCourseDetails();
    }
  }, [id, userId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleModuleInputChange = (e) => {
    const { name, value } = e.target;
    setModuleFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (newDate) => {
    setModuleFormData(prev => ({
      ...prev,
      dueDate: newDate
    }));
  };

  const handleAssignmentInputChange = (e) => {
    const { name, value } = e.target;
    setAssignmentFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAssignmentDateChange = (newDate) => {
    setAssignmentFormData(prev => ({
      ...prev,
      dueDate: newDate
    }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleCreateModule = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const response = await fetch(`http://77.239.97.190/api/courses/${id}/modules`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: parseInt(id),
          title: moduleFormData.title,
          description: moduleFormData.description,
          dueDate: moduleFormData.dueDate.toISOString(),
        }),
      });

      if (response.ok) {
        const newModule = await response.json();
        // Обновляем список модулей в текущем курсе
        setCourse(prev => ({
          ...prev,
          modules: [...(prev.modules || []), newModule],
        }));
        setSnackbar({ 
          open: true, 
          message: 'Модуль успешно создан!', 
          severity: 'success' 
        });
        setIsModuleModalOpen(false);
        // Очищаем форму
        setModuleFormData({
          title: '',
          description: '',
          dueDate: new Date(),
        });
      } else {
        throw new Error('Ошибка при создании модуля');
      }
    } catch (err) {
      console.error('Error creating module:', err);
      setSnackbar({ 
        open: true, 
        message: err.message, 
        severity: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const response = await fetch(`http://77.239.97.190/api/courses/${id}/assignments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: parseInt(id),
          title: assignmentFormData.title,
          description: assignmentFormData.description,
          dueDate: assignmentFormData.dueDate.toISOString(),
        }),
      });

      if (response.ok) {
        const newAssignment = await response.json();
        // Обновляем список заданий в текущем курсе
        setCourse(prev => ({
          ...prev,
          assignments: [...(prev.assignments || []), newAssignment],
        }));
        setSnackbar({ 
          open: true, 
          message: 'Задание успешно создано!', 
          severity: 'success' 
        });
        setIsAssignmentModalOpen(false);
        // Очищаем форму
        setAssignmentFormData({
          title: '',
          description: '',
          dueDate: new Date(),
        });
      } else {
        throw new Error('Ошибка при создании задания');
      }
    } catch (err) {
      console.error('Error creating assignment:', err);
      setSnackbar({ 
        open: true, 
        message: err.message, 
        severity: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEnrollCourse = async () => {
    setIsEnrolling(true);
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const response = await fetch(`http://77.239.97.190/api/courses/${id}/enroll`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setSnackbar({ 
          open: true, 
          message: 'Вы успешно записались на курс!', 
          severity: 'success' 
        });
        // Обновляем данные курса после успешной записи
        const updatedCourseResponse = await fetch(`http://77.239.97.190/api/courses/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (updatedCourseResponse.ok) {
          const updatedCourse = await updatedCourseResponse.json();
          setCourse(updatedCourse);
        }
      } else {
        throw new Error('Ошибка при записи на курс');
      }
    } catch (err) {
      console.error('Error enrolling in course:', err);
      setSnackbar({ 
        open: true, 
        message: err.message, 
        severity: 'error' 
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleModuleClick = (module) => {
    setSelectedModule(module);
    setIsModuleDetailsOpen(true);
  };

  const handleAssignmentClick = (assignment) => {
    setSelectedAssignment(assignment);
    setIsAssignmentDetailsOpen(true);
  };

  const handleStudentClick = async (username) => {
    setIsLoadingProfile(true);
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const response = await fetch(`http://77.239.97.190/api/profile/${username}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStudentProfile(data);
        setSelectedStudent(username);
        setIsStudentProfileOpen(true);
      } else {
        throw new Error('Ошибка при загрузке профиля');
      }
    } catch (err) {
      console.error('Error fetching student profile:', err);
      setSnackbar({ 
        open: true, 
        message: 'Не удалось загрузить профиль студента', 
        severity: 'error' 
      });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'relative' 
      }}>
        <Box sx={backgroundStyle}>
          <Box sx={gradient1} />
          <Box sx={gradient2} />
          <Box sx={gradient3} />
        </Box>
        <CircularProgress sx={{ color: '#7c3aed' }} size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', position: 'relative' }}>
        <Box sx={backgroundStyle}>
          <Box sx={gradient1} />
          <Box sx={gradient2} />
          <Box sx={gradient3} />
        </Box>
        <Container>
          <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', pb: 8 }}>
      <Box sx={backgroundStyle}>
        <Box sx={gradient1} />
        <Box sx={gradient2} />
        <Box sx={gradient3} />
      </Box>

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, pt: { xs: 4, md: 8 } }}>
        {course && (
          <>
            {/* Основная информация о курсе */}
            <Box sx={{ mb: { xs: 3, md: 6 } }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', md: 'flex-start' },
                gap: { xs: 2, md: 0 },
                mb: { xs: 2, md: 3 } 
              }}>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    color: '#fff',
                    fontWeight: 800,
                    textShadow: '0 0 40px #7c3aed55',
                    fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' }
                  }}
                >
                  {course.title}
                </Typography>
                {!isEnrolled && (
                  <Button
                    variant="contained"
                    onClick={handleEnrollCourse}
                    disabled={isEnrolling}
                    sx={{
                      py: { xs: 1, md: 1.5 },
                      px: { xs: 2, md: 4 },
                      background: 'linear-gradient(90deg, #7c3aed, #2196f3)',
                      fontSize: { xs: '0.9rem', md: '1.1rem' },
                      fontWeight: 600,
                      textTransform: 'none',
                      width: { xs: '100%', md: 'auto' },
                      '&:hover': {
                        background: 'linear-gradient(90deg, #2196f3, #7c3aed)',
                      },
                      '&.Mui-disabled': {
                        background: 'rgba(124,58,237,0.3)',
                        color: 'rgba(255,255,255,0.5)',
                      }
                    }}
                  >
                    {isEnrolling ? 'Записываем...' : 'Записаться на курс'}
                  </Button>
                )}
              </Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'rgba(255,255,255,0.8)',
                  mb: { xs: 2, md: 3 },
                  fontSize: { xs: '1rem', md: '1.25rem' }
                }}
              >
                {course.description}
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 2 }, 
                alignItems: { xs: 'flex-start', sm: 'center' } 
              }}>
                <Chip 
                  label={course.category}
                  sx={{
                    background: 'linear-gradient(90deg, #7c3aed, #2196f3)',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: { xs: '0.9rem', md: '1rem' },
                  }}
                />
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: { xs: '0.9rem', md: '1rem' }
                  }}
                >
                  Создан: {formatDate(course.createdAt)}
                </Typography>
              </Box>
            </Box>

            {/* Модули курса */}
            <Box sx={{ mb: { xs: 3, md: 6 } }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' }, 
                gap: { xs: 1, sm: 2 }, 
                mb: { xs: 2, md: 4 } 
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: { xs: 1, sm: 2 },
                  width: { xs: '100%', sm: 'auto' }
                }}>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: { xs: '1.5rem', md: '2rem' }
                    }}
                  >
                    Модули
                  </Typography>
                  <Tooltip 
                    title="Учебные материалы для прочтения"
                    arrow
                    placement="right"
                    componentsProps={{
                      tooltip: {
                        sx: {
                          fontSize: { xs: '0.9rem', md: '1.1rem' },
                          padding: { xs: '8px 12px', md: '12px 16px' },
                          maxWidth: { xs: '300px', md: '400px' },
                          lineHeight: 1.4
                        }
                      }
                    }}
                  >
                    <IconButton 
                      sx={{ 
                        color: 'rgba(255,255,255,0.6)',
                        '&:hover': {
                          color: '#7c3aed'
                        }
                      }}
                    >
                      <HelpOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                {isAuthor && isTeacher && (
                  <IconButton 
                    onClick={() => setIsModuleModalOpen(true)}
                    sx={{ 
                      color: '#7c3aed',
                      '&:hover': {
                        color: '#2196f3',
                      }
                    }}
                  >
                    <AddCircleIcon sx={{ fontSize: { xs: 24, md: 32 } }} />
                  </IconButton>
                )}
              </Box>
              <Grid container spacing={{ xs: 2, md: 3 }}>
                {course.modules?.map((module) => (
                  <Grid item xs={12} key={module.id}>
                    <Card 
                      onClick={() => handleModuleClick(module)}
                      sx={{
                        background: 'rgba(20,20,30,0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1.5px solid #7c3aed55',
                        borderRadius: { xs: 2, md: 4 },
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: { xs: 'none', md: 'translateY(-4px)' },
                          boxShadow: '0 8px 24px #7c3aed33',
                          borderColor: '#7c3aed',
                        },
                      }}
                    >
                      <CardContent>
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            color: '#fff',
                            fontWeight: 700,
                            mb: 2,
                            fontSize: { xs: '1.2rem', md: '1.5rem' }
                          }}
                        >
                          {module.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarTodayIcon sx={{ color: '#7c3aed', fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                          <Typography sx={{ 
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: { xs: '0.9rem', md: '1rem' }
                          }}>
                            Срок изучения: {formatDate(module.dueDate)}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Задания */}
            <Box sx={{ mb: { xs: 3, md: 6 } }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' }, 
                gap: { xs: 1, sm: 2 }, 
                mb: { xs: 2, md: 4 } 
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: { xs: 1, sm: 2 },
                  width: { xs: '100%', sm: 'auto' }
                }}>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: { xs: '1.5rem', md: '2rem' }
                    }}
                  >
                    Задания
                  </Typography>
                  <Tooltip 
                    title="Задания для практики и самопроверки"
                    arrow
                    placement="right"
                    componentsProps={{
                      tooltip: {
                        sx: {
                          fontSize: { xs: '0.9rem', md: '1.1rem' },
                          padding: { xs: '8px 12px', md: '12px 16px' },
                          maxWidth: { xs: '300px', md: '400px' },
                          lineHeight: 1.4
                        }
                      }
                    }}
                  >
                    <IconButton 
                      sx={{ 
                        color: 'rgba(255,255,255,0.6)',
                        '&:hover': {
                          color: '#7c3aed'
                        }
                      }}
                    >
                      <HelpOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                {isAuthor && isTeacher && (
                  <IconButton 
                    onClick={() => setIsAssignmentModalOpen(true)}
                    sx={{ 
                      color: '#7c3aed',
                      '&:hover': {
                        color: '#2196f3',
                      }
                    }}
                  >
                    <AddCircleIcon sx={{ fontSize: { xs: 24, md: 32 } }} />
                  </IconButton>
                )}
              </Box>
              <Grid container spacing={{ xs: 2, md: 3 }}>
                {course.assignments?.map((assignment) => (
                  <Grid item xs={12} md={6} key={assignment.id}>
                    <Card 
                      onClick={() => handleAssignmentClick(assignment)}
                      sx={{
                        background: 'rgba(20,20,30,0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1.5px solid #7c3aed55',
                        borderRadius: { xs: 2, md: 4 },
                        height: '100%',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: { xs: 'none', md: 'translateY(-4px)' },
                          boxShadow: '0 8px 24px #7c3aed33',
                          borderColor: '#7c3aed',
                        },
                      }}
                    >
                      <CardContent>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: '#fff',
                            fontWeight: 700,
                            mb: 2,
                            fontSize: { xs: '1.1rem', md: '1.25rem' }
                          }}
                        >
                          {assignment.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarTodayIcon sx={{ color: '#7c3aed', fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                          <Typography sx={{ 
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: { xs: '0.9rem', md: '1rem' }
                          }}>
                            Срок сдачи: {formatDate(assignment.dueDate)}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Информация о записанных студентах */}
            <Box>
              <Typography 
                variant="h3" 
                sx={{ 
                  color: '#fff',
                  fontWeight: 700,
                  mb: { xs: 2, md: 4 },
                  fontSize: { xs: '1.5rem', md: '2rem' }
                }}
              >
                Студенты
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' }, 
                gap: { xs: 2, sm: 3 }, 
                mb: { xs: 2, md: 3 } 
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PeopleIcon sx={{ color: '#7c3aed', fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                  <Typography sx={{ 
                    color: '#fff', 
                    fontSize: { xs: '1rem', md: '1.2rem' }
                  }}>
                    Всего студентов: {course.enrollments?.length || 0}
                  </Typography>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1,
                  maxWidth: '100%'
                }}>
                  {course.enrollments?.slice(0, 100).map((enrollment) => (
                    <Chip
                      key={enrollment.id}
                      label={enrollment.username}
                      onClick={() => handleStudentClick(enrollment.username)}
                      sx={{
                        background: 'rgba(124,58,237,0.2)',
                        color: '#fff',
                        border: '1px solid #7c3aed55',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        fontSize: { xs: '0.8rem', md: '0.9rem' },
                        '&:hover': {
                          background: 'rgba(124,58,237,0.4)',
                          transform: { xs: 'none', md: 'translateY(-2px)' },
                          boxShadow: '0 4px 12px rgba(124,58,237,0.2)',
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </>
        )}
      </Container>

      {/* Модальное окно для создания модуля */}
      <Modal
        open={isModuleModalOpen}
        onClose={() => setIsModuleModalOpen(false)}
        aria-labelledby="modal-create-module"
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
              Создание модуля
            </Typography>
            <IconButton 
              onClick={() => setIsModuleModalOpen(false)}
              sx={{ 
                color: '#fff',
                '&:hover': { color: '#7c3aed' }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <form onSubmit={handleCreateModule}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                required
                name="title"
                label="Название модуля"
                value={moduleFormData.title}
                onChange={handleModuleInputChange}
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
                value={moduleFormData.description}
                onChange={handleModuleInputChange}
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

              <ThemeProvider theme={darkTheme}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Срок сдачи"
                    value={moduleFormData.dueDate}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        fullWidth
                        variant="filled"
                        sx={{
                          '& .MuiInputBase-root': {
                            background: 'rgba(255,255,255,0.05) !important',
                            '&:hover': {
                              background: 'rgba(255,255,255,0.08) !important',
                            },
                            '&.Mui-focused': {
                              background: 'rgba(255,255,255,0.08) !important',
                            },
                            '&::before': {
                              borderBottom: '1px solid rgba(255,255,255,0.1)',
                            },
                            '&::after': {
                              borderBottom: '2px solid #7c3aed',
                            },
                            '&:hover:not(.Mui-disabled):before': {
                              borderBottom: '1px solid rgba(255,255,255,0.2)',
                            },
                          },
                          '& .MuiFilledInput-input': {
                            background: 'transparent !important',
                            color: '#fff',
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255,255,255,0.7)',
                          },
                          '& .MuiIconButton-root': {
                            color: '#7c3aed',
                          },
                          '& .MuiInputAdornment-root .MuiTypography-root': {
                            color: '#fff',
                          },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </ThemeProvider>

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
                {isSubmitting ? 'Создание...' : 'Создать модуль'}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>

      {/* Модальное окно для создания задания */}
      <Modal
        open={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
        aria-labelledby="modal-create-assignment"
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
              Создание задания
            </Typography>
            <IconButton 
              onClick={() => setIsAssignmentModalOpen(false)}
              sx={{ 
                color: '#fff',
                '&:hover': { color: '#7c3aed' }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <form onSubmit={handleCreateAssignment}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                required
                name="title"
                label="Название задания"
                value={assignmentFormData.title}
                onChange={handleAssignmentInputChange}
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
                value={assignmentFormData.description}
                onChange={handleAssignmentInputChange}
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

              <ThemeProvider theme={darkTheme}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Срок сдачи"
                    value={assignmentFormData.dueDate}
                    onChange={handleAssignmentDateChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        fullWidth
                        variant="filled"
                        sx={{
                          '& .MuiInputBase-root': {
                            background: 'rgba(255,255,255,0.05) !important',
                            '&:hover': {
                              background: 'rgba(255,255,255,0.08) !important',
                            },
                            '&.Mui-focused': {
                              background: 'rgba(255,255,255,0.08) !important',
                            },
                            '&::before': {
                              borderBottom: '1px solid rgba(255,255,255,0.1)',
                            },
                            '&::after': {
                              borderBottom: '2px solid #7c3aed',
                            },
                            '&:hover:not(.Mui-disabled):before': {
                              borderBottom: '1px solid rgba(255,255,255,0.2)',
                            },
                          },
                          '& .MuiFilledInput-input': {
                            background: 'transparent !important',
                            color: '#fff',
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255,255,255,0.7)',
                          },
                          '& .MuiIconButton-root': {
                            color: '#7c3aed',
                          },
                          '& .MuiInputAdornment-root .MuiTypography-root': {
                            color: '#fff',
                          },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </ThemeProvider>

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
                {isSubmitting ? 'Создание...' : 'Создать задание'}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>

      {/* Модальное окно для просмотра деталей модуля */}
      <Modal
        open={isModuleDetailsOpen}
        onClose={() => setIsModuleDetailsOpen(false)}
        aria-labelledby="modal-module-details"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95%', sm: '90%', md: '80%', lg: '70%' },
          maxWidth: '1000px',
          maxHeight: '90vh',
          bgcolor: 'rgba(20,20,30,0.95)',
          border: '2px solid #7c3aed55',
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(124, 58, 237, 0.2)',
          p: 4,
          color: '#fff',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {selectedModule && (
            <>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                mb: 4 
              }}>
                <Typography variant="h3" sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #fff, #7c3aed)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {selectedModule.title}
                </Typography>
                <IconButton 
                  onClick={() => setIsModuleDetailsOpen(false)}
                  sx={{ 
                    color: '#fff',
                    '&:hover': { color: '#7c3aed' }
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              <Box sx={{ 
                flex: 1,
                overflowY: 'auto',
                mb: 4,
                p: 3,
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 2,
                border: '1px solid rgba(124, 58, 237, 0.2)',
                boxShadow: 'inset 0 0 20px rgba(124, 58, 237, 0.1)',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(124, 58, 237, 0.3)',
                  borderRadius: '4px',
                  '&:hover': {
                    background: 'rgba(124, 58, 237, 0.5)',
                  },
                },
              }}>
                <Typography sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  lineHeight: 1.8,
                  fontSize: '1.1rem',
                  whiteSpace: 'pre-wrap',
                }}>
                  {selectedModule.description}
                </Typography>
              </Box>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                borderTop: '1px solid rgba(124, 58, 237, 0.2)',
                pt: 3
              }}>
                <CalendarTodayIcon sx={{ color: '#7c3aed' }} />
                <Typography sx={{ 
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '1.1rem'
                }}>
                  Срок изучения: {formatDate(selectedModule.dueDate)}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      {/* Модальное окно для просмотра деталей задания */}
      <Modal
        open={isAssignmentDetailsOpen}
        onClose={() => setIsAssignmentDetailsOpen(false)}
        aria-labelledby="modal-assignment-details"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95%', sm: '90%', md: '80%', lg: '70%' },
          maxWidth: '1000px',
          maxHeight: '90vh',
          bgcolor: 'rgba(20,20,30,0.95)',
          border: '2px solid #7c3aed55',
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(124, 58, 237, 0.2)',
          p: 4,
          color: '#fff',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {selectedAssignment && (
            <>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                mb: 4 
              }}>
                <Typography variant="h3" sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #fff, #7c3aed)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {selectedAssignment.title}
                </Typography>
                <IconButton 
                  onClick={() => setIsAssignmentDetailsOpen(false)}
                  sx={{ 
                    color: '#fff',
                    '&:hover': { color: '#7c3aed' }
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              <Box sx={{ 
                flex: 1,
                overflowY: 'auto',
                mb: 4,
                p: 3,
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 2,
                border: '1px solid rgba(124, 58, 237, 0.2)',
                boxShadow: 'inset 0 0 20px rgba(124, 58, 237, 0.1)',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(124, 58, 237, 0.3)',
                  borderRadius: '4px',
                  '&:hover': {
                    background: 'rgba(124, 58, 237, 0.5)',
                  },
                },
              }}>
                <Typography sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  lineHeight: 1.8,
                  fontSize: '1.1rem',
                  whiteSpace: 'pre-wrap',
                }}>
                  {selectedAssignment.description}
                </Typography>
              </Box>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                borderTop: '1px solid rgba(124, 58, 237, 0.2)',
                pt: 3
              }}>
                <CalendarTodayIcon sx={{ color: '#7c3aed' }} />
                <Typography sx={{ 
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '1.1rem'
                }}>
                  Срок выполнения задания: {formatDate(selectedAssignment.dueDate)}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      {/* Модальное окно для просмотра профиля студента */}
      <Modal
        open={isStudentProfileOpen}
        onClose={() => setIsStudentProfileOpen(false)}
        aria-labelledby="modal-student-profile"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95%', sm: '90%', md: '80%', lg: '70%' },
          maxWidth: '1000px',
          maxHeight: '90vh',
          bgcolor: 'rgba(20,20,30,0.95)',
          border: '2px solid #7c3aed55',
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(124, 58, 237, 0.2)',
          p: 4,
          color: '#fff',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {isLoadingProfile ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
              <CircularProgress sx={{ color: '#7c3aed' }} />
            </Box>
          ) : studentProfile && (
            <>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                mb: 4 
              }}>
                <Typography variant="h3" sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #fff, #7c3aed)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Профиль студента
                </Typography>
                <IconButton 
                  onClick={() => setIsStudentProfileOpen(false)}
                  sx={{ 
                    color: '#fff',
                    '&:hover': { color: '#7c3aed' }
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              <Box sx={{ 
                flex: 1,
                overflowY: 'auto',
                mb: 4,
                p: 3,
                background: 'rgba(20,20,30,0.95)',
                borderRadius: 2,
                border: '1px solid rgba(124, 58, 237, 0.2)',
                boxShadow: 'inset 0 0 20px rgba(124, 58, 237, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(124, 58, 237, 0.3)',
                  borderRadius: '4px',
                  '&:hover': {
                    background: 'rgba(124, 58, 237, 0.5)',
                  },
                },
              }}>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    color: '#fff',
                    fontWeight: 700,
                    textAlign: 'center',
                    fontSize: '2.5rem'
                  }}
                >
                  {studentProfile.profile.username}
                </Typography>

                <Box sx={{ width: '100%', textAlign: 'center' }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#7c3aed',
                      mb: 2 
                    }}
                  >
                    Био
                  </Typography>
                  <Typography 
                    sx={{ 
                      color: '#fff',
                      fontSize: '1.1rem'
                    }}
                  >
                    {studentProfile.profile.bio || 'Биография не указана'}
                  </Typography>
                </Box>

                <Box sx={{ width: '100%', textAlign: 'center' }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#7c3aed',
                      mb: 2 
                    }}
                  >
                    Скиллы
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                  }}>
                    {studentProfile.profile.skills?.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        sx={{
                          background: 'rgba(20,20,30,0.95)',
                          color: '#fff',
                          border: '1px solid #7c3aed55',
                          borderRadius: '16px',
                          padding: '4px 8px',
                        }}
                      />
                    )) || (
                      <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Навыки не указаны
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Box sx={{ width: '100%', textAlign: 'center' }}>
                  <Typography 
                    sx={{ 
                      color: '#7c3aed',
                      fontSize: '1.1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1
                    }}
                  >
                    Роль: {studentProfile.role === 0 ? 'Студент' : 'Преподаватель'}
                  </Typography>
                </Box>
              </Box>
            </>
          )}
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
    </Box>
  );
}

export default CourseDetails; 