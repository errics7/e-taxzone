import React, { useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import API from "../../../utils/host.config";
import Grid from "@mui/material/Grid";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { ShimmerSimpleGallery } from "react-shimmer-effects";
import toast from "react-hot-toast";
import useSWR from "swr";
import Lottie from "lottie-react";
import { CardContent, Typography, Card, Button, Dialog, DialogContent, Box, IconButton } from "@mui/material";
import {
  Tabs,
  Tab,
  Paper
} from "@mui/material";
import emptyfile from "../assets/lottie/emptyfile.json";
import Mapel from "../assets/default-mapel.svg";
import Folder from "../assets/folder.png";

import { Link } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import BookIcon from "@mui/icons-material/Book";
import QuizIcon from "@mui/icons-material/Quiz";
import DescriptionIcon from "@mui/icons-material/Description";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { School } from "@mui/icons-material";
import useTourGuide from "../../../hooks/useTourGuide";
import TourGuide from "../component/tour/TourGuide";

const tourSteps = [
  {
    target: '.class-header',
    title: 'Nama Kelas',
    content: 'Ini adalah nama kelas yang sedang Anda akses.',
    placement: 'bottom'
  },
  {
    target: '.tab-navigation',
    title: 'Tab Navigasi',
    content: 'Gunakan tab ini untuk berpindah antara Materi dan Ujian.',
    placement: 'bottom'
  },
  {
    target: '.materials-section',
    title: 'Materi Pembelajaran',
    content: 'Di sini Anda dapat mengakses semua materi yang telah diberikan oleh pengajar.',
    placement: 'top'
  }
];


export default function HomeGameSimulasiMhs() {
  const { code } = useParams();
  const navigate = useHistory();
  const state = useSelector((state) => state.scen);
  const [openModal, setOpenModal] = useState(false);
  const [selectedWorksheet, setSelectedWorksheet] = useState(null);

  const [activeTab, setActiveTab] = useState(0);
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);


  const { data } = useSWR(
    code !== "-" ? `${API.HOST}/api/v2/course/worksheetdata?${code}` : null,
    (url) =>
      axios
        .post(
          url,
          {
            scen_id: state._id,
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("xtoken"),
            },
          }
        )
        .then((data) => data.data)
        .catch((error) => {
          if (error.response.status === 401) {
            toast.error(error.response.data.message, {
              style: {
                minWidth: "250px",
                border: "1px solid #FF4C4D",
                padding: "16px",
                color: "#000",
                marginBottom: "25px",
              },
              success: {
                duration: 5000,
              },
            });
          } else {
            toast.error(
              "Terjadi kesalahan silahkan ulangi beberapa saat lagi.",
              {
                style: {
                  minWidth: "250px",
                  border: "1px solid #FF4C4D",
                  padding: "16px",
                  color: "#000",
                  marginBottom: "25px",
                },
                duration: 5000,
              }
            );
          }
        }),
    {
      refreshWhenOffline: true,
      loadingTimeout: 60000, //slow network (2G, <= 70Kbps) default 3s
      onLoadingSlow: () =>
        toast("Koneksi Anda Buruk", {
          icon: "⚠️",
          style: {
            minWidth: "250px",
            border: "1px solid #FF4C4D",
            padding: "16px",
            color: "#000",
            marginBottom: "25px",
          },
          duration: 5000,
        }),
      onSuccess: (data) => {
        if (!data.success) {
          toast.error(data.message, {
            style: {
              minWidth: "250px",
              border: "1px solid #FF4C4D",
              padding: "16px",
              color: "#000",
              marginBottom: "25px",
            },
            duration: 5000,
          });
        }
      },
      onError: (err) => {
        toast.error(err.response.data.message, {
          style: {
            minWidth: "250px",
            border: "1px solid #FF4C4D",
            padding: "16px",
            color: "#000",
            marginBottom: "25px",
          },
          duration: 5000,
        });
      },
      revalidateOnFocus: true,
      revalidateIfStale: true,
    }
  );

  const {
    showTour,
    currentStep,
    totalSteps,
    currentStepData,
    progress,
    isFirstStep,
    isLastStep,
    handleNext,
    handlePrev,
    handleSkip,
    getTooltipPosition
  } = useTourGuide('class_detail_tour', tourSteps, [!data, data?.success]);


  const formatDateDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  const handleWorksheetAction = (worksheet) => {
    const now = new Date();
    const startTime = worksheet.start_time ? new Date(worksheet.start_time) : null;
    const endTime = worksheet.end_time ? new Date(worksheet.end_time) : null;
    const isProgressQuiz = localStorage.getItem(`quiz_${worksheet?.id}_state`);

    if (isProgressQuiz) {
      navigate.push(`/home/f/${code}/gssimulasi/${worksheet.id}`);

      return
    }
    if (!startTime || !endTime) {
      // No time constraints, proceed normally
      navigate.push(`/home/f/${code}/gssimulasi/${worksheet.id}`);
      return;
    }

    if (now < startTime) {
      // Worksheet not yet available
      toast.error("Worksheet belum dapat dikerjakan", {
        style: {
          minWidth: "250px",
          border: "1px solid #FF4C4D",
          padding: "16px",
          color: "#000",
          marginBottom: "25px",
        },
        duration: 3000,
      });
      return;
    }

    if (now >= startTime && now <= endTime) {
      // Show confirmation modal
      setSelectedWorksheet(worksheet);
      setOpenModal(true);
    } else if (now > endTime) {
      // Worksheet time has passed
      toast.error("Batas waktu pengerjaan telah berakhir", {
        style: {
          minWidth: "250px",
          border: "1px solid #FF4C4D",
          padding: "16px",
          color: "#000",
          marginBottom: "25px",
        },
        duration: 3000,
      });
    }
  };

  const handleStartWorksheet = () => {
    setOpenModal(false);
    if (selectedWorksheet) {
      navigate.push(`/home/f/${code}/gssimulasi/${selectedWorksheet.id}`);
    }
  };

  const getButtonText = (worksheet) => {
    const now = new Date();
    const startTime = worksheet.start_time ? new Date(worksheet.start_time) : null;
    const endTime = worksheet.end_time ? new Date(worksheet.end_time) : null;

    if (!startTime || !endTime) return "Mulai";

    if (now < startTime) {
      return "Belum Dikerjakan";
    } else if (worksheet.is_completed) {
      return "Telah Dikerjakan";
    } else if ((now > endTime)) {
      return "Waktu Habis";
    } else {
      const isProgressQuiz = localStorage.getItem(`quiz_${worksheet?.id}_state`);

      // This could be "Mulai" or "Lanjut" depending on progress
      // For now we'll just use "Mulai" - you would need additional state to track progress
      return isProgressQuiz ? "Lanjutkan" : "Mulai";
    }
  };

  const getButtonColor = (worksheet) => {
    const now = new Date();
    const startTime = worksheet.start_time ? new Date(worksheet.start_time) : null;
    const endTime = worksheet.end_time ? new Date(worksheet.end_time) : null;

    if (!startTime || !endTime || !worksheet.is_completed) return "#003C77";

    if (now < startTime) {
      return "#969696"; // gray for not yet available
    } else if (now > endTime) {
      return "#969696"; // gray for expired
    } else {
      return "#003C77"; // blue for available
    }
  };

  const formatTimeDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const handleOpenMaterial = (material) => {
    setSelectedMaterial(material);
    setOpenPreview(true);
  };

  const materials = data?.data?.filter(item => item.file_url) || [];
  const exams = data?.data?.filter(item => !item.file_url) || [];
  const fileExt = selectedMaterial ? selectedMaterial.file_url?.split('.').pop().toLowerCase() : "";


  return (
    <div className="">
      <Helmet>
        <title>Kelas {state.nama}</title>
      </Helmet>

      <div className="w-full flex flex-col items-center relative">
        <Grid container spacing={3} className="max-w-6xl py-3">
          {data && !data.success && (
            <Grid item xs={12} md={12} lg={12}>
              <div className="my-5 p-5 h-32 bg-white text-center text-xl">
                {data.message}
              </div>
            </Grid>
          )}
          {code === "-" && !data && (
            <Grid item xs={12} md={12} lg={12}>
              <div className="my-5 p-5 h-32 bg-white text-center text-xl">
                Pilih Kelas Terlebih dahulu.
              </div>
            </Grid>
          )}
          <Grid item xs={12}>
            <Typography variant="h3" mt={3} className="class-header">{state.nama}</Typography>
          </Grid>

          {/* CONTAINER */}
          {code !== "-" ? (
            data ? (
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                  {/* Tab Navigation */}
                  <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    className="tab-navigation"
                    sx={{
                      borderBottom: 1,
                      borderColor: 'divider',
                      '& .MuiTab-root': {
                        textTransform: 'none',
                        fontSize: '16px',
                        fontWeight: 600,
                        py: 2
                      }
                    }}
                  >
                    <Tab
                      icon={<BookIcon />}
                      iconPosition="start"
                      label="Materi"
                      sx={{
                        color: activeTab === 0 ? '#014B96' : '#797979',
                        '&.Mui-selected': { color: '#014B96' }
                      }}
                    />
                    <Tab
                      icon={<School />}
                      iconPosition="start"
                      label="Ujian"
                      sx={{
                        color: activeTab === 1 ? '#014B96' : '#797979',
                        '&.Mui-selected': { color: '#014B96' }
                      }}
                    />
                  </Tabs>

                  {/* Tab Panels */}
                  <Box sx={{ p: 3 }}>
                    {/* Materi Tab Panel */}
                    {activeTab === 0 && (
                      <div className="materials-section">
                        {materials.length > 0 ? (
                          <Grid container spacing={3}>
                            {materials.map((material) => (
                              <Grid item xs={12} sm={6} md={4} key={material.id}>
                                <Card
                                  className="hover:shadow-lg transition-all duration-300"
                                  sx={{
                                    borderRadius: '12px',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                      transform: 'scale(1.03)'
                                    },
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                  }}
                                >
                                  <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                      {/* <DescriptionIcon sx={{ fontSize: 80, color: '#014B96' }} /> */}
                                      <img
                                        src={Folder}
                                        alt={`folder icon`}
                                        className="w-full h-48 object-contain mb-4"
                                      />
                                    </Box>
                                    <Typography
                                      variant="h5"
                                      sx={{
                                        fontSize: 20,
                                        color: '#333',
                                        fontWeight: 600,
                                        mb: 2,
                                        textAlign: 'center'
                                      }}
                                    >
                                      {material.title}
                                    </Typography>

                                    <Typography
                                      variant="body2"
                                      sx={{
                                        color: '#666',
                                        mb: 3,
                                        flexGrow: 1,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical'
                                      }}
                                    >
                                      {material.description || "Tidak ada deskripsi"}
                                    </Typography>

                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: '#888',
                                        mb: 2,
                                        fontSize: 12
                                      }}
                                    >
                                      Ditambahkan pada {formatDateDisplay(material.created_date)}
                                    </Typography>

                                    <Button
                                      variant="contained"
                                      startIcon={<PlayArrowIcon />}
                                      onClick={() => handleOpenMaterial(material)}
                                      sx={{
                                        borderRadius: '50px',
                                        background: '#014B96',
                                        color: '#fff',
                                        textTransform: 'none',
                                        py: 1,
                                        mt: 'auto'
                                      }}
                                    >
                                      Lihat Materi
                                    </Button>
                                  </CardContent>
                                </Card>
                              </Grid>
                            ))}
                          </Grid>
                        ) : (
                          <Box className="flex flex-col md:flex-row justify-center items-center mt-5 w-full p-8">
                            <Lottie
                              style={{
                                maxHeight: 200,
                                maxWidth: 200
                              }}
                              animationData={emptyfile}
                              loop={true}
                            />
                            <Box sx={{ ml: { xs: 0, md: 4 }, textAlign: { xs: 'center', md: 'left' } }}>
                              <Typography variant="h5" sx={{ fontWeight: 600 }}>Belum ada materi</Typography>
                              <Typography variant="body1" sx={{ maxWidth: 600, color: '#666' }}>
                                Belum ada materi yang dapat Anda pelajari saat ini. Materi akan muncul di sini setelah diunggah oleh pengajar.
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </div>
                    )}

                    {/* Ujian Tab Panel */}
                    {activeTab === 1 && (
                      <div className="exams-section">
                        {exams.length > 0 ? (
                          <Grid container spacing={3}>
                            {exams.map((ws) => (
                              <Grid item xs={12} sm={6} md={4} key={ws.id}>
                                <Card
                                  className="hover:shadow-lg transition-all duration-300"
                                  sx={{
                                    borderRadius: '8px',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                      transform: 'scale(1.03)'
                                    }
                                  }}
                                >
                                  <CardContent className="p-4 flex flex-col items-center">
                                    <img
                                      src={Mapel}
                                      alt={`${ws.title} class icon`}
                                      className="w-full h-48 object-contain mb-4"
                                    />
                                    <Typography variant="h4" sx={{ fontSize: 24, color: '#797979', fontWeight: 600 }}>
                                      {ws.title}
                                    </Typography>

                                    {/* {ws.start_time && ws.end_time && (
                            <Typography variant="body2" sx={{ color: '#797979', mt: 1 }}>
                              {formatTimeDisplay(ws.start_time)} - {formatTimeDisplay(ws.end_time)}
                            </Typography>
                          )}

                          {ws.question_count && (
                            <Typography variant="body2" sx={{ color: '#797979', mb: 2 }}>
                              {ws.question_count} pertanyaan
                            </Typography>
                          )} */}

                                    <Button
                                      variant="contained"
                                      className="w-full py-2"
                                      aria-label={`Open ${ws.title}`}
                                      onClick={() => handleWorksheetAction(ws)}
                                      sx={{
                                        borderRadius: '50px',
                                        textTransform: 'none',
                                        background: getButtonColor(ws),
                                        color: '#fff',
                                        minWidth: 300,
                                        marginTop: 2,
                                        '&:disabled': {
                                          background: '#969696',
                                          color: '#fff'
                                        }
                                      }}
                                      disabled={
                                        ws.is_completed || ws.start_time &&
                                        (new Date() < new Date(ws.start_time) || new Date() > new Date(ws.end_time))
                                      }
                                    >
                                      {getButtonText(ws)}
                                    </Button>
                                  </CardContent>
                                </Card>
                              </Grid>
                            ))}
                          </Grid>
                        ) : (
                          <Box className="flex flex-col md:flex-row justify-center items-center mt-5 w-full p-8">
                            <Lottie
                              style={{
                                maxHeight: 200,
                                maxWidth: 200
                              }}
                              animationData={emptyfile}
                              loop={true}
                            />
                            <Box sx={{ ml: { xs: 0, md: 4 }, textAlign: { xs: 'center', md: 'left' } }}>
                              <Typography variant="h5" sx={{ fontWeight: 600 }}>Belum ada ujian</Typography>
                              <Typography variant="body1" sx={{ maxWidth: 600, color: '#666' }}>
                                Belum ada ujian yang dapat Anda kerjakan saat ini. Ujian akan muncul di sini jika sudah dibuat oleh pengajar.
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </div>
                    )}
                  </Box>
                </Paper>
              </Grid>
            ) : (
              <Grid item xs={12} md={12} lg={12}>
                <ShimmerSimpleGallery card imageHeight={140} caption />
              </Grid>
            )
          ) : null}
          {/* END CONTAINER */}
        </Grid>
      </div>

      {/* Confirmation Modal for Exams */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            p: 1
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={() => setOpenModal(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            pb: 2
          }}>
            <QuizIcon sx={{ fontSize: 80, color: '#014B96', mb: 2 }} />

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              {selectedWorksheet?.title || "KUIS"}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box component="span" sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <HelpOutlineIcon sx={{ mr: 1, fontSize: 18 }} />
                <Typography variant="body2">
                  {selectedWorksheet?.question_count || "20"} pertanyaan
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTimeIcon sx={{ mr: 1, fontSize: 18 }} />
                <Typography variant="body2">
                  {selectedWorksheet?.start_time && selectedWorksheet?.end_time ?
                    `${formatTimeDisplay(selectedWorksheet.start_time)} - ${formatTimeDisplay(selectedWorksheet.end_time)}` :
                    "09:00 - 10:00"}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              onClick={handleStartWorksheet}
              sx={{
                borderRadius: '50px',
                background: '#014B96',
                color: 'white',
                textTransform: 'none',
                minWidth: '120px',
                py: 1,
                px: 4
              }}
            >
              Mulai
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Modal for Material Preview */}
      <Dialog
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            height: '90vh',
            maxHeight: '90vh'
          }
        }}
      >
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid #eee'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {selectedMaterial?.title || "Preview Materi"}
          </Typography>
          <IconButton onClick={() => setOpenPreview(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* {selectedMaterial?.description && (
            <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
              <Typography variant="body2" sx={{ color: '#666' }}>
                {selectedMaterial.description}
              </Typography>
            </Box>
          )} */}

          <Box sx={{ flexGrow: 1, height: '100%', overflow: 'hidden' }}>
            {selectedMaterial?.file_url && (fileExt === "pdf" ? (
              <iframe
                src={`${API.HOST}/${selectedMaterial.file_url}`}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title={selectedMaterial.title}
                allowFullScreen
              />
            ) : (
              <iframe
                src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(`${API.HOST}/${selectedMaterial.file_url}`)}`}
                width="100%"
                height="100%"
                frameBorder="0"
              >
                Browser tidak mendukung tampilan dokumen ini.
              </iframe>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}