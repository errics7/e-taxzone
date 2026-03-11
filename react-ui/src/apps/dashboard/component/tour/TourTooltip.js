import React from 'react';
import { Button, Typography, LinearProgress } from '@mui/material';

const TourTooltip = ({
    show,
    currentStep,
    totalSteps,
    title,
    content,
    position,
    placement = 'bottom',
    onNext,
    onPrev,
    onSkip,
    isFirstStep,
    isLastStep,
    progress,
    className = '',
    style = {}
}) => {
    if (!show) return null;

    const getArrowClasses = () => {
        switch (placement) {
            case 'top':
                return 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white';
            case 'bottom':
                return 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-full border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white';
            case 'left':
                return 'right-0 top-1/2 transform translate-x-full -translate-y-1/2 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-white';
            case 'right':
                return 'left-0 top-1/2 transform -translate-x-full -translate-y-1/2 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white';
            default:
                return 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-full border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white';
        }
    };

    const getTransformStyle = () => {
        switch (placement) {
            case 'top':
                return 'translateX(-50%) translateY(-100%)';
            case 'bottom':
                return 'translateX(-50%)';
            case 'left':
                return 'translateX(-100%) translateY(-50%)';
            case 'right':
                return 'translateY(-50%)';
            case 'center':
                return 'translateX(-50%) translateY(-50%)';
            default:
                return 'translateX(-50%)';
        }
    };

    return (
        <div
            className={`fixed z-50 bg-white rounded-lg shadow-xl border max-w-sm ${className}`}
            style={{
                top: position.top,
                left: position.left,
                transform: getTransformStyle(),
                ...style
            }}
        >
            {/* Arrow */}
            <div className={`absolute w-0 h-0 ${getArrowClasses()}`} />
            
            {/* Progress bar */}
            <div className="p-2 border-b">
                <LinearProgress 
                    variant="determinate" 
                    value={progress} 
                    sx={{ 
                        height: 4, 
                        borderRadius: 2,
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: '#003C77'
                        }
                    }} 
                />
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                    <Typography variant="h6" className="font-bold text-gray-800">
                        {title}
                    </Typography>
                    <Typography variant="caption" className="text-gray-500">
                        {currentStep + 1} / {totalSteps}
                    </Typography>
                </div>

                <Typography variant="body2" className="text-gray-600 mb-4 leading-relaxed">
                    {content}
                </Typography>

                <div className="flex justify-between items-center">
                    <Button
                        variant="text"
                        onClick={onSkip}
                        size="small"
                        className="text-gray-500 hover:text-gray-700"
                    >
                        Lewati
                    </Button>

                    <div className="flex gap-2">
                        {!isFirstStep && (
                            <Button
                                variant="outlined"
                                onClick={onPrev}
                                size="small"
                                sx={{ 
                                    borderColor: '#003C77',
                                    color: '#003C77',
                                    '&:hover': {
                                        borderColor: '#002855',
                                        backgroundColor: 'rgba(0, 60, 119, 0.04)'
                                    }
                                }}
                            >
                                Sebelumnya
                            </Button>
                        )}
                        <Button
                            variant="contained"
                            onClick={onNext}
                            size="small"
                            sx={{ 
                                bgcolor: '#003C77',
                                '&:hover': {
                                    bgcolor: '#002855'
                                }
                            }}
                        >
                            {isLastStep ? 'Selesai' : 'Selanjutnya'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourTooltip;