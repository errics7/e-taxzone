import React, { useEffect, useState } from 'react';
import TourTooltip from './TourTooltip';

const TourGuide = ({
    show,
    currentStep,
    totalSteps,
    stepData,
    onNext,
    onPrev,
    onSkip,
    isFirstStep,
    isLastStep,
    progress,
    getTooltipPosition
}) => {
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const [visible, setVisible] = useState(false);
    
    // Disable scrolling when tour is active
    useEffect(() => {
        if (!show) return;

        const originalOverflow = document.body.style.overflow;
        const originalPosition = document.body.style.position;
        const originalTop = document.body.style.top;
        const scrollY = window.scrollY;

        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';

        return () => {
            document.body.style.overflow = originalOverflow;
            document.body.style.position = originalPosition;
            document.body.style.top = originalTop;
            document.body.style.width = '';
            window.scrollTo(0, scrollY);
        };
    }, [show]);
    
    // Update position when step changes or visibility changes
    useEffect(() => {
        if (!show || !stepData?.target) {
            setVisible(false);
            return;
        }
        
        const timer = setTimeout(() => {
            const position = getTooltipPosition(
                stepData.target, 
                stepData.placement || 'bottom',
                stepData.offset || 10
            );
            setTooltipPosition(position);
            setVisible(true);
        }, 100);
        
        return () => clearTimeout(timer);
    }, [show, stepData, currentStep, getTooltipPosition]);

    if (!show || !stepData) return null;

    // Create overlay elements for the spotlight effect
    const Overlay = () => {
        const [targetRect, setTargetRect] = useState(null);

        useEffect(() => {
            if (!stepData?.target) return;

            const updateTargetRect = () => {
                const element = document.querySelector(stepData.target);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // No need to add scroll offset since we're preventing scroll
                    setTargetRect({
                        top: rect.top,
                        left: rect.left,
                        width: rect.width,
                        height: rect.height
                    });
                }
            };

            updateTargetRect();
            window.addEventListener('resize', updateTargetRect);

            return () => {
                window.removeEventListener('resize', updateTargetRect);
            };
        }, []);

        if (!targetRect) return null;

        return (
            <>
                {/* Full screen overlay to block all interactions */}
                <div 
                    className="fixed inset-0 bg-black bg-opacity-60"
                    style={{ zIndex: 9990 }}
                />
                
                {/* Spotlight effect overlay */}
                <div
                    className="fixed inset-0 pointer-events-none"
                    style={{
                        zIndex: 9991,
                        background: `
                            radial-gradient(
                                ellipse ${targetRect.width + 20}px ${targetRect.height + 20}px 
                                at ${targetRect.left + targetRect.width / 2}px ${targetRect.top + targetRect.height / 2}px,
                                transparent 0%, 
                                transparent 50%, 
                                rgba(0, 0, 0, 0.4) 70%
                            )
                        `
                    }}
                />
                
                {/* Target element highlight */}
                <div
                    className="fixed pointer-events-none border-2 border-blue-500 rounded"
                    style={{
                        zIndex: 9995,
                        top: targetRect.top - 2,
                        left: targetRect.left - 2,
                        width: targetRect.width + 4,
                        height: targetRect.height + 4,
                        animation: 'pulse 2s infinite'
                    }}
                />
                
                <style jsx>{`
                    @keyframes pulse {
                        0%, 100% { 
                            box-shadow: 0 0 0 0 rgba(0, 60, 119, 0.7); 
                        }
                        50% { 
                            box-shadow: 0 0 0 10px rgba(0, 60, 119, 0); 
                        }
                    }
                `}</style>
            </>
        );
    };

    return (
        <>
            <Overlay />
            
            {visible && (
                <TourTooltip
                    show={true}
                    currentStep={currentStep}
                    totalSteps={totalSteps}
                    title={stepData.title}
                    content={stepData.content}
                    position={tooltipPosition}
                    placement={stepData.placement || 'bottom'}
                    onNext={onNext}
                    onPrev={onPrev}
                    onSkip={onSkip}
                    isFirstStep={isFirstStep}
                    isLastStep={isLastStep}
                    progress={progress}
                    className="z-[9999]"
                    style={{ zIndex: 9999 }}
                />
            )}
        </>
    );
};

export default TourGuide;