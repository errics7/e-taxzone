import React, { useState, useMemo } from "react";
import axios from "axios";
import API from "../../../utils/host.config";
import PilihScenario from "./PilihScenario";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";
import swal from "sweetalert";
import useSWR from "swr";
import Lottie from "lottie-react";
import Mapel from "../assets/default-mapel.svg";
import Folder from "../assets/folder.png";

import emptyfile from "../assets/lottie/emptyfile.json";
import {
  CircularProgress,
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
  Box,
  Divider,
  Container,
  Fab,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import { ShimmerSimpleGallery } from "react-shimmer-effects";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { Tabs, Tab, Box as MuiBox, AppBar } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GetAppIcon from "@mui/icons-material/GetApp";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";

import { Link } from "react-router-dom";

function WorksheetDataList() {
  const { code } = useParams();
  const navigate = useHistory();
  const refresh = useSelector((state) => state.counter.value);
  const authorize = useSelector((state) => state.user.value.authorize);
  const state = useSelector((state) => state.scen);

  const [worksheets, setWorksheets] = useState([
    { title: "", description: "" },
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [worksheetToDelete, setWorksheetToDelete] = useState(null);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");

  const [tabValue, setTabValue] = useState(0);
  const [fileViewerOpen, setFileViewerOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);

  const { data, error, mutate } = useSWR(
    code !== "-"
      ? `${API.HOST}/api/v2/worksheet/list?code=${code}&refresh=${refresh}`
      : null,
    (url) =>
      axios
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("xtoken"),
          },
        })
        .then((res) => res.data),
    {
      refreshWhenOffline: true,
      loadingTimeout: 60000,
      onLoadingSlow: () => {
        toast.error("Koneksi Anda Buruk", { duration: 3500, icon: "⚠️" });
      },
      onSuccess: (data) => {
        if (!data.success) {
          toast.error(data.message, { duration: 3500 });
        }
      },
    }
  );

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleViewFile = (fileUrl) => {
    setCurrentFile(fileUrl);
    setFileViewerOpen(true);
  };

  const handleCloseFileViewer = () => {
    setFileViewerOpen(false);
    setCurrentFile(null);
  };

  const handleDownloadFile = (fileUrl) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = getFileNameFromUrl(fileUrl);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Group worksheets by file_url
  const groupedWorksheets = useMemo(() => {
    if (!data || !data.data) return { withFile: [], withoutFile: [] };

    const withFile = [];
    const withoutFile = [];

    // Group worksheets with the same file_url together
    const fileGroups = {};

    data.data.forEach(ws => {
      if (ws.file_url) {
        if (!fileGroups[ws.file_url]) {
          fileGroups[ws.file_url] = {
            file_url: ws.file_url,
            worksheets: []
          };
        }
        fileGroups[ws.file_url].worksheets.push(ws);
      } else {
        withoutFile.push(ws);
      }
    });

    // Convert file groups to array
    Object.values(fileGroups).forEach(group => {
      withFile.push(group);
    });

    return { withFile, withoutFile };
  }, [data]);

  // Filter worksheets based on search query
  const filteredWorksheets = useMemo(() => {
    if (!data || !data.data) return { withFile: [], withoutFile: [] };

    const withFile = [];
    const withoutFile = [];

    // Filter and group worksheets with the same file_url
    const fileGroups = {};

    data.data.forEach(ws => {
      if (!ws.title.toLowerCase().includes(searchQuery.toLowerCase())) return;

      if (ws.file_url) {
        if (!fileGroups[ws.file_url]) {
          fileGroups[ws.file_url] = {
            file_url: ws.file_url,
            worksheets: []
          };
        }
        fileGroups[ws.file_url].worksheets.push(ws);
      } else {
        withoutFile.push(ws);
      }
    });

    // Convert file groups to array
    Object.values(fileGroups).forEach(group => {
      withFile.push(group);
    });

    return { withFile, withoutFile };
  }, [data, searchQuery]);

  const handleOpenDialog = () => {
    setWorksheets([{ title: "", description: "" }]);
    setFile(null);
    setFileError("");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const addWorksheetField = () => {
    setWorksheets([...worksheets, { title: "", description: "" }]);
  };

  const removeWorksheetField = (index) => {
    if (worksheets.length > 1) {
      const newWorksheets = worksheets.filter((_, i) => i !== index);
      setWorksheets(newWorksheets);
    } else {
      toast.error("Minimal harus ada 1 worksheet");
    }
  };

  const handleWorksheetChange = (index, field, value) => {
    const newWorksheets = [...worksheets];
    newWorksheets[index][field] = value;
    setWorksheets(newWorksheets);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    // Reset error
    setFileError("");

    // Validate file
    if (selectedFile) {
      // You can add file validation here (size, type, etc.)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (selectedFile.size > maxSize) {
        setFileError("Ukuran file terlalu besar (maksimal 5MB)");
        setFile(null);
        return;
      }

      setFile(selectedFile);
    } else {
      setFile(null);
    }
  };

  const createWorksheet = async () => {
    if (worksheets.some((ws) => !ws.title.trim())) {
      toast.error("Judul worksheet tidak boleh kosong!");
      return;
    }

    try {
      // Use FormData to handle file upload
      const formData = new FormData();
      formData.append("code", code);

      // Add file if selected
      if (file) {
        formData.append("file", file);
      }

      // Add worksheets as JSON string
      formData.append("worksheets", JSON.stringify(worksheets));

      const response = await axios.post(
        `${API.HOST}/api/v2/worksheet/create`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("xtoken"),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Worksheet berhasil dibuat!");
      setWorksheets([{ title: "", description: "" }]);
      setFile(null);
      handleCloseDialog();
      mutate();
    } catch (error) {
      toast.error(error.response?.data?.message || "Terjadi kesalahan");
    }
  };

  const handleDeleteConfirmOpen = (worksheet) => {
    swal(`Anda akan menghapus materi "${worksheet?.title}" ?`, {
      buttons: {
        cancel: "Batal",
        catch: {
          text: "Hapus",
          value: "oke",
          className: "ml-5",
        },
      },
      icon: "warning",
      dangerMode: true,
    }).then((value) => {
      switch (value) {
        case "oke":
          const call = axios.delete(
            `${API.HOST}/api/v2/worksheet/${worksheet.id}`,
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("xtoken"),
              },
            }
          ).catch((error) => {
            if (error.response.status === 401) {
              toast.error("Sesi berahir.");
              // dispatch({ type: "LOGOUT" });
            }
            if (error.response.status === 400) {
              toast.error(
                "Terjadi Keslahan server, Silahkan refresh halaman kembali."
              );
            }
          });
          toast.promise(
            call,
            {
              loading: "Menghapus materi ...",
              success: (data) => {
                mutate(); // Refresh data
                // dispatch(refresh());
                swal("Materi berhasil dihapus", {
                  icon: "success",
                });
                return "";
                // message
              },
              error: (error) => {
                return (
                  <div className="relative">
                    <span className="absolute inset-y-0 -left-5 flex items-center">
                      ❌
                    </span>
                    <p className="pl-3">
                      <b>{error.response.data.message}</b>
                    </p>
                  </div>
                );
              },
            },
            {
              style: {
                minWidth: "250px",
                border: "1px solid #1E40AF",
                padding: "16px",
                color: "#1E40AF",
                marginBottom: "25px",
              },
              success: {
                duration: 1,
                icon: "",
              },
              error: {
                duration: 4500,
                icon: "",
              },
            }
          );
          break;
        default:
          return;
      }
    });
  };

  if (error) {
    swal({
      title: "Peringatan",
      text: error.response?.data?.message || "Terjadi kesalahan",
      icon: "error",
      buttons: { catch: { text: "Tutup", value: "oke" } },
    }).then((value) => {
      if (value === "oke") window.location.reload();
    });
  }

  const getFileNameFromUrl = (url) => {
    if (!url) return "File";
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  const FileViewerDialog = () => {
    const fileExt = currentFile ? currentFile.split('.').pop().toLowerCase() : "";

    return (
      <Dialog
        open={fileViewerOpen}
        onClose={handleCloseFileViewer}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2, bgcolor: "primary.main", color: "white" }}>
          <Typography variant="h6" component="div">
            {"Dokumen Materi"}
          </Typography>
          <Box sx={{ position: "absolute", right: 8, top: 8, display: "flex" }}>
            <Tooltip title="Download">
              <IconButton
                onClick={() => handleDownloadFile(`${API.HOST}/${currentFile}`)}
                sx={{ color: "white", mr: 1 }}
              >
                <GetAppIcon />
              </IconButton>
            </Tooltip>
            <IconButton
              aria-label="close"
              onClick={handleCloseFileViewer}
              sx={{ color: "white" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ height: "90vh", p: 0, position: "relative" }}>
          {currentFile && (
            <Box sx={{ height: "100%", width: "100%", overflow: "auto" }}>
              
              {fileExt === "pdf" ? (

               <iframe
                  src={`${API.HOST}/${currentFile}`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                >
                  Browser tidak mendukung tampilan dokumen ini.
                </iframe>
              ) : (
                <iframe
                  src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(`${API.HOST}/${currentFile}`)}`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                >
                  Browser tidak mendukung tampilan dokumen ini.
                </iframe>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="flex flex-col">
      <Helmet>
        <title>
          Game Simulasi Kontrol |{" "}
          {authorize.charAt(0).toUpperCase() + authorize.slice(1)}
        </title>
      </Helmet>
      <PilihScenario source="gssimulasi" />

      <Box sx={{ mt: 2, mb: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            position: "relative",
            borderRadius: 2,
            minHeight: "60vh",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h5" component="h1" fontWeight="bold">
              Daftar Materi
            </Typography>
            <div className="flex items-center gap-6">
              {/* Search Field */}
              {state.selectedcode !== "-" &&
                data &&
                data.data &&
                data.data.length > 0 && (
                  <Box>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Cari materi..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                        sx: { borderRadius: "50px" },
                      }}
                    />
                  </Box>
                )}
              <Tooltip title="Tambah Materi Baru">
                <Fab
                  color="primary"
                  aria-label="add"
                  onClick={handleOpenDialog}
                  size="medium"
                >
                  <AddIcon />
                </Fab>
              </Tooltip>
            </div>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {state.selectedcode === "-" ? (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              height="60vh"
            >
              <Lottie
                style={{
                  height: 250,
                }}
                animationData={emptyfile}
                loop={true}
              />
              <Typography variant="body1" color="text.secondary" mt={2}>
                Kelas Belum Dipillih, silahkan pilih kelas terlebih dahulu
              </Typography>
            </Box>
          ) : !data ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="300px"
              marginTop={20}
            >
              <ShimmerSimpleGallery card imageHeight={140} caption />
              <CircularProgress sx={{ position: "absolute" }} />
            </Box>
          ) : (
            <>
              {data.data.length > 0 ? (
                <>
                  <AppBar position="static" color="default" sx={{ borderRadius: 1, boxShadow: 1, mb: 3 }}>
                    <Tabs
                      value={tabValue}
                      onChange={handleTabChange}
                      indicatorColor="primary"
                      textColor="primary"
                      variant="fullWidth"
                    >
                      <Tab
                        icon={<DescriptionIcon />}
                        label="Materi"
                        iconPosition="start"
                        sx={{ textTransform: 'none', fontWeight: 'bold' }}
                      />
                      <Tab
                        icon={<AssignmentIcon />}
                        label="Ujian"
                        iconPosition="start"
                        sx={{ textTransform: 'none', fontWeight: 'bold' }}
                      />
                    </Tabs>
                  </AppBar>

                  {/* Tab Panel for Materials with Files */}
                  {tabValue === 0 && (
                    <>
                      {filteredWorksheets.withFile.length > 0 ? (
                        <Grid container spacing={3}>
                          {filteredWorksheets.withFile.map((group, index) => (
                            <Grid item xs={12} sm={6} md={4} key={`file-group-${index}`}>
                              <Card
                                className="hover:shadow-lg transition-all duration-300"
                                sx={{
                                  borderRadius: "8px",
                                  transition: "all 0.3s ease",
                                  "&:hover": {
                                    transform: "scale(1.03)",
                                  },
                                  position: "relative",
                                }}
                              >
                                {/* Delete Button */}
                                <IconButton
                                  aria-label="delete"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteConfirmOpen(group.worksheets[0]);
                                  }}
                                  sx={{
                                    position: "absolute",
                                    right: 8,
                                    top: 8,
                                    color: "error.main",
                                    bgcolor: "rgba(255,255,255,0.8)",
                                    "&:hover": {
                                      bgcolor: "rgba(255,0,0,0.1)",
                                    },
                                    zIndex: 2,
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>

                                <CardContent className="p-4 flex flex-col items-center">
                                  <Box
                                    sx={{
                                      position: "relative",
                                      width: "100%",
                                      cursor: "pointer"
                                    }}
                                    onClick={() => handleViewFile(group.file_url)}
                                  >
                                    <img
                                      src={Folder}
                                      alt="File icon"
                                      className="w-full h-48 object-contain mb-4"
                                    />
                                  </Box>

                                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                                    Materi terkait:
                                  </Typography>

                                  {group.worksheets.map((ws) => (
                                    <Box key={ws.id} sx={{ width: "100%", mb: 1 }}>
                                      <Link to={`/dosen/sc/create-question/${ws.id}`}>
                                        <Button
                                          variant="outlined"
                                          className="w-full py-2"
                                          aria-label={`Open ${ws.title}`}
                                          sx={{
                                            borderRadius: "50px",
                                            textTransform: "none",
                                            color: "#666",
                                            borderColor: "#ddd",
                                            justifyContent: "flex-start",
                                            px: 2,
                                          }}
                                        >
                                          {ws.title}
                                        </Button>
                                      </Link>
                                      {ws.description && (
                                        <Typography variant="body2" color="text.secondary" sx={{ px: 2, mt: 1 }}>
                                          {ws.description}
                                        </Typography>
                                      )}
                                    </Box>
                                  ))}
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      ) : (
                        <Box
                          display="flex"
                          flexDirection="column"
                          justifyContent="center"
                          alignItems="center"
                          height="40vh"
                        >
                          <Typography variant="body1" color="text.secondary" mt={2}>
                            {searchQuery ?
                              `Tidak ada materi yang sesuai dengan pencarian "${searchQuery}"` :
                              "Tidak ada materi tersedia. Silahkan buat materi baru."
                            }
                          </Typography>
                          {searchQuery && (
                            <Button
                              variant="outlined"
                              onClick={() => setSearchQuery("")}
                              sx={{ mt: 2 }}
                            >
                              Reset Pencarian
                            </Button>
                          )}
                        </Box>
                      )}
                    </>
                  )}

                  {/* Tab Panel for Materials without Files (Exams) */}
                  {tabValue === 1 && (
                    <>
                      {filteredWorksheets.withoutFile.length > 0 ? (
                        <Grid container spacing={3}>
                          {filteredWorksheets.withoutFile.map((ws) => (
                            <Grid item xs={12} sm={6} md={4} key={ws.id}>
                              <Card
                                className="hover:shadow-lg transition-all duration-300"
                                sx={{
                                  borderRadius: "8px",
                                  transition: "all 0.3s ease",
                                  "&:hover": {
                                    transform: "scale(1.03)",
                                  },
                                  position: "relative",
                                }}
                              >
                                {/* Delete Button */}
                                <IconButton
                                  aria-label="delete"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteConfirmOpen(ws);
                                  }}
                                  sx={{
                                    position: "absolute",
                                    right: 8,
                                    top: 8,
                                    color: "error.main",
                                    bgcolor: "rgba(255,255,255,0.8)",
                                    "&:hover": {
                                      bgcolor: "rgba(255,0,0,0.1)",
                                    },
                                    zIndex: 2,
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>

                                <CardContent className="p-4 flex flex-col items-center">
                                  <img
                                    src={Mapel}
                                    alt={`${ws.title} class icon`}
                                    className="w-full h-48 object-contain mb-4"
                                  />
                                  <Link to={`/dosen/sc/create-question/${ws.id}`}>
                                    <Button
                                      variant="outlined"
                                      className="w-full py-2"
                                      aria-label={`Open ${ws.title}`}
                                      sx={{
                                        borderRadius: "50px",
                                        textTransform: "none",
                                        color: "#666",
                                        borderColor: "#ddd",
                                        minWidth: 300,
                                      }}
                                    >
                                      {ws.title}
                                    </Button>
                                  </Link>
                                  {ws.description && (
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                      {ws.description}
                                    </Typography>
                                  )}
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      ) : (
                        <Box
                          display="flex"
                          flexDirection="column"
                          justifyContent="center"
                          alignItems="center"
                          height="40vh"
                        >
                          <Typography variant="body1" color="text.secondary" mt={2}>
                            {searchQuery ?
                              `Tidak ada ujian yang sesuai dengan pencarian "${searchQuery}"` :
                              "Tidak ada ujian tersedia. Silahkan buat ujian baru."
                            }
                          </Typography>
                          {searchQuery && (
                            <Button
                              variant="outlined"
                              onClick={() => setSearchQuery("")}
                              sx={{ mt: 2 }}
                            >
                              Reset Pencarian
                            </Button>
                          )}
                        </Box>
                      )}
                    </>
                  )}
                </>
              ) : (
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  height="60vh"
                >
                  <Lottie
                    style={{
                      height: 250,
                    }}
                    animationData={emptyfile}
                    loop={true}
                  />
                  <Typography variant="body1" color="text.secondary" mt={2}>
                    Anda belum memiliki materi. Silahkan buat terlebih dahulu.
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Paper>
      </Box>

      <FileViewerDialog />

      {/* Dialog for adding new worksheets */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{ m: 0, p: 2, bgcolor: "primary.main", color: "white" }}
        >
          <Typography variant="h6" component="div">
            Buat Materi Baru
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "white",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {/* File Upload Section */}
          <Paper
            elevation={1}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 2,
              border: file ? "2px solid #4caf50" : "2px dashed #ccc",
              backgroundColor: file ? "rgba(76, 175, 80, 0.1)" : "inherit",
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Upload File Materi (Opsional)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              File yang diunggah akan terkait dengan semua materi yang ditambahkan di bawah
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 2,
                border: "1px dashed #ccc",
                borderRadius: 1,
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.05)",
                },
              }}
              component="label"
            >
              <input
                type="file"
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
              />
              <CloudUploadIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
              <Typography variant="body1" align="center">
                {file ? file.name : "Klik untuk mengunggah file"}
              </Typography>
              <Typography variant="caption" color="text.secondary" align="center">
                Mendukung PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX
              </Typography>
            </Box>

            {fileError && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {fileError}
              </Typography>
            )}

            {file && (
              <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                <AttachFileIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </Typography>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => setFile(null)}
                  sx={{ ml: 1 }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Paper>

          {/* Worksheet Fields */}
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Detail Materi
          </Typography>

          {worksheets.map((ws, index) => (
            <Paper
              key={index}
              elevation={1}
              sx={{
                p: 2,
                mb: 2,
                position: "relative",
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Worksheet #{index + 1}
              </Typography>

              <TextField
                label="Judul Materi"
                variant="outlined"
                fullWidth
                required
                value={ws.title}
                onChange={(e) =>
                  handleWorksheetChange(index, "title", e.target.value)
                }
                sx={{ mb: 2 }}
              />

              <TextField
                label="Deskripsi"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={ws.description}
                onChange={(e) =>
                  handleWorksheetChange(index, "description", e.target.value)
                }
              />

              {worksheets.length > 1 && (
                <IconButton
                  aria-label="delete"
                  onClick={() => removeWorksheetField(index)}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: "error.main",
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Paper>
          ))}

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addWorksheetField}
            sx={{ mt: 1 }}
          >
            Tambah Materi Lain
          </Button>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Batal
          </Button>
          <Button variant="contained" color="primary" onClick={createWorksheet}>
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default WorksheetDataList;