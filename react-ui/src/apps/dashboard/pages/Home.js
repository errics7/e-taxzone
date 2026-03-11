import React, { useEffect } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Toolbar,
  Typography,
  useTheme,
  ThemeProvider,
  createTheme,
  Divider
} from '@mui/material';
import LogoWithTitle from '../component/LogoWithTitle';
import { useHistory } from 'react-router-dom';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import { useSelector } from 'react-redux';
import { LazyLoadImage } from 'react-lazy-load-image-component';

// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#003366',
    },
    secondary: {
      main: '#FFA500',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
    },
    body1: {
      fontSize: '1rem',
    },
  },
});

const OOPediaApp = () => {
  const navigate = useHistory();
  const user = useSelector((state) => state.user);

  if (user.isAuth) {
    if (user.value.authorize === "mahasiswa") {
      return <Redirect to="/home" />;
    } else if (user.value.authorize === "dosen") {
      return <Redirect to="/dosen" />;
    } else if (user.value.authorize === "admin") {
      return <Redirect to="/admin" />;
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: '#ffff'
        }}
      >
        {/* Header */}
        <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: 'white' }}>
          <Container maxWidth="lg">
            <Toolbar sx={{ justifyContent: 'space-between' }}>
              <LogoWithTitle />
              <Box>
                <Button
                  variant="contained"
                  sx={{
                    borderRadius: 2,
                    bgcolor: '#003366',
                    '&:hover': {
                      bgcolor: '#002244'
                    }
                  }}
                  onClick={() => navigate.push('/login')}
                >
                  Masuk
                </Button>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        {/* Main Content */}
        <Box component="main" sx={{ flex: 1 }}>
          <Container maxWidth="lg"
            sx={{
              mt: 8,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '60vh',
            }}
          >
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Button
                  variant="contained"
                  sx={{
                    mb: 3,
                    px: 3,
                    py: 1,
                    borderRadius: 6,
                    textTransform: 'none',
                    fontWeight: 'medium',
                    bgcolor: '#003366',
                    '&:hover': {
                      bgcolor: '#002244'
                    }
                  }}
                  onClick={() => navigate.push('/login')}
                >
                  Mempermudah Manajemen Kelas
                </Button>

                <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 3, fontSize: 32 }}>
                  Temukan Fitur Ujian Interaktif dan Pengalaman Menarik untuk Siswa
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  Platform yang dirancang untuk memudahkan guru dalam memanajemen kelas dan tugas siswa. Menyediakan platform ujian interaktif yang dapat memberikan pengalaman baru siswa dalam pembelajaran di kelas.
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <LazyLoadImage
                  src={"/hompage.svg"}
                  alt="oopedia"
                  className="w-full h-auto object-cover"
                // style={{
                //   width: "100%",
                //   maxWidth: "20rem",
                //   marginLeft: "auto",
                //   marginRight: "auto",
                //   marginTop: "1.25rem",
                //   marginBottom: "1.25rem",
                // }}
                />
                {/* <Box
                  component="img"
                  src="/hompage.svg"
                  alt="Students learning"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 4,
                    objectFit: 'cover'
                  }}
                  loading="lazy"
                /> */}
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Footer */}
        <Box component="footer" sx={{ py: 3, bgcolor: '#ffff' }}>
          <Container maxWidth="lg">
            <Divider />
            <Typography variant="body2" color="text.secondary" align="left" sx={{ mt: 4, mb: 1 }}>
              Copyright © 2025 OOPedia Team
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default OOPediaApp;
