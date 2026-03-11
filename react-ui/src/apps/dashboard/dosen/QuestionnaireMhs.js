import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MUIDataTable from 'mui-datatables';
import {
    Typography,
    Box,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment,
    Grid,
    Card,
    CardContent,
    Chip,
    Divider,
    Alert,
    alpha,
    Modal,
    IconButton,
    TableRow,
    TableCell,
    Table,
    TableContainer,
    TableHead,
    TableBody
} from '@mui/material';
import {
    FileDownload as FileDownloadIcon,
    School as SchoolIcon,
    Assignment as AssignmentIcon,
    FilterList as FilterListIcon,
    Visibility as VisibilityIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import API from "../../../utils/host.config";

const QuestionnaireResultsMhs = () => {
    const [loading, setLoading] = useState(true);
    const [allStudents, setAllStudents] = useState([]); // Store all students
    const [selectedCourse, setSelectedCourse] = useState('Semua');
    const [courses, setCourses] = useState(['Semua']);
    const [openModal, setOpenModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [error, setError] = useState(null);

    // UEQ questions reference
    const questions = [
        { id: 1, negative: 'menyusahkan', positive: 'menyenangkan' },
        { id: 2, negative: 'tak dapat dipahami', positive: 'dapat dipahami' },
        { id: 3, negative: 'monoton', positive: 'kreatif' },
        { id: 4, negative: 'mudah dipelajari', positive: 'sulit dipelajari' },
        { id: 5, negative: 'kurang bermanfaat', positive: 'bermanfaat' },
        { id: 6, negative: 'membosankan', positive: 'mengasyikkan' },
        { id: 7, negative: 'tidak menarik', positive: 'menarik' },
        { id: 8, negative: 'tak dapat diprediksi', positive: 'dapat diprediksi' },
        { id: 9, negative: 'cepat', positive: 'lambat' },
        { id: 10, negative: 'berdaya cipta', positive: 'konvensional' },
        { id: 11, negative: 'menghalangi', positive: 'mendukung' },
        { id: 12, negative: 'buruk', positive: 'baik' },
        { id: 13, negative: 'rumit', positive: 'sederhana' },
        { id: 14, negative: 'tidak disukai', positive: 'menggembirakan' },
        { id: 15, negative: 'lazim', positive: 'terdepan' },
        { id: 16, negative: 'tidak nyaman', positive: 'nyaman' },
        { id: 17, negative: 'tidak aman', positive: 'aman' },
        { id: 18, negative: 'memotivasi', positive: 'tidak memotivasi' },
        { id: 19, negative: 'memenuhi ekspektasi', positive: 'tidak memenuhi ekspektasi' },
        { id: 20, negative: 'tidak efisien', positive: 'efisien' },
        { id: 21, negative: 'jelas', positive: 'membingungkan' },
        { id: 22, negative: 'tidak praktis', positive: 'praktis' },
        { id: 23, negative: 'terorganisasi', positive: 'berantakan' },
        { id: 24, negative: 'atraktif', positive: 'tidak atraktif' },
        { id: 25, negative: 'ramah pengguna', positive: 'tidak ramah pengguna' },
        { id: 26, negative: 'konservatif', positive: 'inovatif' }
    ];

    // Fetch questionnaire results
    const fetchQuestionnaireResults = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(
                `${API.HOST}/api/v2/questionnaire`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("xtoken")}` }
                }
            );

            if (response.data.success) {
                const students = response.data.data;
                setAllStudents(students);

                // Extract unique course names for the filter dropdown
                const uniqueCourses = ['Semua', ...new Set(students.map(student => student.worksheet_title))];
                setCourses(uniqueCourses);
            } else {
                setError('Failed to fetch questionnaire results');
            }
        } catch (error) {
            console.error('Error fetching questionnaire results:', error);
            setError('Error fetching data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestionnaireResults();
    }, []);

    const handleCourseChange = (e) => {
        setSelectedCourse(e.target.value);
    };

    const handleViewResponses = async (studentId) => {
        try {
            setLoading(true);
            setError(null);

            // Fetch detailed questionnaire data
            const response = await axios.get(
                `${API.HOST}/api/v2/questionnaire/${studentId}`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("xtoken")}` }
                }
            );

            if (response.data.success) {
                setSelectedStudent(response.data.data);
                setOpenModal(true);
            } else {
                setError('Failed to load questionnaire details');
            }
        } catch (error) {
            console.error('Error loading questionnaire details:', error);
            setError('Error loading questionnaire details');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedStudent(null);
    };

    // Export function
    const handleExport = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(
                `${API.HOST}/api/v2/questionnaire/export`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("xtoken")}`,
                    },
                    responseType: 'blob'
                }
            );

            // Create a download link and trigger download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `questionnaire-results-${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error exporting questionnaire results:', error);
            setError('Failed to export data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Filter data based on selected course
    const getFilteredData = () => {
        if (selectedCourse === 'Semua') {
            return allStudents;
        }
        return allStudents.filter(student => student.worksheet_title === selectedCourse);
    };

    // MUIDataTable columns configuration
    const columns = [
        {
            name: "id",
            label: "ID",
            options: {
                display: false,
                filter: false,
            }
        },
        {
            name: "student_name",
            label: "Nama",
            options: {
                filter: true,
                sort: true,
                customBodyRender: (value) => (
                    <Typography variant="body2" fontWeight="medium">
                        {value || 'Unknown'}
                    </Typography>
                )
            }
        },
        {
            name: "nim",
            label: "NIM",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "kelas",
            label: "Kelas",
            options: {
                filter: true,
                sort: true,
                customBodyRender: (value) => (
                    <Chip
                        size="small"
                        label={value || 'Unknown'}
                        color="primary"
                        variant="outlined"
                        sx={{ borderRadius: 1 }}
                    />
                )
            }
        },
        {
            name: "worksheet_title",
            label: "Nama Kuis",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "id",
            label: "Aksi",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value) => (
                    <IconButton
                        color="primary"
                        onClick={() => handleViewResponses(value)}
                        sx={{
                            bgcolor: alpha('#3f51b5', 0.1),
                            '&:hover': { bgcolor: alpha('#3f51b5', 0.2) }
                        }}
                    >
                        <VisibilityIcon />
                    </IconButton>
                )
            }
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
        pagination: true,
        rowsPerPage: 10,
        rowsPerPageOptions: [5, 10, 15, 25, 50],
        searchPlaceholder: "Cari nama atau NIM...",
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
                viewColumns: "Tampilkan Kolom",
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
                    sx={{
                        ml: 2,
                        borderRadius: 2,
                        boxShadow: 2,
                        color: '#fff'
                    }}
                >
                    Export Excel
                </Button>
            );
        },
    };

    return (
        <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box
                sx={{
                    p: 3,
                    background: 'linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                }}
            >
                <AssignmentIcon fontSize="large" />
                <Typography variant="h5" component="h2" fontWeight="bold">
                    Hasil Kuisioner Peserta Didik
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ my: 2, mx: 3 }}>
                    {error}
                </Alert>
            )}

            {allStudents.length > 0 && (
                <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                        <AssignmentIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6" fontWeight="bold">
                            Statistik Kuisioner
                        </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Card
                                sx={{
                                    p: 2,
                                    bgcolor: alpha('#3f51b5', 0.08),
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 2
                                }}
                            >
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Total Kuisioner
                                </Typography>
                                <Typography variant="h4" fontWeight="bold" color="primary">
                                    {allStudents.length}
                                </Typography>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card
                                sx={{
                                    p: 2,
                                    bgcolor: alpha('#4caf50', 0.08),
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 2
                                }}
                            >
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Jumlah Ujian
                                </Typography>
                                <Typography variant="h4" fontWeight="bold" color="#4caf50">
                                    {courses.length - 1}
                                </Typography>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card
                                sx={{
                                    p: 2,
                                    bgcolor: alpha('#2196f3', 0.08),
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 2
                                }}
                            >
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Jumlah Pertanyaan
                                </Typography>
                                <Typography variant="h4" fontWeight="bold" color="#2196f3">
                                    {questions.length}
                                </Typography>
                            </Card>
                        </Grid>
                    </Grid>
                </CardContent>
            )}

            <Box sx={{ p: 3 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 0.5,
                        borderRadius: 1,
                        mb: 2
                    }}
                >
                    <FilterListIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="subtitle1" fontWeight="medium">
                        Filter Data
                    </Typography>
                </Box>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={4}>
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel>Ujian</InputLabel>
                            <Select
                                value={selectedCourse}
                                onChange={handleCourseChange}
                                label="Ujian"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <SchoolIcon color="primary" />
                                    </InputAdornment>
                                }
                                sx={{ borderRadius: 2 }}
                            >
                                {courses.map((course) => (
                                    <MenuItem key={course} value={course}>
                                        {course}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" my={6}>
                        <CircularProgress />
                        <Typography variant="body1" color="textSecondary" sx={{ ml: 2 }}>
                            Memuat data...
                        </Typography>
                    </Box>
                ) : (
                    <MUIDataTable
                        title="Daftar Hasil Kuisioner"
                        data={getFilteredData()}
                        columns={columns}
                        options={options}
                    />
                )}
            </Box>

            {/* Modal for displaying student responses */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="response-modal-title"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '90%', sm: '80%', md: '90%' },
                    maxWidth: 900,
                    maxHeight: '90vh',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,
                    overflow: 'auto'
                }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <AssignmentIcon color="primary" />
                            <Typography id="response-modal-title" variant="h6" fontWeight="bold">
                                {selectedStudent && `Detail Kuisioner - ${selectedStudent.student_name}`}
                            </Typography>
                        </Box>
                        <IconButton onClick={handleCloseModal} sx={{ bgcolor: alpha('#f5f5f5', 0.8) }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {selectedStudent && (
                        <>
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="body2" color="textSecondary">
                                        Nama Peserta:
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {selectedStudent.student_name}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="body2" color="textSecondary">
                                        NIM:
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {selectedStudent.nim}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="body2" color="textSecondary">
                                        Kelas:
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {selectedStudent.kelas}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Box sx={{ bgcolor: alpha('#3f51b5', 0.05), p: 2, borderRadius: 2, mb: 3 }}>
                                <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                                    Nama Ujian: <span style={{ color: '#3f51b5' }}>{selectedStudent.worksheet_title}</span>
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Jawaban peserta didik terhadap kuisioner User Experience Questionnaire (UEQ)
                                </Typography>
                            </Box>

                            <TableContainer component={Card} variant="outlined" sx={{ borderRadius: 2, mb: 2 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: alpha('#3f51b5', 0.1) }}>
                                            <TableCell align="center" width="5%">#</TableCell>
                                            <TableCell width="30%">Item Negatif</TableCell>
                                            {[1, 2, 3, 4, 5, 6, 7].map(num => (
                                                <TableCell key={num} align="center" width="5%">{num}</TableCell>
                                            ))}
                                            <TableCell width="30%">Item Positif</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {questions.map((question) => {
                                            const answer = selectedStudent.answers.find(a => a.question_id === question.id);
                                            const selectedValue = answer ? answer.answer : null;

                                            return (
                                                <TableRow key={question.id} sx={{
                                                    '&:nth-of-type(odd)': { bgcolor: alpha('#f5f5f5', 0.5) },
                                                }}>
                                                    <TableCell align="center">{question.id}</TableCell>
                                                    <TableCell>{question.negative}</TableCell>
                                                    {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                                                        <TableCell key={value} align="center">
                                                            <Box
                                                                sx={{
                                                                    width: 16,
                                                                    height: 16,
                                                                    borderRadius: '50%',
                                                                    bgcolor: selectedValue === value ? '#3f51b5' : 'transparent',
                                                                    border: '1px solid #3f51b5',
                                                                    display: 'inline-block'
                                                                }}
                                                            />
                                                        </TableCell>
                                                    ))}
                                                    <TableCell>{question.positive}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Box display="flex" justifyContent="flex-end" mt={3}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={handleCloseModal}
                                    sx={{ borderRadius: 2 }}
                                >
                                    Tutup
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
        </Card>
    );
};

export default QuestionnaireResultsMhs;