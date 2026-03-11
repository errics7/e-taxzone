import React, { useState, useEffect, Suspense, lazy, useRef } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import API from "../../../utils/host.config";
import { UEQQuestionnaire } from "./Questionnaire";
import { useLoggedInUser } from "../../../hooks/useUser";
import OtpInput from "./CustomOTP";
import Mapel from "../assets/default-mapel.svg";
import { LazyLoadImage } from "react-lazy-load-image-component";
import useTourGuide from "../../../hooks/useTourGuide";
import TourGuide from "./tour/TourGuide";

// Lazy load the DragDropQuestion component
const DragDropQuestion = lazy(() => import("./DragDropQuestion"));

const tourSteps = [
    {
        target: '.quiz-info-panel',
        title: 'Panel Informasi Kuis',
        content: 'Di sini Anda dapat melihat mata pelajaran dan navigasi nomor soal. Klik nomor soal untuk langsung ke soal tersebut.',
        placement: 'right'
    },
    {
        target: '.quiz-timer',
        title: 'Timer Kuis',
        content: 'Waktu tersisa untuk mengerjakan kuis. Perhatikan waktu agar tidak kehabisan waktu.',
        placement: 'bottom'
    },
    {
        target: '.question-content',
        title: 'Area Soal',
        content: 'Baca soal dengan teliti dan pilih atau isi jawaban sesuai dengan jenis soal.',
        placement: 'top'
    },
    {
        target: '.navigation-buttons',
        title: 'Navigasi Soal',
        content: 'Gunakan tombol ini untuk berpindah antar soal. Klik "Selesai" jika sudah yakin dengan semua jawaban.',
        placement: 'top'
    }
];

// Fetcher function to get quiz data
const fetcher = async (url) => {
    const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("xtoken")}` }
    });

    if (response.data.success) {
        return response.data.data;
    }

    throw new Error("Failed to fetch quiz data");
};

// Submit Confirmation Modal Component - Modified to show validation error
const SubmitConfirmationModal = ({ onConfirm, onCancel, disabled, unansweredCount }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
                <div className="text-center">
                    <center>
                        <LazyLoadImage
                            src={Mapel}
                            alt="mapel"
                            className="max-w-40v"
                        />
                    </center>
                    {unansweredCount > 0 ? (
                        <>
                            <h2 className="text-2xl font-bold my-4 text-red-600">Peringatan!</h2>
                            <p className="mb-6 text-red-600">
                                Masih ada <strong>{unansweredCount} soal</strong> yang belum dijawab. 
                                Mohon jawab semua soal terlebih dahulu sebelum mengumpulkan kuis.
                            </p>
                            <button
                                className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                                onClick={onCancel}
                            >
                                Kembali ke Soal
                            </button>
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold my-4">Yakin Menyelesaikan Kuis ?</h2>
                            <p className="mb-6">Pastikan Anda telah menjawab semua pertanyaan. Setelah dikumpulkan, Anda tidak dapat mengubah jawaban.</p>

                            <div className="flex gap-3">
                                <button
                                    className="w-full px-4 py-2 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400"
                                    onClick={onCancel}
                                    disabled={disabled}
                                >
                                    Kembali ke Soal
                                </button>
                                <button
                                    className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                                    onClick={onConfirm}
                                    disabled={disabled}
                                >
                                    {disabled ? "Memuat..." : "Ya, Akhiri Kuis"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// Time's Up Modal Component - Fixed to auto-submit
const TimesUpModal = ({ onSubmit, submitting }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
                <div className="text-center">
                    <div className="text-5xl mb-4">⏰</div>
                    <h2 className="text-2xl font-bold mb-4">Waktu Pengerjaan Habis!</h2>
                    <p className="mb-6">Waktu pengerjaan kuis sudah berakhir. Jawaban Anda akan langsung disimpan.</p>

                    <button
                        className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                        onClick={onSubmit}
                        disabled={submitting}
                    >
                        {submitting ? "MENYIMPAN..." : "SIMPAN"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Timer component with countdown to end_time
const QuizTimer = ({ endTime, onTimeUp }) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const [isPulsing, setIsPulsing] = useState(false);

    useEffect(() => {
        if (!endTime) return;

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const end = new Date(endTime).getTime();
            return Math.max(0, Math.floor((end - now) / 1000));
        };

        // Set initial time
        setTimeLeft(calculateTimeLeft());

        // Update timer every second
        const timer = setInterval(() => {
            const remaining = calculateTimeLeft();
            setTimeLeft(remaining);

            if (remaining <= 0) {
                clearInterval(timer);
                if (onTimeUp) onTimeUp();
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [endTime, onTimeUp]);

    // Set pulsing animation when less than 5 minutes remaining
    useEffect(() => {
        setIsPulsing(timeLeft < 300);
    }, [timeLeft]);

    // Format time display (hours:minutes:seconds)
    const formattedTime = () => {
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    };

    return (
        <div className={`${isPulsing ? 'animate-pulse' : ''}`}>
            <div className={`inline-flex items-center px-3 py-1 rounded-full 
        ${timeLeft < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{formattedTime()}</span>
            </div>
        </div>
    );
};

// Main Quiz Component
const QuizUI = () => {
    const { id: worksheetId, code } = useParams();
    const [quizData, setQuizData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeExpired, setTimeExpired] = useState(false);
    const [quistionnaireOpen, setQuistionnaireOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const history = useHistory();
    const user = useLoggedInUser();
    const preventCopyRef = useRef(null);

    // Local storage key for this quiz
    const storageKey = `quiz_${worksheetId}_state`;

    // Format the saved answers to match the API's expected format
    const formatAnswersForAPI = () => {
        return Object.keys(answers).map(questionId => {
            const question = quizData.questions.find(q => q.id.toString() === questionId.toString());
            const answer = answers[questionId];

            // Format differently based on question type
            if (question.question_type === "drag_drop" && Array.isArray(answer)) {
                // For drag and drop questions, format as expected by the API
                return {
                    question_id: parseInt(questionId),
                    answer: answer.map((target, index) => ({
                        item_id: question.drag_items[index].id.toString(),
                        target: (parseInt(target) + 1).toString()
                    }))
                };
            } else if (question.question_type === "radio") {
                // For radio questions, get the actual option id
                return {
                    question_id: parseInt(questionId),
                    answer: question.options[answer]?.id?.toString() || answer.toString()
                };
            } else {
                // For other question types (fill_blank, etc.)
                return {
                    question_id: parseInt(questionId),
                    answer: answer
                };
            }
        });
    };

    // Fixed: Format the API's expected format back to our internal format for localStorage
    const formatAnswersFromStorage = (rawAnswers, questions) => {
        const formattedAnswers = {};

        if (!rawAnswers || !questions) return formattedAnswers;

        Object.keys(rawAnswers).forEach(questionId => {
            const questionData = questions.find(q => q.id.toString() === questionId.toString());
            const savedAnswer = rawAnswers[questionId];

            if (!questionData) return;

            if (questionData.question_type === "radio") {
                // For radio buttons, store the index of the selected option
                if (typeof savedAnswer === 'number') {
                    formattedAnswers[questionId] = savedAnswer;
                } else {
                    // If stored as option id, find the index
                    const optionIndex = questionData.options.findIndex(
                        opt => opt.id.toString() === savedAnswer.toString()
                    );
                    formattedAnswers[questionId] = optionIndex >= 0 ? optionIndex : savedAnswer;
                }
            } else if (questionData.question_type === "drag_drop") {
                // For drag and drop, ensure proper format
                if (Array.isArray(savedAnswer)) {
                    if (savedAnswer.length > 0 && typeof savedAnswer[0] === 'object') {
                        // Convert from API format to internal format
                        const dragTargets = new Array(questionData.drag_items.length).fill("");
                        savedAnswer.forEach(item => {
                            const itemIndex = questionData.drag_items.findIndex(
                                dragItem => dragItem.id.toString() === item.item_id.toString()
                            );
                            if (itemIndex >= 0) {
                                dragTargets[itemIndex] = item.target.toString();
                            }
                        });
                        formattedAnswers[questionId] = dragTargets;
                    } else {
                        // Already in the expected format
                        formattedAnswers[questionId] = savedAnswer;
                    }
                } else {
                    // Initialize with empty array if not valid
                    formattedAnswers[questionId] = new Array(questionData.drag_items?.length || 0).fill("");
                }
            } else if (questionData.question_type === "fill_blank") {
                // Fixed: Handle fill_blank questions properly
                formattedAnswers[questionId] = savedAnswer || "";
            } else {
                // For other types, store as-is
                formattedAnswers[questionId] = savedAnswer;
            }
        });

        return formattedAnswers;
    };

    // Fixed: Save current quiz state to localStorage - save all answer types
    const saveQuizState = () => {
        if (!quizData) return;

        try {
            const quizState = {
                answers: answers, // Save answers directly without formatting
                lastUpdated: new Date().toISOString(),
                completed: quistionnaireOpen,
                page
            };

            localStorage.setItem(storageKey, JSON.stringify(quizState));
            console.log("Quiz state saved:", quizState); // Debug log
        } catch (error) {
            console.error("Error saving quiz state to localStorage:", error);
        }
    };

    // Load saved quiz state from localStorage
    const loadQuizState = () => {
        try {
            const savedState = localStorage.getItem(storageKey);
            if (!savedState) return null;

            const parsedState = JSON.parse(savedState);
            console.log("Quiz state loaded:", parsedState); // Debug log
            return parsedState;
        } catch (error) {
            console.error("Error loading quiz state from localStorage:", error);
            return null;
        }
    };

    // Fetch quiz data
    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                setLoading(true);
                const data = await fetcher(`${API.HOST}/api/v2/questions/mhs/${worksheetId}`);
                setQuizData(data);

                // Check if quiz has already been completed
                const savedState = loadQuizState();
                if (savedState) {
                    // Check if quiz was completed
                    if (savedState.completed) {
                        setQuistionnaireOpen(true);
                    } else {
                        // Fixed: Restore saved answers properly
                        if (savedState.answers) {
                            const restoredAnswers = formatAnswersFromStorage(savedState.answers, data.questions);
                            setAnswers(restoredAnswers);
                            console.log("Answers restored:", restoredAnswers); // Debug log
                        }

                        // Restore page position
                        if (typeof savedState.page === 'number') {
                            setPage(savedState.page);
                        }
                    }
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizData();
    }, [worksheetId]);

    // Save quiz state to localStorage whenever answers change
    useEffect(() => {
        if (quizData) { // Only save when quiz data is loaded
            saveQuizState();
        }
    }, [answers, page, quistionnaireOpen, quizData]);

    // Prevent leaving the exam
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            const message = "Anda yakin ingin meninggalkan halaman? Jawaban Anda mungkin tidak tersimpan.";
            e.returnValue = message;
            return message;
        };

        // Prevent copy paste
        const handleCopy = (e) => {
            e.preventDefault();
            return false;
        };

        const handleContextMenu = (e) => {
            e.preventDefault();
            return false;
        };

        // Add event listeners
        window.addEventListener("beforeunload", handleBeforeUnload);
        document.addEventListener("copy", handleCopy);
        document.addEventListener("paste", handleCopy);
        document.addEventListener("contextmenu", handleContextMenu);

        if (preventCopyRef.current) {
            preventCopyRef.current.addEventListener("selectstart", (e) => {
                if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
                    e.preventDefault();
                }
            });
        }

        // Cleanup event listeners on unmount
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            document.removeEventListener("copy", handleCopy);
            document.removeEventListener("paste", handleCopy);
            document.removeEventListener("contextmenu", handleContextMenu);
        };
    }, []);

    const {
        showTour,
        currentStep,
        totalSteps,
        currentStepData,
        progress,
        isFirstStep,
        isLastStep,
        handleNext: handleTourNext,
        handlePrev: handleTourPrev,
        handleSkip,
        getTooltipPosition
    } = useTourGuide('quiz_tour', tourSteps, [!loading && quizData]);

    const handleAnswerChange = (questionId, newAnswer) => {
        setAnswers(prev => {
            const updated = {
                ...prev,
                [questionId]: newAnswer
            };
            console.log("Answer changed:", questionId, newAnswer, updated); // Debug log
            return updated;
        });
    };

    // Fixed: Handle time up to automatically submit
    const handleTimeUp = () => {
        setTimeExpired(true);
        // Auto-submit immediately when time is up
        submitAnswers();
    };

    const submitAnswers = async () => {
        if (submitting) return;

        try {
            setSubmitting(true);

            // Format answers for API submission
            const formattedAnswers = formatAnswersForAPI();

            // Get student information
            const studentId = user.value._id;
            const teacherId = quizData.schedule.teacher_id;

            const payload = {
                student_id: studentId,
                worksheet_id: parseInt(worksheetId),
                worksheet_schedule_id: quizData.schedule.id,
                // teacher_id: teacherId,
                answers: formattedAnswers
            };

            console.log("Submitting answers:", payload); // Debug log

            // Submit answers to API
            const response = await axios.post(
                `${API.HOST}/api/v2/questions/submit-answers`,
                payload,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("xtoken")}` }
                }
            );

            if (response.data.success) {
                // Update quiz state as completed
                const quizState = {
                    answers,
                    lastUpdated: new Date().toISOString(),
                    completed: true,
                    page
                };

                localStorage.setItem(storageKey, JSON.stringify(quizState));
                setTimeExpired(false);
                setQuistionnaireOpen(true);
            } else {
                alert(response.data.message || "Gagal mengumpulkan jawaban");
            }
        } catch (err) {
            console.error("Error submitting answers:", err);
            alert(err.response?.data?.message || "Terjadi kesalahan saat mengumpulkan jawaban");
        } finally {
            setSubmitting(false);
            setShowConfirmModal(false);
        }
    };

    // NEW: Function to count unanswered questions
    const getUnansweredCount = () => {
        if (!quizData) return 0;
        
        return quizData.questions.filter(question => !isQuestionAnswered(question)).length;
    };

    // NEW: Function to check if all questions are answered
    const areAllQuestionsAnswered = () => {
        return getUnansweredCount() === 0;
    };

    const handleSubmit = () => {
        // Check if all questions are answered
        const unansweredCount = getUnansweredCount();
        
        // Always show modal - it will handle validation internally
        setShowConfirmModal(true);
    };

    const confirmSubmit = () => {
        // Double check before actual submission
        if (areAllQuestionsAnswered() || timeExpired) {
            submitAnswers();
        } else {
            // This shouldn't happen due to modal validation, but keeping as safety
            setShowConfirmModal(false);
        }
    };

    const cancelSubmit = () => {
        setShowConfirmModal(false);
    };

    const handleNext = () => {
        if (page < quizData.questions.length - 1) {
            setPage(page + 1);
        } else {
            handleSubmit();
        }
    };

    const handlePrevious = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    // Fixed: Check if a question is answered - handle all question types
    const isQuestionAnswered = (question) => {
        const answer = answers[question.id];
        
        if (answer === undefined || answer === null) return false;

        if (question.question_type === "fill_blank") {
            return typeof answer === 'string' && answer.trim() !== "";
        }

        if (question.question_type === "drag_drop") {
            return Array.isArray(answer) && !answer.includes("");
        }

        if (question.question_type === "radio") {
            return typeof answer === 'number' && answer >= 0;
        }

        // For other types
        return !Array.isArray(answer) || !answer.includes("");
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center h-80vh">
                <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="p-4 text-center max-w-md mx-auto">
                <p className="text-red-500 font-medium">Gagal memuat soal</p>
                <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() => history.goBack()}
                >
                    Kembali
                </button>
            </div>
        );
    }

    // Questionnaire state
    if (quistionnaireOpen) {
        return <UEQQuestionnaire worksheetId={worksheetId} code={code} />;
    }

    // Generate question number buttons
    const renderQuestionNumbers = () => {
        return quizData.questions.map((question, i) => {
            const isActive = i === page;
            const isAnswered = isQuestionAnswered(question);

            return (
                <button
                    key={i}
                    className={`w-8 h-8 rounded-md text-sm text-white font-medium flex items-center justify-center
            ${isActive ? 'bg-[#EFA929]' :
                            isAnswered ? 'bg-[#27194B]' : 'bg-[#E3E3E3]'}`}
                    onClick={() => setPage(i)}
                >
                    {i + 1}
                </button>
            );
        });
    };

    // Render multiple choice question
    const renderMultipleChoice = (question) => {
        const currentAnswer = answers[question.id];

        return (
            <div className="space-y-3">
                {question.options.map((option, index) => (
                    <div
                        key={index}
                        className={`border rounded-md p-4 cursor-pointer transition-all
              ${currentAnswer === index ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
                        onClick={() => handleAnswerChange(question.id, index)}
                    >
                        <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center
                ${currentAnswer === index ? 'bg-green-500' : 'border border-gray-300'}`}>
                                {currentAnswer === index && (
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                )}
                            </div>
                            <span>{option.option_text}</span>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const currentQuestion = quizData.questions[page];
    const unansweredCount = getUnansweredCount();

    return (
        <>
            <div ref={preventCopyRef} className="flex p-4 gap-6">
                {/* Submit Confirmation Modal - Modified to show validation */}
                {showConfirmModal && (
                    <SubmitConfirmationModal
                        onConfirm={confirmSubmit}
                        onCancel={cancelSubmit}
                        disabled={submitting}
                        unansweredCount={unansweredCount}
                    />
                )}

                {/* Time's Up Modal - Fixed to show submitting state */}
                {timeExpired && (
                    <TimesUpModal 
                        onSubmit={submitAnswers} 
                        submitting={submitting}
                    />
                )}

                {/* Left panel - Question numbers */}
                <div className="bg-white rounded-lg shadow-md p-5 h-fit min-h-96 quiz-info-panel">
                    <div className="text-center font-medium pb-3 border-b border-gray-200 mb-3">
                        {quizData?.schedule?.mapel}
                    </div>

                    <div className="mb-2 text-sm text-gray-600">Nomor Soal</div>

                    {/* NEW: Show progress indicator */}
                    <div className="mb-3 text-xs text-gray-500">
                        Dijawab: {quizData.questions.length - unansweredCount}/{quizData.questions.length}
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                        {renderQuestionNumbers()}
                    </div>
                </div>

                {/* Right panel - Question content */}
                <div className="bg-white rounded-lg shadow-md p-6 flex-1">
                    <div className="flex justify-between items-center mb-8">
                        <div className="text-lg font-medium">SOAL NO {page + 1}.</div>
                        <div className="quiz-timer">
                            <QuizTimer
                                endTime={quizData.schedule.end_time}
                                onTimeUp={handleTimeUp}
                            />
                        </div>
                    </div>

                    <div className="mb-6 question-content">
                        <p className="text-base mb-4">{currentQuestion.title}</p>

                        {currentQuestion.question_type === "radio" ? (
                            renderMultipleChoice(currentQuestion)
                        ) : currentQuestion.question_type === 'fill_blank' ?
                            <OtpInput
                                length={currentQuestion?.answer_length}
                                value={answers[currentQuestion.id] || ""}
                                onChange={(newAnswer) => handleAnswerChange(currentQuestion.id, newAnswer)}
                            />
                            : (
                                <Suspense fallback={<div>Loading...</div>}>
                                    <DragDropQuestion
                                        question={{
                                            id: currentQuestion.id,
                                            question_text: currentQuestion.title,
                                            drag_items: currentQuestion.drag_items?.map(item => ({
                                                text: item.item_text
                                            })) || []
                                        }}
                                        answer={answers[currentQuestion.id] || new Array(currentQuestion.drag_items?.length || 0).fill("")}
                                        onAnswerChange={(newAnswer) => handleAnswerChange(currentQuestion.id, newAnswer)}
                                    />
                                </Suspense>
                            )}
                    </div>

                    <div className="flex justify-between mt-10 navigation-buttons">
                        <button
                            className="flex items-center px-4 py-2 text-blue-600 font-medium"
                            onClick={handlePrevious}
                            disabled={page === 0}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 w-4 h-4">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                            Sebelumnya
                        </button>

                        <button
                            className="flex items-center px-5 py-2 bg-blue-600 text-white rounded-md font-medium"
                            onClick={handleNext}
                        >
                            {page < quizData.questions.length - 1 ? 'Selanjutnya' : 'Selesai'}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 w-4 h-4">
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <TourGuide
                show={showTour}
                currentStep={currentStep}
                totalSteps={totalSteps}
                stepData={currentStepData}
                onNext={handleTourNext}
                onPrev={handleTourPrev}
                onSkip={handleSkip}
                isFirstStep={isFirstStep}
                isLastStep={isLastStep}
                progress={progress}
                getTooltipPosition={getTooltipPosition}
            />
        </>
    );
};

export default QuizUI;