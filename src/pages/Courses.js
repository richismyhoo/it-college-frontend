import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function Courses() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Наши курсы
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Страница курсов находится в разработке
        </Typography>
      </Box>
    </Container>
  );
}

export default Courses; 