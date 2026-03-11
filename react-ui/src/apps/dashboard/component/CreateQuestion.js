import React, { useState, useEffect } from "react";
import {
    Container,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    Box,
    Alert,
    IconButton,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Paper,
    Fade,
    Stack,
    Tooltip,
    RadioGroup,
    FormControlLabel,
    Radio,
    CardHeader,
    Pagination
} from "@mui/material";
import axios from "axios";
import API from "../../../utils/host.config";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
    Preview, Delete, Add, Help, CheckCircleOutline, CancelOutlined,
    ArrowBackIos,
    ArrowForwardIos
} from "@mui/icons-material";

const QuestionCreator = ({ mode = "create" }) => {
    const { id: worksheet_id } = useParams();
    const [showPreview, setShowPreview] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([
        {
            type: "multiple_choice",
            question_text: "",
            options: [
                { option_text: "", is_correct: false },
                { option_text: "", is_correct: false }
            ]
        }
    ]);
    const [previewAnswer, setPreviewAnswer] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const totalQuestions = questions.length;

    const onPageChange = (newIndex) => {
        if (newIndex >= 0 && newIndex < totalQuestions) {
            setCurrentIndex(newIndex);
        }
    };
    const questionTypes = {
        multiple_choice: {
            title: "Pilihan Ganda",
            example: "Apa ibu kota Indonesia?",
            description: "Buat pertanyaan dengan beberapa pilihan jawaban, dimana hanya satu jawaban yang benar.",
            template: {
                question_text: "",
                options: [
                    { option_text: "", is_correct: false },
                    { option_text: "", is_correct: false }
                ]
            }
        },
        drag_and_drop: {
            title: "Drag & Drop",
            example: "Urutkan planet-planet dari yang terdekat ke matahari",
            description: "Buat pertanyaan dimana siswa harus mengurutkan jawaban dengan cara drag & drop.",
            template: {
                question_text: "",
                drag_items: [
                    { text: "", correct_position: 1 },
                    { text: "", correct_position: 2 }
                ]
            }
        },
        fill_in_blank: {
            title: "Fill in Blank",
            example: "Dalam OOP, konsep ___ digunakan untuk mewariskan sifat dari kelas induk ke kelas anak.",
            description: "Buat pertanyaan dengan bagian yang dikosongkan menggunakan ___. Siswa akan mengisi bagian tersebut.",
            template: {
                question_text: "",
                correct_answer: ""
            }
        }
    };

    const handleQuestionChange = (index, field, value) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((q, i) =>
                i === index ? { ...q, [field]: value } : q
            )
        );
    };

    const handleAddQuestion = (type) => {
        setQuestions([...questions, { ...questionTypes[type].template, type }]);
    };

    const handleOptionChange = (questionIndex, optionIndex, field, value) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((q, qIndex) =>
                qIndex === questionIndex
                    ? {
                        ...q,
                        options: q.options.map((opt, oIndex) =>
                            oIndex === optionIndex
                                ? { ...opt, [field]: value }
                                : opt
                        ),
                    }
                    : q
            )
        );
    };

    const handleDragItemChange = (questionIndex, itemIndex, field, value) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((q, qIndex) =>
                qIndex === questionIndex
                    ? {
                        ...q,
                        drag_items: q.drag_items.map((item, iIndex) =>
                            iIndex === itemIndex
                                ? { ...item, [field]: value }
                                : item
                        ),
                    }
                    : q
            )
        );
    };


    const handleAddOption = (questionIndex) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options.push({ option_text: "", is_correct: false });
        setQuestions(newQuestions);
    };

    const handleAddDragItem = (questionIndex) => {
        const newQuestions = [...questions];
        const newPosition = newQuestions[questionIndex].drag_items.length + 1;
        newQuestions[questionIndex].drag_items.push({ text: "", correct_position: newPosition });
        setQuestions(newQuestions);
    };

    const handleDelete = (index) => {
        if (questions.length === 1) {
            toast.error("Minimal harus ada satu soal");
            return;
        }
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    };

    const validateQuestions = () => {
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.question_text.trim()) {
                toast.error(`Soal #${i + 1}: Teks pertanyaan tidak boleh kosong`);
                return false;
            }

            if (q.type === "multiple_choice") {
                if (!q.options.some(opt => opt.is_correct)) {
                    toast.error(`Soal #${i + 1}: Harus ada minimal satu jawaban benar`);
                    return false;
                }
                if (q.options.some(opt => !opt.option_text.trim())) {
                    toast.error(`Soal #${i + 1}: Semua opsi harus diisi`);
                    return false;
                }
            } else if (q.type === "drag_and_drop") {
                if (q.drag_items.some(item => !item.text.trim())) {
                    toast.error(`Soal #${i + 1}: Semua item harus diisi`);
                    return false;
                }
            } else if (q.type === "fill_in_blank") {
                if (!q.question_text.includes("___")) {
                    toast.error(`Soal #${i + 1}: Teks pertanyaan harus mengandung ___ sebagai bagian kosong`);
                    return false;
                }
                if (!q.correct_answer || !q.correct_answer.trim()) {
                    toast.error(`Soal #${i + 1}: Jawaban benar harus diisi`);
                    return false;
                }
            }
        }
        return true;
    };

    const saveQuestions = async () => {
        if (!validateQuestions()) return;

        setLoading(true);
        try {
            for (const question of questions) {
                const payload = {
                    worksheet_id,
                    question_text: question.question_text,
                    question_type: question.type === "multiple_choice" ? "radio" : "drag_drop",
                };

                if (question.type === "multiple_choice") {
                    payload.options = question.options;
                } else if (question.type === "drag_and_drop") {
                    payload.drag_items = question.drag_items;
                } else if (question.type === "fill_in_blank") {
                    payload.question_type = "radio";
                    payload.options = [
                        { option_text: question.correct_answer, is_correct: true }
                    ];
                }

                const questionResponse = await axios.post(
                    `${API.HOST}/api/v2/questions/create`,
                    payload,
                    {
                        headers: { Authorization: "Bearer " + localStorage.getItem("xtoken") }
                    }
                );

                console.log("Question created:", questionResponse.data);
            }

            toast.success("Soal berhasil disimpan!");
            setQuestions([{ ...questionTypes.multiple_choice.template, type: "multiple_choice" }]);

        } catch (error) {
            toast.error(error.response?.data?.message || "Terjadi kesalahan saat menyimpan soal");
            console.error("Error saving questions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API.HOST}/api/v2/questions/${worksheet_id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("xtoken")}` }
                });

                if (response.data.success) {
                    const formattedQuestions = response.data.data.map((q) => ({
                        id: q.id,
                        question_text: q.title,
                        type: q.question_type === "radio" ? "multiple_choice" : "drag_and_drop",
                        options: q.options?.map((opt) => ({
                            option_text: opt.option_text,
                            is_correct: opt.is_correct === 1
                        })) || [],
                        drag_items: q.drag_items?.map((item) => ({
                            text: item.item_text,
                            correct_target: item.correct_target
                        })) || []
                    }));

                    setQuestions(formattedQuestions);
                }
            } catch (error) {
                // toast.error("Gagal mengambil data soal");
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();

    }, [worksheet_id]);

    const QuestionContent = ({ question, index }) => {
        const [answer, setAnswer] = React.useState(
            question.type === "multiple_choice"
                ? null
                : question.type === "drag_and_drop"
                    ? new Array(question.drag_items?.length || 0).fill("")
                    : "" // String kosong untuk fill_in_blank
        );

        if (question.type === "multiple_choice") {
            return (
                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Pertanyaan {index + 1}
                    </Typography>
                    <Typography sx={{ mb: 3 }}>{question.question_text}</Typography>
                    <FormControl component="fieldset">
                        <RadioGroup
                            value={answer}
                            onChange={(e) => setAnswer(parseInt(e.target.value))}
                        >
                            <Stack spacing={1.5}>
                                {question.options.map((option, i) => (
                                    <Box
                                        key={i}
                                        sx={{
                                            bgcolor: 'background.paper',
                                            borderRadius: 1,
                                            p: 1
                                        }}
                                    >
                                        <FormControlLabel
                                            value={i}
                                            control={<Radio />}
                                            label={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography>{option.option_text}</Typography>
                                                    {answer === i && (
                                                        option.is_correct ?
                                                            <CheckCircleOutline color="success" /> :
                                                            <CancelOutlined color="error" />
                                                    )}
                                                </Box>
                                            }
                                        />
                                    </Box>
                                ))}
                            </Stack>
                        </RadioGroup>
                    </FormControl>
                </Paper>
            );
        }

        if (question.type === "drag_and_drop") {
            return (
                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Pertanyaan {index + 1}
                    </Typography>
                    <Typography sx={{ mb: 3 }}>{question.question_text}</Typography>
                    <Stack spacing={2}>
                        {answer.map((_, position) => (
                            <Box
                                key={position}
                                sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                            >
                                <Typography sx={{ minWidth: 100 }}>
                                    Posisi {position + 1}:
                                </Typography>
                                <FormControl fullWidth>
                                    <Select
                                        value={answer[position] || ""}
                                        onChange={(e) => {
                                            const newAnswer = [...answer];
                                            const selectedValue = e.target.value;

                                            const prevIndex = newAnswer.indexOf(selectedValue);
                                            if (prevIndex !== -1) {
                                                newAnswer[prevIndex] = "";
                                            }

                                            newAnswer[position] = selectedValue;
                                            setAnswer(newAnswer);
                                        }}
                                        size="small"
                                    >
                                        <MenuItem value="">Pilih item</MenuItem>
                                        {question.drag_items.map((item, i) => (
                                            <MenuItem
                                                key={i}
                                                value={item.text}
                                                disabled={answer.includes(item.text) && answer[position] !== item.text}
                                            >
                                                {item.text}
                                                {answer[position] === item.text && (
                                                    item.text === question.drag_items[position].text ?
                                                        <CheckCircleOutline color="success" sx={{ ml: 1 }} /> :
                                                        <CancelOutlined color="error" sx={{ ml: 1 }} />
                                                )}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        ))}
                    </Stack>
                </Paper>
            );
        }

        // Perbaikan untuk error di QuestionContent untuk fill_in_blank
        if (question.type === "fill_in_blank") {
            return (
                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Pertanyaan {index + 1}
                    </Typography>
                    <Typography sx={{ mb: 3 }}>
                        {question.question_text.split("___").map((part, i, arr) => (
                            <React.Fragment key={i}>
                                {part}
                                {i < arr.length - 1 && (
                                    <TextField
                                        variant="standard"
                                        size="small"
                                        value={answer || ""}
                                        onChange={(e) => setAnswer(e.target.value)}
                                        sx={{ width: 120, mx: 1 }}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </Typography>
                    {answer && (
                        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            {String(answer).toLowerCase() === String(question.correct_answer).toLowerCase() ? (
                                <>
                                    <CheckCircleOutline color="success" />
                                    <Typography color="success.main">Benar!</Typography>
                                </>
                            ) : (
                                <>
                                    <CancelOutlined color="error" />
                                    <Typography color="error.main">
                                        Salah. Jawaban yang benar: {question.correct_answer}
                                    </Typography>
                                </>
                            )}
                        </Box>
                    )}
                </Paper>
            );
        }
        return null;
    };

    const NavigationFooter = ({ index, totalQuestions, onPageChange, onSubmit }) => (
        <Paper elevation={2} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
                startIcon={<ArrowBackIos />}
                onClick={() => onPageChange(index - 1)}
                disabled={index === 0}
            >
                Sebelumnya
            </Button>
            <Pagination
                count={totalQuestions}
                page={index + 1}
                onChange={(e, page) => onPageChange(page - 1)}
                size="small"
            />
            {index === totalQuestions - 1 ? (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onSubmit}
                >
                    Submit
                </Button>
            ) : (
                <Button
                    endIcon={<ArrowForwardIos />}
                    onClick={() => onPageChange(index + 1)}
                >
                    Selanjutnya
                </Button>
            )}
        </Paper>
    );


    const PreviewQuestion = ({ question, index }) => {
        return (
            <Box>
                <QuestionContent question={question} index={index} />
            </Box>
        );
    };


    const HelpDialog = () => (
        <Dialog open={showHelp} onClose={() => setShowHelp(false)} maxWidth="md" fullWidth>
            <DialogTitle>Panduan Membuat Soal OOP dalam Game</DialogTitle>
            <DialogContent>
                <div className="space-y-4">
                    <section>
                        <Typography variant="h6" className="mb-2">Pilihan Ganda</Typography>
                        <Typography variant="body1" className="mb-2">
                            Soal pilihan ganda menguji pemahaman dasar konsep OOP dalam game development.
                        </Typography>
                        <Typography variant="body2">
                            Tips:<br />
                            - Pastikan hanya ada satu jawaban yang benar<br />
                            - Buat opsi yang jelas dan tidak ambigu<br />
                            - Hindari penggunaan "semua benar" atau "semua salah"<br />
                        </Typography>
                    </section>

                    <Divider />

                    <section>
                        <Typography variant="h6" className="mb-2">Drag & Drop</Typography>
                        <Typography variant="body1" className="mb-2">
                            Soal drag & drop menguji pemahaman tentang hubungan antara konsep OOP.
                        </Typography>
                        <Typography variant="body2">
                            Tips: <br />
                            - Pastikan pasangan konsep dan contoh sesuai <br />
                            - Gunakan instruksi yang jelas <br />
                            - Buat item yang singkat dan mudah dipahami <br />
                        </Typography>
                    </section>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setShowHelp(false)}>Tutup</Button>
            </DialogActions>
        </Dialog>
    );


    return (
        <div className="p-5 bg-white shadow-lg rounded-lg min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <Typography variant="h5">Buat Soal</Typography>
                <div className="space-x-2">
                    <Button
                        startIcon={<Help />}
                        onClick={() => setShowHelp(true)}
                        variant="outlined"
                    >
                        Panduan
                    </Button>
                    <Button
                        startIcon={<Preview />}
                        onClick={() => setShowPreview(!showPreview)}
                        variant="outlined"
                        color={showPreview ? "success" : "primary"}
                    >
                        {showPreview ? "Edit Soal" : "Preview Soal"}
                    </Button>
                </div>
            </div>

            <HelpDialog />

            {!showPreview ? (
                <>
                    {questions.map((question, i) => (
                        <>
                            <Card
                                elevation={3}
                                sx={{
                                    mb: 3,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: 6
                                    }
                                }}
                            >
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                        <Typography variant="h6" color="primary">
                                            Soal #{i + 1}
                                        </Typography>
                                        <Tooltip title="Hapus Soal">
                                            <IconButton
                                                onClick={() => handleDelete(i)}
                                                color="error"
                                                size="small"
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>

                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                        <InputLabel>Tipe Soal</InputLabel>
                                        <Select
                                            value={question.type}
                                            onChange={(e) => handleQuestionChange(i, "type", e.target.value)}
                                            label="Tipe Soal"
                                        >
                                            {Object.entries(questionTypes).map(([type, info]) => (
                                                <MenuItem key={type} value={type}>{info.title}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <TextField
                                        label="Pertanyaan"
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        rows={2}
                                        value={question.question_text}
                                        onChange={(e) => handleQuestionChange(i, "question_text", e.target.value)}
                                        sx={{ mb: 3 }}
                                    />

                                    {question.type === "multiple_choice" && (
                                        <Stack spacing={2}>
                                            {question.options.map((option, optionIndex) => (
                                                <Box
                                                    key={optionIndex}
                                                    display="flex"
                                                    gap={2}
                                                    alignItems="center"
                                                >
                                                    <TextField
                                                        label={`Opsi ${optionIndex + 1}`}
                                                        value={option.option_text}
                                                        onChange={(e) => handleOptionChange(i, optionIndex, "option_text", e.target.value)}
                                                        fullWidth
                                                        size="small"
                                                    />
                                                    <FormControl sx={{ minWidth: 120 }}>
                                                        <Select
                                                            value={option.is_correct}
                                                            onChange={(e) => handleOptionChange(i, optionIndex, "is_correct", e.target.value)}
                                                            size="small"
                                                        >
                                                            <MenuItem value={false}>Salah</MenuItem>
                                                            <MenuItem value={true}>Benar</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Box>
                                            ))}
                                            <Button
                                                startIcon={<Add />}
                                                onClick={() => handleAddOption(i)}
                                                variant="outlined"
                                                fullWidth
                                            >
                                                Tambah Opsi
                                            </Button>
                                        </Stack>
                                    )}

                                    {question.type === "drag_and_drop" && (
                                        <Stack spacing={2}>
                                            {question.drag_items.map((item, itemIndex) => (
                                                <Box
                                                    key={itemIndex}
                                                    display="flex"
                                                    gap={2}
                                                    alignItems="center"
                                                >
                                                    <TextField
                                                        label={`Item ${itemIndex + 1}`}
                                                        value={item.text}
                                                        onChange={(e) => handleDragItemChange(i, itemIndex, "text", e.target.value)}
                                                        fullWidth
                                                        size="small"
                                                    />
                                                    <TextField
                                                        label="Posisi"
                                                        type="number"
                                                        value={item.correct_position}
                                                        onChange={(e) => handleDragItemChange(
                                                            i,
                                                            itemIndex,
                                                            "correct_position",
                                                            parseInt(e.target.value)
                                                        )}
                                                        inputProps={{ min: 1, max: question.drag_items.length }}
                                                        sx={{ width: 100 }}
                                                        size="small"
                                                    />
                                                </Box>
                                            ))}
                                            <Button
                                                startIcon={<Add />}
                                                onClick={() => handleAddDragItem(i)}
                                                variant="outlined"
                                                fullWidth
                                            >
                                                Tambah Item
                                            </Button>
                                        </Stack>
                                    )}

                                    {question.type === "fill_in_blank" && (
                                        <Stack spacing={2}>
                                            <Typography variant="body2" color="textSecondary">
                                                Gunakan ___ di dalam pertanyaan untuk menandai bagian yang harus diisi
                                            </Typography>
                                            <TextField
                                                label="Jawaban Benar"
                                                value={question.correct_answer || ""}
                                                onChange={(e) => handleQuestionChange(i, "correct_answer", e.target.value)}
                                                fullWidth
                                                size="small"
                                            />
                                        </Stack>
                                    )}
                                </CardContent>
                            </Card>
                        </>
                    ))}

                    <div className="flex gap-2 mb-4">
                        {Object.entries(questionTypes).map(([type, info]) => (
                            <Button
                                key={type}
                                onClick={() => handleAddQuestion(type)}
                                variant="outlined"
                                startIcon={<Add />}
                            >
                                Tambah {info.title}
                            </Button>
                        ))}
                    </div>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={saveQuestions}
                        disabled={questions.length === 0}
                    >
                        Simpan Semua Soal
                    </Button>
                </>
            ) : (
                <div className="bg-gray-50 p-6 rounded-lg">
                    <Typography variant="h6" className="mb-4">Preview Soal</Typography>
                    <PreviewQuestion question={questions[currentIndex]} index={currentIndex} />
                    <NavigationFooter
                        index={currentIndex}
                        totalQuestions={totalQuestions}
                        onPageChange={onPageChange}
                    />
                </div>
            )}
        </div>
    );
};

export default QuestionCreator;