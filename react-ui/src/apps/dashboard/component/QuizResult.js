import React, { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import API from "../../../utils/host.config";
import { useLoggedInUser } from "../../../hooks/useUser";
import { ArrowLeft, CheckCircle, Close, CrisisAlertRounded, ExpandLess, ExpandMore, EmojiEvents, Psychology, TrendingUp } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

const QuizResult = () => {
    const { id: worksheetId } = useParams();
    const [resultData, setResultData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState("wrong");
    const [expandedSection, setExpandedSection] = useState(null);
    const [showCelebration, setShowCelebration] = useState(false);
    const [animateStats, setAnimateStats] = useState(false);
    const navigate = useHistory();
    const user = useLoggedInUser();

    useEffect(() => {
        const fetchResultData = async () => {
            try {
                setLoading(true);
                const studentId = user.value._id;

                if (!studentId) {
                    throw new Error("Data siswa tidak ditemukan");
                }

                const response = await axios.get(`${API.HOST}/api/v2/student-result`, {
                    params: {
                        student_id: studentId,
                        worksheet_id: worksheetId
                    },
                    headers: { Authorization: `Bearer ${localStorage.getItem("xtoken")}` }
                });

                if (response.data.success) {
                    setResultData(response.data.data);
                    // Trigger animations after data loads
                    setTimeout(() => setAnimateStats(true), 500);
                    const score = Math.round((response.data.data.correct_count / (response.data.data.correct_count + response.data.data.wrong_count)) * 100);
                    if (score >= 80) {
                        setTimeout(() => setShowCelebration(true), 1000);
                        setTimeout(() => setShowCelebration(false), 4000);
                    }
                } else {
                    throw new Error(response.data.message || "Gagal memuat data hasil");
                }
            } catch (err) {
                console.error("Error fetching result:", err);
                setError(err.message || "Terjadi kesalahan saat memuat data hasil");
            } finally {
                setLoading(false);
            }
        };

        fetchResultData();
    }, [worksheetId, user]);

    const handleReturn = () => {
        navigate.push("/home");
    };

    const toggleSection = (questionId) => {
        setExpandedSection(expandedSection === questionId ? null : questionId);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calculateScore = () => {
        if (!resultData) return 0;
        const total = resultData.correct_count + resultData.wrong_count;
        return Math.round((resultData.correct_count / total) * 100);
    };

    const getMotivationalMessage = (score) => {
        if (score >= 90) {
            return {
                title: "🎉 LUAR BIASA! 🎉",
                message: "Kamu sangat hebat! Pertahankan semangat belajarmu!",
                color: "from-yellow-400 via-orange-400 to-red-400",
                bgGradient: "bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50",
                borderGradient: "bg-gradient-to-r from-yellow-400 to-orange-400",
                icon: <EmojiEvents className="w-10 h-10 text-yellow-600" />,
                particles: ["🎊", "🌟", "✨", "🎉", "⭐"] 
            };
        } else if (score >= 80) {
            return {
                title: "✨ EXCELLENT! ✨",
                message: "Hasil yang sangat memuaskan! Kamu benar-benar memahami materinya!",
                color: "from-emerald-400 via-green-400 to-teal-400",
                bgGradient: "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50",
                borderGradient: "bg-gradient-to-r from-emerald-400 to-green-400",
                icon: <EmojiEvents className="w-10 h-10 text-emerald-600" />,
                particles: ["🌟", "✨", "🎯", "💚", "🏆"] 
            };
        } else if (score >= 70) {
            return {
                title: "👍 Good Job!",
                message: "Bagus! Kamu sudah memahami sebagian besar materi. Sedikit lagi untuk sempurna!",
                color: "from-blue-400 via-cyan-400 to-indigo-400",
                bgGradient: "bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50",
                borderGradient: "bg-gradient-to-r from-blue-400 to-cyan-400",
                icon: <TrendingUp className="w-10 h-10 text-blue-600" />,
                particles: ["📈", "💙", "🔥", "💪", "⚡"] 
            };
        } else if (score >= 60) {
            return {
                title: "💪 Keep Going!",
                message: "Jangan menyerah! Setiap kesalahan adalah langkah menuju kesuksesan. Yuk belajar lagi!",
                color: "from-purple-400 via-pink-400 to-rose-400",
                bgGradient: "bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50",
                borderGradient: "bg-gradient-to-r from-purple-400 to-pink-400",
                icon: <Psychology className="w-10 h-10 text-purple-600" />,
                particles: ["💜", "🔮", "🌸", "💪", "🧠"] 
            };
        } else {
            return {
                title: "🌟 Semangat Terus!",
                message: "Tidak apa-apa! Setiap ahli pernah menjadi pemula. Mari kita pelajari lagi bersama-sama!",
                color: "from-orange-400 via-amber-400 to-yellow-400",
                bgGradient: "bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50",
                borderGradient: "bg-gradient-to-r from-orange-400 to-amber-400",
                icon: <Psychology className="w-10 h-10 text-orange-600" />,
                particles: ["🌟", "🧡", "📚", "💡", "🚀"] 
            };
        }
    };

    // Enhanced Loading state with modern spinner
    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-20 h-20 border-4 border-purple-200 border-b-purple-600 rounded-full animate-spin animate-reverse"></div>
                </div>
                <div className="mt-8 text-center">
                    <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
                        <div className="flex space-x-1 mr-3">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <p className="text-gray-700 font-semibold">Memuat hasil ujian...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Enhanced Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6">
                        <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mx-auto mb-4">
                            <CrisisAlertRounded className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white text-center">Oops!</h2>
                    </div>
                    <div className="p-8 text-center">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Terjadi Kesalahan</h3>
                        <p className="text-red-500 font-medium mb-6 bg-red-50 p-4 rounded-xl">{error}</p>
                        <button
                            className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold transition-all duration-300 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl hover:scale-105 transform"
                            onClick={handleReturn}
                        >
                            Kembali ke Beranda
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Enhanced No result found state
    if (!resultData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6">
                        <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mx-auto mb-4">
                            <CrisisAlertRounded className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white text-center">Tidak Ditemukan</h2>
                    </div>
                    <div className="p-8 text-center">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Data Tidak Ditemukan</h3>
                        <p className="text-gray-600 font-medium mb-6 bg-gray-50 p-4 rounded-xl">Hasil ujian yang Anda cari tidak ditemukan</p>
                        <button
                            className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold transition-all duration-300 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl hover:scale-105 transform"
                            onClick={handleReturn}
                        >
                            Kembali ke Beranda
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const score = calculateScore();
    const motivationalData = getMotivationalMessage(score);

    // Filter answers based on view mode
    const filteredAnswers = resultData.answers.filter(answer => {
        if (viewMode === "all") return true;
        if (viewMode === "wrong") return !answer.is_correct;
        if (viewMode === "correct") return answer.is_correct;
        return true;
    });

    const renderQuestionCard = (answer, index) => {
        const isExpanded = expandedSection === answer.question_id;
        const isCorrect = answer.is_correct;

        return (
            <div
                key={answer.question_id}
                className={`mb-6 rounded-2xl overflow-hidden transition-all duration-500 transform hover:scale-[1.02] ${isCorrect
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 shadow-green-100'
                        : 'bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 shadow-red-100'
                    } ${isExpanded ? 'shadow-2xl' : 'shadow-lg'}`}
            >
                {/* Question header - always visible */}
                <div
                    className={`px-6 py-5 flex items-center justify-between cursor-pointer transition-all duration-300 ${isCorrect
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200'
                            : 'bg-gradient-to-r from-red-100 to-rose-100 hover:from-red-200 hover:to-rose-200'
                        }`}
                    onClick={() => toggleSection(answer.question_id)}
                >
                    <div className="flex items-center">
                        <div className={`flex items-center justify-center rounded-full w-12 h-12 mr-4 font-bold text-lg transition-all duration-300 ${isCorrect
                                ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg'
                                : 'bg-gradient-to-br from-red-400 to-rose-500 text-white shadow-lg'
                            }`}>
                            {index + 1}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-2">
                                {answer.question_text}
                            </h3>
                            <div className="flex items-center">
                                {isCorrect ? (
                                    <span className="flex items-center text-sm font-medium text-green-700 bg-green-200 px-3 py-1 rounded-full">
                                        <CheckCircle className="w-4 h-4 mr-2" /> Jawaban Benar
                                    </span>
                                ) : (
                                    <span className="flex items-center text-sm font-medium text-red-700 bg-red-200 px-3 py-1 rounded-full">
                                        <Close className="w-4 h-4 mr-2" /> Jawaban Salah
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={`p-2 rounded-full transition-all duration-300 ${isExpanded ? 'bg-white/50 rotate-180' : 'bg-white/30 hover:bg-white/50'
                        }`}>
                        <ExpandMore className="w-6 h-6 text-gray-600" />
                    </div>
                </div>

                {/* Question details - visible when expanded */}
                {isExpanded && (
                    <div className="bg-white/80 backdrop-blur-sm p-6 border-t border-gray-200">
                        <div className="mb-6">
                            <h4 className="font-semibold text-gray-800 mb-3 text-lg">📝 Pertanyaan:</h4>
                            <div className="p-4 bg-gray-50 rounded-xl border-l-4 border-blue-400">
                                <p className="text-gray-800 leading-relaxed">{answer.question_text}</p>
                            </div>
                        </div>

                        {/* Multiple choice question */}
                        {answer.question_type === "radio" && (
                            <div className="mt-6">
                                <h4 className="font-semibold text-gray-800 mb-4 text-lg">🔘 Pilihan Jawaban:</h4>
                                <div className="space-y-3">
                                    {answer.options && answer.options.map((option) => {
                                        const isUserAnswer = option.id.toString() === answer.user_answer;
                                        const isCorrectAnswer = option.id.toString() === answer.correct_answer;

                                        let optionClass = "p-4 rounded-xl border-2 transition-all duration-300 ";
                                        if (isUserAnswer && isCorrectAnswer) {
                                            optionClass += "bg-gradient-to-r from-green-100 to-emerald-100 border-green-400 shadow-lg";
                                        } else if (isUserAnswer && !isCorrectAnswer) {
                                            optionClass += "bg-gradient-to-r from-red-100 to-rose-100 border-red-400 shadow-lg";
                                        } else if (isCorrectAnswer) {
                                            optionClass += "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-md";
                                        } else {
                                            optionClass += "bg-gray-50 border-gray-200";
                                        }

                                        return (
                                            <div key={option.id} className={optionClass}>
                                                <div className="flex items-center">
                                                    {isUserAnswer && isCorrectAnswer && (
                                                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3 shadow-lg">
                                                            <CheckCircle className="w-5 h-5 text-white" />
                                                        </div>
                                                    )}
                                                    {isUserAnswer && !isCorrectAnswer && (
                                                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3 shadow-lg">
                                                            <Close className="w-5 h-5 text-white" />
                                                        </div>
                                                    )}
                                                    {!isUserAnswer && isCorrectAnswer && (
                                                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3 shadow-lg">
                                                            <CheckCircle className="w-5 h-5 text-white" />
                                                        </div>
                                                    )}
                                                    {!isUserAnswer && !isCorrectAnswer && (
                                                        <div className="w-8 h-8 border-2 border-gray-300 rounded-full mr-3"></div>
                                                    )}
                                                    <span className="font-medium text-gray-800">{option.option_text}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Drag and drop question */}
                        {answer.question_type === "drag_drop" && (
                            <div className="mt-6">
                                <h4 className="font-semibold text-gray-800 mb-4 text-lg">🎯 Jawaban Anda:</h4>
                                <div className="space-y-4">
                                    {answer.user_answer && answer.user_answer.map((placement, idx) => {
                                        const correctPlacement = answer.correct_answer.find(
                                            item => item.item_id === placement.item_id
                                        );
                                        const isCorrect = correctPlacement &&
                                            correctPlacement.target === placement.target;
                                        const dragItem = answer.drag_items.find(item => item.id === parseInt(placement.item_id));

                                        return (
                                            <div
                                                key={idx}
                                                className={`p-4 rounded-xl border-2 transition-all duration-300 ${isCorrect
                                                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-lg'
                                                        : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-300 shadow-lg'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-grow">
                                                        <div className="flex items-center mb-3">
                                                            <span className="font-semibold text-gray-700 mr-3">📦 Item:</span>
                                                            <span className="bg-white px-4 py-2 rounded-lg border border-gray-200 font-medium shadow-sm">
                                                                {dragItem?.item_text || placement.target}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <span className="font-semibold text-gray-700 mr-3">🎯 Target:</span>
                                                            <span className="bg-white px-4 py-2 rounded-lg border border-gray-200 font-medium shadow-sm">
                                                                {placement.target}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {!isCorrect && (
                                                        <div className="ml-6 pl-6 border-l-2 border-gray-200">
                                                            <div className="text-sm text-green-700">
                                                                <span className="block font-semibold mb-2">✅ Jawaban Benar:</span>
                                                                <span className="bg-green-100 px-3 py-2 rounded-lg inline-block font-medium">
                                                                    Target: {correctPlacement?.target}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Fill in the blank question */}
                        {answer.question_type === "fill_blank" && (
                            <div className="mt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-3 text-lg">✏️ Jawaban Anda:</h4>
                                        <div className={`p-4 rounded-xl border-2 shadow-lg ${answer.is_correct
                                                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
                                                : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-300'
                                            }`}>
                                            <span className="font-medium text-gray-800">{answer.user_answer || "-"}</span>
                                        </div>
                                    </div>

                                    {!answer.is_correct && (
                                        <div>
                                            <h4 className="font-semibold text-green-700 mb-3 text-lg">✅ Jawaban Benar:</h4>
                                            <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 shadow-lg">
                                                <span className="font-medium text-gray-800">{answer.correct_answer}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-gradient-to-tr from-blue-200 to-indigo-200 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full opacity-10 blur-3xl"></div>
            </div>

            {/* Enhanced Celebration Animation */}
            {showCelebration && (
                <div className="fixed inset-0 z-50 pointer-events-none mt-16">
                    {/* Confetti particles */}
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-bounce text-4xl"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${2 + Math.random() * 2}s`
                            }}
                        >
                            {motivationalData.particles[Math.floor(Math.random() * motivationalData.particles.length)]}
                        </div>
                    ))}

                    {/* Central celebration */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-lompat text-[200px]">🎉</div>
                    </div>
                </div>
            )}

            {/* Enhanced Header */}
            <div className="relative z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 py-6 px-6 mb-8">
                <div className="flex items-center justify-between">
                    <button
                        onClick={handleReturn}
                        className="flex items-center px-4 py-2 text-blue-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 transition-all duration-300 font-semibold rounded-xl hover:shadow-lg transform hover:scale-105"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        <span>Kembali</span>
                    </button>

                    <div className="text-right">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Hasil Quiz
                        </h1>
                        <p className="text-gray-500 text-sm">Review dan analisis jawaban</p>
                    </div>
                </div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 pb-16">
                {/* Enhanced Motivational Message Card */}
                <div className={`${motivationalData.bgGradient} rounded-3xl shadow-2xl p-8 mx-16 mb-8 transform transition-all duration-700 hover:scale-105 relative overflow-hidden ${animateStats ? 'animate-fadeIn' : 'opacity-0'}`}>
                    {/* Decorative border */}
                    <div className={`absolute inset-0 rounded-3xl p-1 ${motivationalData.borderGradient}`}>
                        <div className={`w-full h-full ${motivationalData.bgGradient} rounded-3xl`}></div>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-center mb-6">
                            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full mr-4">
                                {motivationalData.icon}
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 text-center">
                                {motivationalData.title}
                            </h2>
                        </div>

                        <p className="text-xl text-gray-700 text-center mb-8 leading-relaxed">
                            {motivationalData.message}
                        </p>

                        <div className="flex items-center justify-center">
                            <div className={`bg-gradient-to-r ${motivationalData.color} text-white px-12 py-6 rounded-full shadow-2xl transform transition-all duration-500 hover:scale-110 relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                                <span className="relative z-10 text-5xl font-bold">{score}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quiz Info Card */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
                        {resultData.worksheet_name || "Hasil Quiz"}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start">
                            <div>
                                <p className="text-gray-500 text-sm">Waktu Pengerjaan</p>
                                <p className="font-medium">{formatDate(resultData.submitted_at)}</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div>
                                <p className="text-gray-500 text-sm">Jumlah Soal</p>
                                <p className="font-medium">{resultData.correct_count + resultData.wrong_count} Soal</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div>
                                <p className="text-gray-500 text-sm">Benar</p>
                                <p className="font-medium text-green-600">{resultData.correct_count} Soal</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div>
                                <p className="text-gray-500 text-sm">Salah</p>
                                <p className="font-medium text-red-600">{resultData.wrong_count} Soal</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-xl shadow-md p-2 mb-6 flex gap-2">
                    <button
                        onClick={() => setViewMode("all")}
                        className={`flex-grow py-2 px-4 rounded-lg text-center transition-all ${viewMode === "all"
                            ? "bg-blue-100 text-blue-700 font-medium"
                            : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        Semua ({resultData.answers.length})
                    </button>
                    <button
                        onClick={() => setViewMode("correct")}
                        className={`flex-grow py-2 px-4 rounded-lg text-center transition-all ${viewMode === "correct"
                            ? "bg-green-100 text-green-700 font-medium"
                            : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        Benar ({resultData.correct_count})
                    </button>
                    <button
                        onClick={() => setViewMode("wrong")}
                        className={`flex-grow py-2 px-4 rounded-lg text-center transition-all ${viewMode === "wrong"
                            ? "bg-red-100 text-red-700 font-medium"
                            : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        Salah ({resultData.wrong_count})
                    </button>
                </div>

                {/* Questions Review */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">
                        Review Jawaban
                    </h2>

                    {filteredAnswers.length === 0 ? (
                        <div className="bg-white rounded-xl shadow p-8 text-center">
                            <div className="inline-flex items-center justify-center bg-gray-100 rounded-full p-3 mb-3">
                                <CheckCircle className="h-8 w-8 text-gray-500" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-800 mb-2">
                                {viewMode === "wrong" ? "Tidak ada jawaban salah" :
                                    viewMode === "correct" ? "Tidak ada jawaban benar" :
                                        "Tidak ada jawaban untuk ditampilkan"}
                            </h3>
                            <p className="text-gray-600">
                                {viewMode === "wrong" ?
                                    "Selamat! Anda menjawab semua pertanyaan dengan benar." :
                                    viewMode === "correct" ?
                                        "Anda belum menjawab dengan benar. Silakan pelajari kembali materinya." :
                                        "Tidak ada data jawaban yang tersedia."}
                            </p>
                        </div>
                    ) : (
                        <div>
                            {filteredAnswers.map((answer, index) =>
                                renderQuestionCard(answer, index)
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizResult;