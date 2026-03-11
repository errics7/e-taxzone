import React, { useState } from "react";

const QuestionList = ({ questions, onAddQuestion, onEditQuestion, onDeleteQuestion, onPreview, onSchedule }) => {
    // For demonstration purposes
    const [activeTab, setActiveTab] = useState("all");

    console.log('questions ', questions)
    // Filter questions based on active tab
    const filteredQuestions = activeTab === "all"
        ? questions
        : questions.filter(q => q.type === activeTab);

    // Get unique question types for tabs
    const questionTypes = ["all", ...new Set(questions.map(q => q.type))];

    // Function to render question options based on type
    const renderQuestionContent = (question) => {
        switch (question.type) {
            case "multiple_choice":
                return (
                    <div className="mt-2 pl-4">
                        {question.options && question.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center mb-1">
                                <div className="flex items-center mr-2">
                                    {option.is_correct ? (
                                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <span className={option.is_correct ? "font-medium" : ""}>{option.option_text || "—"}</span>
                            </div>
                        ))}
                    </div>
                );

            case "fill_blank":
                return (
                    <div className="mt-2 pl-4">
                        <div className="flex items-center">
                            <span className="font-medium">Jawaban benar: </span>
                            <span className="ml-2 bg-blue-100 px-2 py-1 rounded">{question.correct_answer}</span>
                        </div>
                    </div>
                );

            case "drag_and_drop":
                return (
                    <div className="mt-2 pl-4">
                        <div className="font-medium mb-1">Item yang dapat di-drag:</div>
                        {question.drag_items.filter(item => item.text).map((item, index) => (
                            <div key={index} className="flex items-center mb-1">
                                <div className="bg-yellow-100 px-2 py-1 rounded mr-2">{item.text}</div>
                                <span className="text-gray-600">→ Target: {item.correct_target}</span>
                            </div>
                        ))}
                    </div>
                );

            default:
                return null;
        }
    };

    console.log(filteredQuestions)

    // Function to render badge for question type
    const getQuestionTypeBadge = (type) => {
        switch (type) {
            case "multiple_choice":
                return <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Pilihan Ganda</span>;
            case "fill_blank":
                return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Isian</span>;
            case "drag_and_drop":
                return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Drag & Drop</span>;
            default:
                return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">{type}</span>;
        }
    };

    return (
        <div className="w-full">
            {/* Quiz Header Card */}
            <div className="bg-white rounded-lg shadow-md mb-6 p-4 relative">
                <div className="flex items-center">
                    <div className="w-16 h-16 flex-shrink-0 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">KUIS 1 - PBO</h2>
                        <p className="text-gray-600">TI - 4G</p>
                    </div>
                </div>

                <div className="flex mt-4">
                    <button className="flex items-center text-gray-700 border border-gray-300 rounded-md px-3 py-1 text-sm mr-2">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                    </button>
                    <button className="text-gray-700 border border-gray-300 rounded-md px-3 py-1 text-sm mr-auto">
                        Simpan
                    </button>
                    <button
                        className="flex items-center text-gray-700 border border-gray-300 rounded-md px-3 py-1 text-sm mr-2"
                        onClick={onPreview}
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Pratinjau
                    </button>
                    <button
                        className="flex items-center bg-blue-600 text-white rounded-md px-3 py-1 text-sm"
                        onClick={onSchedule}
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Penjadwalan
                    </button>
                </div>
            </div>

            {/* Question Type Tabs */}
            <div className="mb-4 border-b border-gray-200">
                <ul className="flex flex-wrap -mb-px">
                    {questionTypes.map(type => (
                        <li key={type} className="mr-2">
                            <button
                                onClick={() => setActiveTab(type)}
                                className={`inline-block py-2 px-4 font-medium text-sm rounded-t-lg ${activeTab === type
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {type === "all" ? "Semua" :
                                    type === "multiple_choice" ? "Pilihan Ganda" :
                                        type === "fill_blank" ? "Isian" :
                                            type === "drag_and_drop" ? "Drag & Drop" : type}
                                <span className="ml-1 bg-gray-200 text-gray-700 text-xs px-1.5 rounded-full">
                                    {type === "all"
                                        ? questions.length
                                        : questions.filter(q => q.type === type).length}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Question List Header */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                    Total Soal: {filteredQuestions.length} Pertanyaan
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={onAddQuestion}
                        className="flex items-center bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Soal
                    </button>
                    <button
                        onClick={() => onAddQuestion()}
                        className="flex items-center bg-green-600 text-white px-3 py-2 rounded-lg text-sm"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Soal dari Bank Soal
                    </button>
                </div>
            </div>

            {/* Question List */}
            {filteredQuestions.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <p className="text-gray-500">
                        Belum ada soal. Klik "Tambah Soal" untuk membuat soal baru.
                    </p>
                </div>
            ) : (
                <div className="space-y-3 mb-6">
                    {filteredQuestions.map((question, index) => (
                        <div key={question.id || index} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between">
                                <div className="flex items-center">
                                    <span className="font-medium mr-2">{index + 1}.</span>
                                    <div>
                                        <div className="flex items-center">
                                            <span className="font-medium">{question.question_text || question.title}</span>
                                            <div className="ml-2">{getQuestionTypeBadge(question.type)}</div>
                                            {question.category && (
                                                <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                                    {question.category}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex">
                                    <button
                                        onClick={() => onEditQuestion(question)}
                                        className="text-gray-500 hover:text-blue-600 p-1"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => onDeleteQuestion(question.id)}
                                        className="text-gray-500 hover:text-red-600 p-1"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Render question content based on type */}
                            {renderQuestionContent(question)}
                        </div>
                    ))}
                </div>
            )}

            {/* Bottom Add Button */}
            {/* <div className="flex justify-center mt-3">
                <button
                    onClick={onAddQuestion}
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Soal
                </button>
            </div> */}
        </div>
    );
};

export default QuestionList;