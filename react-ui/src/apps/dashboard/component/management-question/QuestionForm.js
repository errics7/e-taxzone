import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    Select,
    MenuItem,
    IconButton,
    Paper,
    InputBase,
    Tooltip
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Info, InfoOutlined } from "@mui/icons-material";

const questionTypes = {
    multiple_choice: {
        title: "Pilihan Ganda",
        template: {
            options: [
                { option_text: "", is_correct: false },
                { option_text: "", is_correct: false }
            ]
        }
    },
    fill_in_blank: {
        title: "Fill in the blank",
        template: {
            correct_answer: ""
        }
    },
    drag_and_drop: {
        title: "Drag & Drop",
        template: {
            drag_items: [
                { text: "", correct_position: 1 },
                { text: "", correct_position: 2 }
            ]
        }
    }
};

const QuestionForm = ({ question, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        type: "multiple_choice",
        question_text: "",
        options: [
            { option_text: "", is_correct: false },
            { option_text: "", is_correct: false }
        ],
        drag_items: [
            { text: "", correct_position: 1 },
            { text: "", correct_position: 2 }
        ],
        correct_answer: ""
    });
    const [errors, setErrors] = useState({});
    const [categoryValue, setCategoryValue] = useState("");

    useEffect(() => {
        if (question) {
            // Convert backend data structure to form structure
            const type = question.question_type === "radio"
                ? "multiple_choice"
                : question.question_type === "drag_drop"
                    ? "drag_and_drop"
                    : question.question_type === "fill_blank"
                        ? "fill_in_blank"
                        : question.type || "multiple_choice";

            setFormData({
                ...question,
                type,
                question_text: question.question_text || question.title || "",
                options: question.options || [
                    { option_text: "", is_correct: false },
                    { option_text: "", is_correct: false }
                ],
                drag_items: question.drag_items || [
                    { text: "", correct_position: 1 },
                    { text: "", correct_position: 2 }
                ],
                correct_answer: question.correct_answer || ""
            });
            setCategoryValue(question.category)
        }
    }, [question]);

    const handleChange = (field, value) => {
        if (field === "type") {
            // Reset form for the new question type
            setFormData({
                ...formData,
                type: value,
                ...(questionTypes[value].template)
            });
            return;
        }

        setFormData({
            ...formData,
            [field]: value
        });
    };

    const handleOptionChange = (index, field, value) => {
        const updatedOptions = [...formData.options];
        updatedOptions[index] = {
            ...updatedOptions[index],
            [field]: field === "is_correct" ? value === "Benar" : value
        };

        setFormData({
            ...formData,
            options: updatedOptions
        });
    };

    const handleDragItemChange = (index, field, value) => {
        const updatedItems = [...formData.drag_items];
        updatedItems[index] = {
            ...updatedItems[index],
            [field]: field === "correct_position" ? parseInt(value, 10) : value
        };

        setFormData({
            ...formData,
            drag_items: updatedItems
        });
    };

    const handleAddOption = () => {
        setFormData({
            ...formData,
            options: [
                ...formData.options,
                { option_text: "", is_correct: false }
            ]
        });
    };

    const handleAddDragItem = () => {
        const newPosition = formData.drag_items.length + 1;
        setFormData({
            ...formData,
            drag_items: [
                ...formData.drag_items,
                { text: "", correct_position: newPosition }
            ]
        });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.question_text.trim()) {
            newErrors.question_text = "Pertanyaan harus diisi";
        }

        if (formData.type === "multiple_choice") {
            if (!formData.options.some(opt => opt.is_correct)) {
                newErrors.options = "Minimal satu jawaban harus benar";
            }

            formData.options.forEach((opt, idx) => {
                if (!opt.option_text.trim()) {
                    newErrors[`option_${idx}`] = "Opsi harus diisi";
                }
            });
        }

        else if (formData.type === "drag_and_drop") {
            formData.drag_items.forEach((item, idx) => {
                if (!item.text.trim()) {
                    newErrors[`drag_item_${idx}`] = "Item harus diisi";
                }
            });
        }

        else if (formData.type === "fill_in_blank") {
            // if (!formData.question_text.includes("___")) {
            //     newErrors.question_text = "Pertanyaan harus mengandung ___ sebagai bagian kosong";
            // }

            if (!formData.correct_answer.trim()) {
                newErrors.correct_answer = "Jawaban benar harus diisi";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const apiData = {
            ...formData,
            category: categoryValue,
            question_type:
                formData.type === "multiple_choice"
                    ? "radio"
                    : formData.type === "drag_and_drop"
                        ? "drag_drop"
                        : "fill_blank",
            question_text: formData.question_text,
            correct_answer: formData.type === "fill_in_blank" ? formData.correct_answer : undefined,
            options: formData.type === "multiple_choice" ? formData.options : undefined,
            drag_items: formData.type === "drag_and_drop" ? formData.drag_items : undefined,
        };

        delete apiData.type

        onSave(apiData);
    };


    const renderFormContent = () => {
        if (formData.type === "multiple_choice") {
            return (
                <>
                    <Box sx={{ display: "flex", flexDirection: "column", mt: 2, gap: 2 }}>
                        {formData.options.map((option, index) => (
                            <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <InputBase
                                    fullWidth
                                    placeholder={`Pilihan Jawaban ${index + 1}`}
                                    value={option.option_text}
                                    onChange={(e) => handleOptionChange(index, "option_text", e.target.value)}
                                    sx={{
                                        flex: 1,
                                        borderRadius: 1,
                                        border: "1px solid #e0e0e0",
                                        p: 1
                                    }}
                                />

                                <Select
                                    value={option.is_correct ? "Benar" : "Salah"}
                                    onChange={(e) => handleOptionChange(index, "is_correct", e.target.value)}
                                    displayEmpty
                                    sx={{
                                        minWidth: 120,
                                        height: 40,
                                        borderRadius: 1,
                                        boxShadow: "none",
                                        ".MuiOutlinedInput-notchedOutline": {
                                            border: "1px solid #e0e0e0"
                                        }
                                    }}
                                >
                                    <MenuItem value="Salah">Salah</MenuItem>
                                    <MenuItem value="Benar">Benar</MenuItem>
                                </Select>

                                {index === formData.options.length - 1 && (
                                    <IconButton
                                        onClick={handleAddOption}
                                        size="small"
                                    >
                                        <AddIcon />
                                    </IconButton>
                                )}
                            </Box>
                        ))}
                    </Box>
                </>
            );
        }

        if (formData.type === "fill_in_blank") {
            return (
                <Box sx={{ mt: 2 }}>
                    <InputBase
                        fullWidth
                        placeholder="Masukkan Jawaban"
                        value={formData.correct_answer}
                        onChange={(e) => handleChange("correct_answer", e.target.value)}
                        sx={{
                            borderBottom: "1px solid #e0e0e0",
                            py: 1
                        }}
                    />
                </Box>
            );
        }

        if (formData.type === "drag_and_drop") {
            return (
                <Box sx={{ display: "flex", flexDirection: "column", mt: 2, gap: 2 }}>
                    {formData.drag_items.map((item, index) => (
                        <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                            <InputBase
                                fullWidth
                                placeholder={`Item ${index + 1}`}
                                value={item.text}
                                onChange={(e) => handleDragItemChange(index, "text", e.target.value)}
                                sx={{
                                    flex: 1,
                                    borderBottom: "1px solid #e0e0e0",
                                    py: 1
                                }}
                            />

                            <Box sx={{ display: "flex", alignItems: "center", minWidth: 120 }}>
                                <Typography sx={{ mr: 2, color: "#666" }}>
                                    Posisi
                                </Typography>

                                <Select
                                    value={item.correct_position}
                                    onChange={(e) => handleDragItemChange(index, "correct_position", e.target.value)}
                                    size="small"
                                    sx={{
                                        minWidth: 70,
                                        ".MuiOutlinedInput-notchedOutline": {
                                            border: "1px solid #e0e0e0"
                                        }
                                    }}
                                >
                                    {formData.drag_items.map((_, i) => (
                                        <MenuItem key={i} value={i + 1}>{i + 1}</MenuItem>
                                    ))}
                                </Select>
                            </Box>

                            {index === formData.drag_items.length - 1 && (
                                <IconButton
                                    sx={{ ml: 1 }}
                                    size="small"
                                    onClick={handleAddDragItem}
                                >
                                    <AddIcon />
                                </IconButton>
                            )}
                        </Box>
                    ))}
                </Box>
            );
        }

        return null;
    };

    return (
        <Box sx={{ width: "100%", bgcolor: "#f5f5f5", p: 2 }}>
            {/* Category field */}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center"
                }}
            >
                <Typography sx={{ color: "#555", fontWeight: 500,  width: 120 }}>
                    Kategori Soal
                </Typography>
                <Tooltip arrow title="Gunakan kategori untuk mengelompokkan soal sesuai topik atau materi" placement="right">
                  <InfoOutlined />
                </Tooltip>
                <InputBase
                    placeholder="Masukkan Kategori Soal"
                    fullWidth
                    value={categoryValue}
                    onChange={(e) => setCategoryValue(e.target.value)}
                    sx={{ ml: 1 }}
                />
            </Paper>

            {/* Main form */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 1, mb: 2 }}>
                <Typography sx={{ color: "#F39C12", fontWeight: 700, fontSize: 20, mb: 2 }}>
                    Buat Soal
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 3, }}>
                    <Typography sx={{ color: "#555",}}>
                        Tipe Soal {"  "}
                    </Typography>
                    <Tooltip sx={{mr: 2}} arrow title="Pilih jenis soal: Pilihan Ganda, Drag & Drop, atau Isian Singkat." placement="right">
                        <InfoOutlined />
                    </Tooltip>

                    <Select
                        value={formData.type}
                        onChange={(e) => handleChange("type", e.target.value)}
                        sx={{
                            minWidth: 200,
                            height: 44,
                            bgcolor: "#003366",
                            color: "#fff",
                            borderRadius: 1,
                            ".MuiOutlinedInput-notchedOutline": { border: 0 },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: 0 },
                            "& .MuiSvgIcon-root": { color: "#fff" }
                        }}
                        MenuProps={{
                            PaperProps: {
                                sx: { maxHeight: 200 }
                            }
                        }}
                    >
                        <MenuItem value="multiple_choice">Pilihan Ganda</MenuItem>
                        <MenuItem value="fill_in_blank">Fill in the blank</MenuItem>
                        <MenuItem value="drag_and_drop">Drag & Drop</MenuItem>
                    </Select>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <InputBase
                        fullWidth
                        multiline
                        minRows={2}
                        placeholder="Pertanyaan"
                        value={formData.question_text}
                        onChange={(e) => handleChange("question_text", e.target.value)}
                        sx={{
                            p: 2,
                            border: "1px solid #e0e0e0",
                            borderRadius: 1
                        }}
                    />
                </Box>

                {renderFormContent()}

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{
                            bgcolor: "#003366",
                            borderRadius: 1,
                            textTransform: "none",
                            px: 3,
                            "&:hover": { bgcolor: "#002855" }
                        }}
                    >
                        Simpan Soal
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default QuestionForm;