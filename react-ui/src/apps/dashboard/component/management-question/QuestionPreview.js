import React, { useState } from "react";
import {
    Box, Paper, Typography, Radio, RadioGroup, FormControlLabel,
    TextField, Button, FormControl, Select, MenuItem,
    IconButton
} from "@mui/material";
import { CheckCircleOutline, CancelOutlined, ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const QuestionPreview = ({ questions, initialIndex = 0, onExit }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [answers, setAnswers] = useState({});

    const totalQuestions = questions?.length;
    const currentQuestion = questions?.[currentIndex];

    if (!currentQuestion) {
        return (
            <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="h6">Tidak ada soal untuk ditampilkan</Typography>
                <Button onClick={onExit} sx={{ mt: 2 }}>Kembali</Button>
            </Paper>
        );
    }

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < totalQuestions - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleAnswer = (value) => {
        setAnswers({
            ...answers,
            [currentQuestion.id]: value
        });
    };

    // Determine question type
    const questionType = currentQuestion.type ||
        (currentQuestion.question_type === "radio" ? "multiple_choice" :
            currentQuestion.question_type === "drag_drop" ? "drag_and_drop" :
                "fill_in_blank");

    // Check if the answer is correct
    const isCorrect = () => {
        const answer = answers[currentQuestion.id];
        if (!answer) return false;

        if (questionType === "multiple_choice") {
            const correctOption = currentQuestion.options.findIndex(opt => opt.is_correct);
            return parseInt(answer) === correctOption;
        }

        if (questionType === "fill_in_blank") {
            return answer.toLowerCase() === currentQuestion.correct_answer.toLowerCase();
        }

        // For drag_and_drop, checking is more complex and would depend on implementation
        return false;
    };

    return (
        <Box>
            <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 2 }}>
                    Soal {currentIndex + 1} dari {totalQuestions}
                </Typography>

                <Typography variant="h6" sx={{ mb: 3 }}>
                    {currentQuestion.question_text || currentQuestion.title}
                </Typography>

                {questionType === "multiple_choice" && (
                    <FormControl component="fieldset" fullWidth>
                        <RadioGroup
                            value={answers[currentQuestion.id] || ""}
                            onChange={(e) => handleAnswer(e.target.value)}
                        >
                            {(currentQuestion.options || []).map((option, index) => (
                                <Box key={index} sx={{ mb: 1 }}>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 1,
                                            border: answers[currentQuestion.id] === index.toString() ?
                                                (option.is_correct ? '1px solid green' : '1px solid red') :
                                                '1px solid #ddd'
                                        }}
                                    >
                                        <FormControlLabel
                                            value={index.toString()}
                                            control={<Radio />}
                                            label={
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Typography>{option.option_text}</Typography>
                                                    {answers[currentQuestion.id] === index.toString() && (
                                                        option.is_correct ?
                                                            <CheckCircleOutline color="success" sx={{ ml: 1 }} /> :
                                                            <CancelOutlined color="error" sx={{ ml: 1 }} />
                                                    )}
                                                </Box>
                                            }
                                        />
                                    </Paper>
                                </Box>
                            ))}
                        </RadioGroup>
                    </FormControl>
                )}

                {questionType === "fill_in_blank" && (
                    <Box>
                        <Typography paragraph>
                            {currentQuestion.question_text.split("___").map((part, i, arr) => (
                                <React.Fragment key={i}>
                                    {part}
                                    {i < arr.length - 1 && (
                                        <TextField
                                            variant="standard"
                                            size="small"
                                            value={answers[currentQuestion.id] || ""}
                                            onChange={(e) => handleAnswer(e.target.value)}
                                            sx={{ width: 120, mx: 1 }}
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        </Typography>

                        {answers[currentQuestion.id] && (
                            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                                {String(answers[currentQuestion.id]).toLowerCase() ===
                                    String(currentQuestion.correct_answer).toLowerCase() ? (
                                    <>
                                        <CheckCircleOutline color="success" />
                                        <Typography color="success.main" sx={{ ml: 1 }}>
                                            Benar!
                                        </Typography>
                                    </>
                                ) : (
                                    <>
                                        <CancelOutlined color="error" />
                                        <Typography color="error.main" sx={{ ml: 1 }}>
                                            Salah. Jawaban yang benar: {currentQuestion.correct_answer}
                                        </Typography>
                                    </>
                                )}
                            </Box>
                        )}
                    </Box>
                )}

                {questionType === "drag_and_drop" && (
                    <Box>
                        {/* Simplified drag & drop preview - in real implementation would need more complex UI */}
                        {(currentQuestion.drag_items || []).map((item, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Typography sx={{ minWidth: 120 }}>Posisi {index + 1}:</Typography>
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={answers[currentQuestion.id]?.[index] || ""}
                                        onChange={(e) => {
                                            const currentAnswers = answers[currentQuestion.id] || [];
                                            const newAnswers = [...currentAnswers];
                                            newAnswers[index] = e.target.value;
                                            handleAnswer(newAnswers);
                                        }}
                                    >
                                        <MenuItem value="">Pilih item</MenuItem>
                                        {(currentQuestion.drag_items || []).map((dragItem, i) => (
                                            <MenuItem
                                                key={i}
                                                value={dragItem.text}
                                            >
                                                {dragItem.text}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        ))}
                    </Box>
                )}
            </Paper>

            <Box display="flex" justifyContent="space-between">
                <Button
                    startIcon={<ArrowBackIos />}
                    disabled={currentIndex === 0}
                    onClick={handlePrevious}
                >
                    Sebelumnya
                </Button>

                <Button onClick={onExit} variant="outlined">
                    Kembali ke Daftar
                </Button>

                <Button
                    endIcon={<ArrowForwardIos />}
                    disabled={currentIndex === totalQuestions - 1}
                    onClick={handleNext}
                >
                    Selanjutnya
                </Button>
            </Box>
        </Box>
    );
};

export default QuestionPreview;