import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import {
    Container,
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Alert,
    Paper,
    Radio,
    RadioGroup,
    FormControlLabel,
    Grid,
    CircularProgress,
    Snackbar,
    Stack,
    TextField,
    Divider
} from '@mui/material';
import API from "../../../utils/host.config";
import { useLoggedInUser } from '../../../hooks/useUser';
import useTourGuide from '../../../hooks/useTourGuide';
import TourGuide from './tour/TourGuide';

const tourSteps = [
    {
        target: '.questionnaire-header',
        title: 'Header Kuisioner UEQ',
        content: 'Ini adalah halaman kuisioner User Experience Questionnaire. Silakan baca petunjuk dengan seksama sebelum mengisi.',
        placement: 'bottom'
    },
    {
        target: '.questionnaire-table',
        title: 'Tabel Pertanyaan',
        content: 'Setiap baris berisi pasangan kata yang bertolak belakang. Pilih angka 1-7 yang paling sesuai dengan pengalaman Anda. 1 menunjukkan setuju dengan kata di sebelah kiri, 7 setuju dengan kata di sebelah kanan.',
        placement: 'top'
    },
    {
        target: '.instructions-card',
        title: 'Petunjuk Pengisian',
        content: 'Panel ini berisi petunjuk detail cara mengisi kuisioner. Gunakan sebagai referensi saat mengisi.',
        placement: 'left'
    },
    {
        target: '.submit-button',
        title: 'Simpan Kuisioner',
        content: 'Setelah mengisi semua pertanyaan dan feedback, klik tombol ini untuk menyimpan kuisioner Anda.',
        placement: 'bottom'
    }
];

export const UEQQuestionnaire = ({ worksheetId, code }) => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({});
    const [unansweredQuestions, setUnansweredQuestions] = useState([]);
    const [feedbackData, setFeedbackData] = useState({
        kritik: '',
        saran: ''
    });
    const [feedbackError, setFeedbackError] = useState('');
    const questionRefs = useRef({});
    const feedbackRef = useRef(null);
    const user = useLoggedInUser();

    // UEQ questions with attributes on a scale from 1-7
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

    useEffect(() => {
        // Initialize form data with empty values
        const initialData = {};
        questions.forEach(q => {
            initialData[q.id] = null;
            // Create refs for each question row
            questionRefs.current[q.id] = React.createRef();
        });
        setFormData(initialData);
    }, []);

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
    } = useTourGuide('ueq_questionnaire_tour', tourSteps, []);

    const handleChange = (questionId, value) => {
        setFormData({
            ...formData,
            [questionId]: value
        });

        // Update unanswered questions list when a question is answered
        if (unansweredQuestions.includes(questionId)) {
            setUnansweredQuestions(unansweredQuestions.filter(id => id !== questionId));
        }
    };

    const handleFeedbackChange = (field, value) => {
        setFeedbackData({
            ...feedbackData,
            [field]: value
        });

        // Clear feedback error when user starts typing
        if (feedbackError) {
            setFeedbackError('');
        }
    };

    const formatAnswersForAPI = () => {
        // Format the answers in the structure expected by the API
        return Object.keys(formData).map(questionId => ({
            question_id: parseInt(questionId),
            answer: formData[questionId]
        })).filter(item => item.answer !== null);
    };

    const validateForm = () => {
        // Check if all questions have been answered
        const notAnswered = questions
            .filter(q => formData[q.id] === null)
            .map(q => q.id);

        setUnansweredQuestions(notAnswered);

        if (notAnswered.length > 0) {
            setError(`Mohon jawab semua pertanyaan (${notAnswered.length} pertanyaan belum dijawab)`);

            // Scroll to the first unanswered question
            if (notAnswered.length > 0 && questionRefs.current[notAnswered[0]]) {
                setTimeout(() => {
                    questionRefs.current[notAnswered[0]].current?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }, 100);
            }

            return false;
        }

        // Validate feedback form - at least one field must be filled
        if (!feedbackData.kritik && !feedbackData.saran) {
            setFeedbackError('Silakan isi setidaknya salah satu dari kritik atau saran');

            // Scroll to feedback form
            if (feedbackRef.current) {
                setTimeout(() => {
                    feedbackRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }, 100);
            }

            return false;
        }

        return true;
    };

    const submitFeedback = async () => {
        try {
            const response = await axios.post(
                `${API.HOST}/api/v2/feedback`,
                {
                    kritik: feedbackData.kritik,
                    saran: feedbackData.saran
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("xtoken")}` }
                }
            );

            return response.data;
        } catch (err) {
            console.error('Error submitting feedback:', err);
            throw err;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');
        setFeedbackError('');

        try {
            // Get user information from localStorage (assuming it's stored there)
            const studentId = user.value._id;

            // Format the answers for API submission
            const formattedAnswers = formatAnswersForAPI();

            // Create payload
            const payload = {
                student_id: studentId,
                worksheet_id: parseInt(worksheetId),
                answers: formattedAnswers
            };

            // Submit questionnaire to API
            const questionnaireResponse = await axios.post(
                `${API.HOST}/api/v2/questionnaire`,
                payload,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("xtoken")}` }
                }
            );

            // Submit feedback after questionnaire is successfully submitted
            await submitFeedback();

            if (questionnaireResponse.data && questionnaireResponse.data.success) {
                setSuccess(true);
                localStorage.removeItem(`quiz_${worksheetId}_state`);
                // Redirect after showing success message
                setTimeout(() => {
                    history.push(`/home/f/${code}/results/${worksheetId}`);
                }, 2000);
            } else {
                setError(questionnaireResponse.data.message || 'Gagal menyimpan kuisioner');
                setTimeout(() => {
                    setError('');
                }, 4000);
            }
        } catch (err) {
            console.error('Error submitting form:', err);
            setError(err.response?.data?.message || 'Terjadi kesalahan saat menyimpan data');
            setTimeout(() => {
                setError('');
            }, 4000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={success}
                autoHideDuration={3000}
                onClose={() => setSuccess(false)}
            >
                <Alert severity="success" sx={{ width: '100%' }}>
                    Kuisioner dan feedback berhasil disimpan!
                </Alert>
            </Snackbar>
            <Grid container spacing={3}>
                <Grid item xs={12} md={9}>
                    {error && (
                        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Paper elevation={1} sx={{ mb: 3, p: 2, width: '100%' }} className="questionnaire-header">
                                <Stack direction="row" justifyContent="space-between">

                                    <Box>
                                        <Typography variant="h5" component="h1" gutterBottom>
                                            Kuisioner UEQ (User Experience Quistionnaire)
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" gutterBottom>
                                            Silakan pilih nilai yang paling sesuai dengan pengalaman Anda.
                                        </Typography>
                                    </Box>

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        disabled={loading}
                                        className="submit-button"
                                        sx={{
                                            minWidth: 150,
                                            height: 50,
                                            backgroundColor: '#0d47a1',
                                            '&:hover': {
                                                backgroundColor: '#002171',
                                            }
                                        }}
                                    >
                                        {loading ? <CircularProgress size={24} /> : 'Simpan Kuisioner'}
                                    </Button>
                                </Stack>

                            </Paper>

                        </Box>
                        <Card className="questionnaire-table">
                            <CardContent sx={{ p: 0 }}>
                                <Box sx={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ width: '25%' }}></th>
                                                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                                                    <th key={num} style={{ textAlign: 'center', padding: '8px' }}>
                                                        {num}
                                                    </th>
                                                ))}
                                                <th style={{ width: '25%' }}></th>
                                                <th style={{ width: '5%' }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {questions.map((question) => {
                                                const isUnanswered = unansweredQuestions.includes(question.id);
                                                return (
                                                    <tr
                                                        key={question.id}
                                                        ref={questionRefs.current[question.id]}
                                                        style={{
                                                            backgroundColor: isUnanswered
                                                                ? 'rgba(255, 0, 0, 0.1)' // Light red background for unanswered
                                                                : question.id % 2 === 0 ? '#f5f5f5' : '#ffffff',
                                                            border: isUnanswered ? '2px solid #f44336' : 'none',
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                    >
                                                        <td style={{
                                                            textAlign: 'right',
                                                            padding: '10px',
                                                            color: isUnanswered ? '#f44336' : 'inherit',
                                                            fontWeight: isUnanswered ? 'bold' : 'normal'
                                                        }}>
                                                            {question.negative}
                                                        </td>
                                                        {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                                                            <td key={value} style={{ textAlign: 'center' }}>
                                                                <Radio
                                                                    checked={formData[question.id] === value}
                                                                    onChange={() => handleChange(question.id, value)}
                                                                    value={value}
                                                                    name={`question-${question.id}`}
                                                                    size="small"
                                                                    sx={{
                                                                        color: isUnanswered ? '#f44336' : undefined,
                                                                        '&.Mui-checked': {
                                                                            color: isUnanswered ? '#f44336' : undefined,
                                                                        }
                                                                    }}
                                                                />
                                                            </td>
                                                        ))}
                                                        <td style={{
                                                            padding: '10px',
                                                            color: isUnanswered ? '#f44336' : 'inherit',
                                                            fontWeight: isUnanswered ? 'bold' : 'normal'
                                                        }}>
                                                            {question.positive}
                                                        </td>
                                                        <td style={{
                                                            textAlign: 'center',
                                                            color: isUnanswered ? '#f44336' : 'inherit',
                                                            fontWeight: isUnanswered ? 'bold' : 'normal'
                                                        }}>
                                                            {question.id}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </Box>
                            </CardContent>
                        </Card>

                        {/* Feedback Form */}
                        <Card sx={{ mt: 3 }} ref={feedbackRef} className="feedback-section">
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Feedback
                                </Typography>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Silakan berikan feedback Anda tentang sistem ini (wajib diisi salah satu)
                                </Typography>

                                {feedbackError && (
                                    <Alert severity="error" sx={{ mt: 1, mb: 2 }}>
                                        {feedbackError}
                                    </Alert>
                                )}

                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Kritik"
                                            multiline
                                            rows={3}
                                            value={feedbackData.kritik}
                                            onChange={(e) => handleFeedbackChange('kritik', e.target.value)}
                                            variant="outlined"
                                            placeholder="Masukkan kritik Anda tentang sistem ini..."
                                            error={!!feedbackError && !feedbackData.kritik && !feedbackData.saran}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Saran"
                                            multiline
                                            rows={3}
                                            value={feedbackData.saran}
                                            onChange={(e) => handleFeedbackChange('saran', e.target.value)}
                                            variant="outlined"
                                            placeholder="Masukkan saran Anda untuk pengembangan sistem..."
                                            error={!!feedbackError && !feedbackData.kritik && !feedbackData.saran}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </form>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card className="instructions-card">
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" gutterBottom color="error" sx={{ fontWeight: 'bold' }}>
                                Petunjuk Pengisian Kuisioner:
                            </Typography>
                            <Typography variant="body2" paragraph>
                                Untuk melakukan asesment atau evaluasi terhadap produk dimaksud, silakan mengisi kuisioner berikut ini. Kuisioner terdiri dari pasangan atribut bertolak belakang secara makna yang dapat merepresentasikan produk.
                            </Typography>
                            <Typography variant="body2" paragraph>
                                Lingkaran-lingkaran yang berada di antara atribut merepresentasikan gradasi antar atribut yang bertolak belakang.
                            </Typography>
                            <Typography variant="body2">
                                Anda dapat mengekspresikan persetujuan terhadap atribut yang ada dengan cara memilih lingkaran yang lebih dekat dengan impresi Anda.
                            </Typography>
                        </CardContent>
                    </Card>

                    {unansweredQuestions.length > 0 && (
                        <Card sx={{ mt: 2, backgroundColor: 'rgba(255, 0, 0, 0.05)' }}>
                            <CardContent>
                                <Typography variant="h6" color="error" gutterBottom>
                                    Pertanyaan Belum Dijawab:
                                </Typography>
                                <Box sx={{ mt: 1 }}>
                                    {unansweredQuestions.map((id, index) => (
                                        <Button
                                            key={id}
                                            color="error"
                                            size="small"
                                            variant="outlined"
                                            sx={{ m: 0.5 }}
                                            onClick={() => {
                                                questionRefs.current[id].current?.scrollIntoView({
                                                    behavior: 'smooth',
                                                    block: 'center'
                                                });
                                            }}
                                        >
                                            No. {id}
                                        </Button>
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    )}

                    <Card sx={{ mt: 2 }}>
                        <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom>
                                Pentingnya Feedback:
                            </Typography>
                            <Typography variant="body2" paragraph>
                                Feedback Anda sangat berharga untuk pengembangan sistem ini ke depannya. Silakan berikan kritik atau saran yang membangun.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <TourGuide
                show={showTour}
                currentStep={currentStep}
                totalSteps={totalSteps}
                stepData={currentStepData}
                onNext={handleNext}
                onPrev={handlePrev}
                onSkip={handleSkip}
                isFirstStep={isFirstStep}
                isLastStep={isLastStep}
                progress={progress}
                getTooltipPosition={getTooltipPosition}
            />
        </Container>
    );
};