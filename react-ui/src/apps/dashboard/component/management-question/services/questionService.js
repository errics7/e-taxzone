import axios from "axios";
import API from "../../../../../utils/host.config";

const getToken = () => localStorage.getItem("xtoken") || localStorage.getItem("token");

const authHeaders = () => ({
    headers: {
        Authorization: `Bearer ${getToken()}`
    }
});

// Get classes for scheduling
export const getClasses = async () => {
    const response = await axios.get(`${API.HOST}/api/v2/users/classes`, authHeaders());
    return response.data;
};

// Get questions by worksheet ID
export const fetchQuestions = async (worksheetId) => {
    const response = await axios.get(`${API.HOST}/api/v2/questions/${worksheetId}`, authHeaders());

    if (response.data.success) {
        return response.data.data.map((q) => ({
            id: q.id,
            question_text: q.title,
            type: q.question_type === "radio" ? "multiple_choice" : q.question_type === 'fill_blank' ? 'fill_blank' : "drag_and_drop",
            ...q,
            options:
                q.options?.map((opt) => ({
                    option_text: opt.option_text,
                    is_correct: opt.is_correct === 1
                })) || [],
            drag_items:
                q.drag_items?.map((item) => ({
                    text: item.item_text,
                    correct_target: item.correct_target
                })) || []
        }));
    }

    throw new Error("Gagal mengambil data soal");
};

// Create new question
export const createQuestion = async (payload) => {
    const response = await axios.post(`${API.HOST}/api/v2/questions/create`, payload, authHeaders());
    return response.data;
};

// Update question
export const updateQuestion = async (id, payload) => {
    const response = await axios.put(`${API.HOST}/api/v2/questions/${id}`, payload, authHeaders());
    return response.data;
};

// Delete question
export const deleteQuestion = async (id) => {
    const response = await axios.delete(`${API.HOST}/api/v2/questions/${id}`, authHeaders());
    return response.data;
};

// Schedule worksheet
export const scheduleWorksheet = async (scheduleData) => {
    const response = await axios.post(`${API.HOST}/api/v2/questions/schedule`, scheduleData, authHeaders());
    return response.data;
};

// Get worksheet schedules
export const getWorksheetDetails = async (worksheetId) => {
    const response = await axios.get(`${API.HOST}/api/v2/questions/schedules/${worksheetId}`, authHeaders());
    return response.data;
};

// Delete a worksheet schedule
export const deleteWorksheetSchedule = async (scheduleId) => {
    const response = await axios.delete(`${API.HOST}/api/v2/questions/schedules/${scheduleId}`, authHeaders());
    return response.data;
};
