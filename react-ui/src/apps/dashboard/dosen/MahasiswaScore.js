import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import {
  Typography,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Alert,
  alpha,
} from "@mui/material";
import {
  FileDownload as FileDownloadIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import axios from "axios";
import API from "../../../utils/host.config";

const WorksheetResults = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [statistics, setStatistics] = useState({
    count: 0,
    average: 0,
    highest: 0,
    lowest: 0,
  });
  const [selectedClass, setSelectedClass] = useState("Semua");
  const [classes, setClasses] = useState(["Semua"]);
  const [error, setError] = useState(null);

  // Fetch worksheet results
  const fetchWorksheetResults = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${API.HOST}/api/v2/questions/worksheet-results`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("xtoken")}`,
          },
        }
      );

      if (response.data.success) {
        const resultsData = response.data.data.results;
        setResults(resultsData);
        setStatistics(response.data.data.statistics);

        // Extract unique classes
        const uniqueClasses = [
          "Semua",
          ...new Set(
            resultsData.map((item) => item.student?.class).filter(Boolean)
          ),
        ];
        setClasses(uniqueClasses);
      } else {
        setError("Failed to fetch worksheet results");
      }
    } catch (error) {
      console.error("Error fetching worksheet results:", error);
      setError("Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorksheetResults();
  }, []);

  // Filter results based on selected class
  const filteredResults = results.filter((item) => {
    return selectedClass === "Semua" || item.student?.class === selectedClass;
  });

  // Export function
  const handleExport = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API.HOST}/api/v2/questions/worksheet-results/export`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("xtoken")}`,
          },
          responseType: "blob",
        }
      );

      // Create a download link and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `penilaian-siswa-${new Date().toISOString().split("T")[0]}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting worksheet results:", error);
      setError("Failed to export data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#4caf50"; // Green for high scores
    if (score >= 60) return "#ff9800"; // Orange for medium scores
    return "#f44336"; // Red for low scores
  };

  // MUIDataTable columns configuration
  const columns = [
    {
      name: "student.name",
      label: "Nama",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          const rowIndex = tableMeta.rowIndex;
          const studentName = filteredResults[rowIndex].student.name;
          return <span>{studentName}</span>;
        },
      },
    },
    {
      name: "student.nim",
      label: "NIM",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          const rowIndex = tableMeta.rowIndex;
          const studentName = filteredResults[rowIndex].student.nim;
          return <span>{studentName}</span>;
        },
      },
    },
    {
      name: "student.class",
      label: "Kelas",
      options: {
        filter: true,
        sort: true,

        customBodyRender: (value, tableMeta, updateValue) => {
          const rowIndex = tableMeta.rowIndex;
          const studentClass = filteredResults[rowIndex].student.class;
          return (
            <Chip
              size="small"
              label={studentClass || "Unknown"}
              color="primary"
              variant="outlined"
              sx={{ borderRadius: 1 }}
            />
          );
        },
      },
    },
    {
      name: "worksheet_title",
      label: "Nama Kuis",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value) => {
          return value || "Unknown";
        },
      },
    },
    {
      name: "score",
      label: "Nilai",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value) => {
          const scoreColor = getScoreColor(value);
          return (
            <Chip
              label={value}
              sx={{
                bgcolor: alpha(scoreColor, 0.1),
                color: scoreColor,
                fontWeight: "bold",
                minWidth: "50px",
                borderRadius: 1,
              }}
            />
          );
        },
      },
    },
  ];

  // MUIDataTable options
  const options = {
    responsive: "standard",
    selectableRows: "none",
    download: false,
    print: false,
    viewColumns: true,
    filter: true,
    filterType: "dropdown",
    elevation: 0,
    rowsPerPageOptions: [5, 10, 15],
    rowsPerPage: 5,
    textLabels: {
      body: {
        noMatch: "Tidak ada data yang tersedia",
        toolTip: "Sort",
      },
      pagination: {
        next: "Halaman Selanjutnya",
        previous: "Halaman Sebelumnya",
        rowsPerPage: "Baris per halaman:",
        displayRows: "dari",
      },
      toolbar: {
        search: "Cari",
        downloadCsv: "Unduh CSV",
        print: "Cetak",
        viewColumns: "Lihat Kolom",
        filterTable: "Filter Tabel",
      },
      filter: {
        all: "Semua",
        title: "FILTER",
        reset: "RESET",
      },
      viewColumns: {
        title: "Tampilkan Kolom",
        titleAria: "Tampilkan/Sembunyikan Kolom Tabel",
      },
    },
    customToolbar: () => {
      return (
        <Button
          variant="contained"
          color="success"
          startIcon={<FileDownloadIcon />}
          onClick={handleExport}
          disabled={loading}
          sx={{ borderRadius: 2, boxShadow: 2, color: "#fff" }}
        >
          Export
        </Button>
      );
    },
  };

  return (
    <Card elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
      <Box
        sx={{
          p: 3,
          background: "linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <AssignmentIcon fontSize="large" />
        <Typography variant="h5" component="h2" fontWeight="bold">
          Daftar Nilai Ujian Peserta Didik
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ my: 2, mx: 3 }}>
          {error}
        </Alert>
      )}

      {statistics.count > 0 && (
        <div>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <AssignmentIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                Statistik Nilai
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={3}>
              <Grid item xs={6} md={3}>
                <Card
                  sx={{
                    p: 2,
                    bgcolor: alpha("#3f51b5", 0.08),
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    Jumlah Peserta
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {statistics.count}
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card
                  sx={{
                    p: 2,
                    bgcolor: alpha("#4caf50", 0.08),
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    Rata-rata Nilai
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="#4caf50">
                    {statistics.average.toFixed(1)}
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card
                  sx={{
                    p: 2,
                    bgcolor: alpha("#2196f3", 0.08),
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    Nilai Tertinggi
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="#2196f3">
                    {statistics.highest}
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card
                  sx={{
                    p: 2,
                    bgcolor: alpha("#f44336", 0.08),
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    Nilai Terendah
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="#f44336">
                    {statistics.lowest}
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </div>
      )}

      <Box sx={{ p: 3 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 0.5,
                borderRadius: 1,
                mb: 2,
              }}
            >
              <FilterListIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="subtitle1" fontWeight="medium">
                Filter Data
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Kelas</InputLabel>
              <Select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                label="Kelas"
                startAdornment={
                  <InputAdornment position="start">
                    <SchoolIcon color="primary" />
                  </InputAdornment>
                }
                sx={{ borderRadius: 2 }}
              >
                {classes.map((kelas) => (
                  <MenuItem key={kelas} value={kelas}>
                    {kelas}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            my={6}
          >
            <CircularProgress />
            <Typography variant="body1" color="textSecondary" sx={{ ml: 2 }}>
              Memuat data...
            </Typography>
          </Box>
        ) : (
          <Box sx={{ mt: 3 }}>
            <MUIDataTable
              title=""
              data={filteredResults}
              columns={columns}
              options={options}
            />
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default WorksheetResults;
