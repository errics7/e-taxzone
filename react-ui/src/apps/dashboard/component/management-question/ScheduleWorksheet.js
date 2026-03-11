import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    FormControlLabel,
    Checkbox,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    IconButton,
    MenuItem,
    InputAdornment
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import toast from "react-hot-toast";
import { scheduleWorksheet, getClasses, getWorksheetDetails } from "./services/questionService";
import DatePicker from "../DatePicker";

const ScheduleModal = ({ open, onClose, worksheetId, worksheetTitle }) => {
    const [classes, setClasses] = useState([]);
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(new Date().getTime() + 60 * 60 * 1000));
    const [questionCount, setQuestionCount] = useState("");
    const [randomizeQuestions, setRandomizeQuestions] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [worksheetDetails, setWorksheetDetails] = useState(null);

    console.log('selected classs ', selectedClasses)

    useEffect(() => {
        if (open && worksheetId) {
            const fetchClassesAndDetails = async () => {
                try {
                    // Fetch classes
                    const classesResponse = await getClasses();
                    if (classesResponse.success && Array.isArray(classesResponse.data)) {
                        setClasses(classesResponse.data || []);
                    }

                    // Fetch worksheet details if worksheetId is provided
                    const worksheetResponse = await getWorksheetDetails(worksheetId);
                    if (worksheetResponse.data) {
                        const { start_time, end_time, question_count, randomize_questions, class_id: assignedClasses } = worksheetResponse.data;

                        // Set form fields with fetched worksheet data
                        if (start_time) setStartDate(new Date(start_time));
                        if (end_time) setEndDate(new Date(end_time));
                        setQuestionCount(question_count || "");
                        setRandomizeQuestions(randomize_questions || false);
                        setSelectedClasses([assignedClasses] || []);
                    }
                } catch (error) {
                    toast.error("Gagal memuat data");
                    console.error("Error fetching data:", error);
                }
            };

            fetchClassesAndDetails();
        }
    }, [open, worksheetId]);

    const handleClassToggle = (classValue) => {
        setSelectedClasses(prev => {
            // If already selected, remove it
            if (prev.includes(classValue)) {
                return prev.filter(value => value !== classValue);
            }
            // Otherwise add it
            else {
                return [...prev, classValue];
            }
        });
    };

    const handleSubmit = async () => {
        if (selectedClasses.length === 0) {
            toast.error("Pilih minimal satu kelas");
            return;
        }

        if (startDate >= endDate) {
            toast.error("Waktu selesai harus lebih besar dari waktu mulai");
            return;
        }

        setIsSubmitting(true);
        try {
            const schedulePromises = selectedClasses.map((classId) =>
                scheduleWorksheet({
                    worksheet_id: worksheetId,
                    class_id: classId,
                    start_time: startDate.toISOString(),
                    end_time: endDate.toISOString(),
                    question_count: questionCount ? parseInt(questionCount) : null,
                    randomize_questions: randomizeQuestions,
                    created_by: localStorage.getItem("userId") || 1,
                })
            );

            await Promise.all(schedulePromises);
            toast.success("Kuis berhasil dijadwalkan");
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Gagal menjadwalkan kuis");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClassChipClick = (classValue) => {
        setSelectedClasses(prev => prev.filter(value => value !== classValue));
    };

    const renderClassChips = () => {
        return selectedClasses.map(classValue => {
            const classItem = classes.find(c => c.value === classValue);
            return classItem ? (
                <Chip
                    key={classValue}
                    label={classItem.label}
                    onDelete={() => handleClassChipClick(classValue)}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                />
            ) : null;
        });
    };

    const isClassSelected = (classValue) => {
        return selectedClasses.includes(classValue);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
        >
            <DialogTitle sx={{ pb: 1, pt: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight="bold">
                        PENJADWALAN - {worksheetTitle || worksheetDetails?.title || "KUIS 1 PBO"}
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                    Pilih satu atau lebih kelas untuk dijadwalkan
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <Box display="flex" flexWrap="wrap" sx={{ mb: 2 }}>
                        {renderClassChips()}
                    </Box>

                    <Grid container spacing={1}>
                        {classes.map((classItem) => (
                            <Grid item key={classItem.value}>
                                <Button
                                    variant={isClassSelected(classItem.value) ? "contained" : "outlined"}
                                    size="small"
                                    onClick={() => handleClassToggle(classItem.value)}
                                    color={isClassSelected(classItem.value) ? "primary" : "secondary"}
                                >
                                    {classItem.label}
                                </Button>
                            </Grid>
                        ))}
                        <Grid item>
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => setSelectedClasses(classes.map(c => c.value))}
                                color="primary"
                            >
                                Semua
                            </Button>
                        </Grid>
                    </Grid>
                </Box>

                <Typography variant="body1" sx={{ mb: 1 }}>
                    Waktu mulai
                </Typography>
                <Grid container spacing={1} sx={{ mb: 3 }}>
                    <Grid item xs={8}>
                        <DatePicker date={startDate} onChange={(d) => setStartDate(new Date(d.setHours(startDate.getHours(), startDate.getMinutes())))} />
                    </Grid>
                    <Grid item xs={2} >
                        <TextField
                            label="Jam"
                            select
                            fullWidth
                            value={startDate.getHours()}
                            onChange={(e) => {
                                const newDate = new Date(startDate);
                                newDate.setHours(parseInt(e.target.value), startDate.getMinutes());
                                setStartDate(newDate);
                            }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"></InputAdornment>,
                            }}
                        >
                            {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                                <MenuItem key={hour} value={hour}>{hour.toString().padStart(2, '0')}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={2} >
                        <TextField
                            label="Menit"
                            select
                            fullWidth
                            value={startDate.getMinutes()}
                            onChange={(e) => {
                                const newDate = new Date(startDate);
                                newDate.setHours(startDate.getHours(), parseInt(e.target.value));
                                setStartDate(newDate);
                            }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"></InputAdornment>,
                            }}
                        >
                            {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                                <MenuItem key={minute} value={minute}>{minute.toString().padStart(2, '0')}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>

                <Typography variant="body1" sx={{ mb: 1 }}>
                    Waktu Selesai
                </Typography>
                <Grid container spacing={1} sx={{ mb: 2 }}>
                    <Grid item xs={8}>
                        <DatePicker date={endDate} onChange={(d) => setEndDate(new Date(d.setHours(endDate.getHours(), endDate.getMinutes())))} />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            label="Jam"
                            select
                            fullWidth
                            value={endDate.getHours()}
                            onChange={(e) => {
                                const newDate = new Date(endDate);
                                newDate.setHours(parseInt(e.target.value), endDate.getMinutes());
                                setEndDate(newDate);
                            }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"></InputAdornment>,
                            }}
                        >
                            {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                                <MenuItem key={hour} value={hour}>{hour.toString().padStart(2, '0')}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            label="Menit"
                            select
                            fullWidth
                            value={endDate.getMinutes()}
                            onChange={(e) => {
                                const newDate = new Date(endDate);
                                newDate.setHours(endDate.getHours(), parseInt(e.target.value));
                                setEndDate(newDate);
                            }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"></InputAdornment>,
                            }}
                        >
                            {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                                <MenuItem key={minute} value={minute}>{minute.toString().padStart(2, '0')}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            value={questionCount}
                            onChange={(e) => setQuestionCount(e.target.value)}
                            label="Jumlah Soal"
                            type="number"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControlLabel
                            control={<Checkbox checked={randomizeQuestions} onChange={() => setRandomizeQuestions(!randomizeQuestions)} />}
                            label="Acak Soal"
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Batal
                </Button>
                <Button
                    onClick={handleSubmit}
                    color="primary"
                    variant="contained"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Sedang Mengajukan..." : "Jadwalkan Kuis"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ScheduleModal;