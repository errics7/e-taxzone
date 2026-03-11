import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Alert } from "@mui/material";
import {
    fetchQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    scheduleWorksheet
} from "./services/questionService";

import { useParams, useHistory } from "react-router-dom";
import toast from "react-hot-toast";
import QuestionList from "./QuestionList";
import QuestionForm from "./QuestionForm";
import QuestionPreview from "./QuestionPreview";
import ScheduleWorksheet from "./ScheduleWorksheet";

const QuestionManagement = () => {
    const { id: worksheetId } = useParams();
    const navigate = useHistory();
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [viewMode, setViewMode] = useState("list"); // list, form, preview, schedule
    const [previewIndex, setPreviewIndex] = useState(0);
    const [openSchedule, setOpenSchedule] = useState(false);

    useEffect(() => {
        loadQuestions();
    }, [worksheetId]);

    const loadQuestions = async () => {
        setIsLoading(true);
        try {
            const data = await fetchQuestions(worksheetId);
            setQuestions(data);
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddQuestion = () => {
        // setCurrentQuestion({
        //     type: "multiple_choice",
        //     question_text: "",
        //     options: [
        //         { option_text: "", is_correct: false },
        //         { option_text: "", is_correct: false }
        //     ]
        // });
        setViewMode("form");
    };

    const handleEditQuestion = (question) => {
        console.log('question ', question)
        setCurrentQuestion(question);
        setViewMode("form");
    };

    const handleDeleteQuestion = async (questionId) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus soal ini?")) return;

        setIsLoading(true);
        try {
            await deleteQuestion(questionId);
            toast.success("Soal berhasil dihapus");
            loadQuestions();
        } catch (error) {
            toast.error("Gagal menghapus soal");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveQuestion = async (questionData) => {
        setIsLoading(true);
        try {
            if (questionData.id) {
                await updateQuestion(questionData.id, questionData);
                toast.success("Soal berhasil diperbarui");
            } else {
                await createQuestion({
                    ...questionData,
                    worksheet_id: worksheetId
                });
                toast.success("Soal berhasil ditambahkan");
            }
            loadQuestions();
            setViewMode("list");
        } catch (error) {
            toast.error("Gagal menyimpan soal");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartPreview = () => {
        if (questions.length === 0) {
            toast.error("Belum ada soal untuk ditampilkan");
            return;
        }
        setPreviewIndex(0);
        setViewMode("preview");
    };

    const handleOpenSchedule = () => {
        if (questions.length === 0) {
            toast.error("Tambahkan soal terlebih dahulu sebelum menjadwalkan");
            return;
        }
        setOpenSchedule(true)
    };

    const handleScheduleComplete = () => {
        toast.success("Penjadwalan berhasil disimpan");
        setViewMode("list");
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5">
                    {viewMode === "list" && "Daftar Soal"}
                    {viewMode === "form" && (currentQuestion?.id ? "Edit Soal" : "Tambah Soal")}
                    {viewMode === "preview" && "Preview Soal"}
                    {viewMode === "schedule" && "PENJADWALAN - KUIS 1 PBO"}
                </Typography>

                {viewMode !== "list" && (
                    <Box>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setViewMode("list")}
                        >
                            Kembali
                        </button>
                    </Box>
                )}
            </Box>

            {isLoading && <Alert severity="info">Memuat data...</Alert>}

            {viewMode === "list" && (
                <QuestionList
                    questions={questions}
                    onAddQuestion={handleAddQuestion}
                    onEditQuestion={handleEditQuestion}
                    onDeleteQuestion={handleDeleteQuestion}
                    onPreview={handleStartPreview}
                    onSchedule={handleOpenSchedule}
                />
            )}

            {viewMode === "form" && (
                <QuestionForm
                    question={currentQuestion}
                    onSave={handleSaveQuestion}
                    onCancel={() => setViewMode("list")}
                />
            )}

            {viewMode === "preview" && (
                <QuestionPreview
                    questions={questions}
                    initialIndex={previewIndex}
                    onExit={() => setViewMode("list")}
                />
            )}

            {openSchedule && (
                <ScheduleWorksheet
                    open={openSchedule}
                    onClose={() => setOpenSchedule(false)}
                    worksheetId={worksheetId}
                    onComplete={handleScheduleComplete}
                />
            )}
        </Container>
    );
};

export default QuestionManagement;