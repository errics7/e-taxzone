import React, { useEffect, useState } from 'react';

const TourOverlay = ({ show, targetSelector, zIndex = 9999 }) => {
    const [targetPosition, setTargetPosition] = useState(null);

    useEffect(() => {
        if (!show) return;

        // Disable scrolling when tour is active
        const originalOverflow = document.body.style.overflow;
        const originalPosition = document.body.style.position;
        const originalTop = document.body.style.top;
        const scrollY = window.scrollY;

        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';

        return () => {
            // Restore scrolling when tour is closed
            document.body.style.overflow = originalOverflow;
            document.body.style.position = originalPosition;
            document.body.style.top = originalTop;
            document.body.style.width = '';
            window.scrollTo(0, scrollY);
        };
    }, [show]);

    useEffect(() => {
        if (!show || !targetSelector) return;

        const updatePosition = () => {
            const element = document.querySelector(targetSelector);
            if (element) {
                const rect = element.getBoundingClientRect();
                // Since we're preventing scroll, we don't need to add scroll offset
                setTargetPosition({
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height,
                });
            }
        };

        updatePosition();
        
        // Still listen to resize events
        window.addEventListener('resize', updatePosition);

        return () => {
            window.removeEventListener('resize', updatePosition);
        };
    }, [show, targetSelector]);

    if (!show || !targetPosition) return null;

    return (
        <>
            {/* Full screen overlay to block interactions */}
            <div
                className="fixed inset-0"
                style={{
                    zIndex: zIndex - 5,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    pointerEvents: 'auto', // Block all pointer events
                }}
            />
            
            {/* Spotlight effect overlay */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    zIndex: zIndex - 4,
                    background: `
                        radial-gradient(
                            ellipse ${targetPosition.width + 20}px ${targetPosition.height + 20}px 
                            at ${targetPosition.left + targetPosition.width / 2}px ${targetPosition.top + targetPosition.height / 2}px,
                            transparent 0%, 
                            transparent 50%, 
                            rgba(0, 0, 0, 0.4) 70%
                        )
                    `
                }}
            />
            
            {/* Clear area around target element to allow interaction */}
            <div
                className="fixed pointer-events-none"
                style={{
                    zIndex: zIndex - 3,
                    top: targetPosition.top - 10,
                    left: targetPosition.left - 10,
                    width: targetPosition.width + 20,
                    height: targetPosition.height + 20,
                    background: 'transparent',
                }}
            />
            
            {/* Highlight border for target element */}
            <div
                className="fixed pointer-events-none border-4 border-blue-500 rounded-lg shadow-lg"
                style={{
                    zIndex: zIndex - 2,
                    top: targetPosition.top - 4,
                    left: targetPosition.left - 4,
                    width: targetPosition.width + 8,
                    height: targetPosition.height + 8,
                    animation: 'pulse 2s infinite',
                }}
            />
            
            <style jsx>{`
                @keyframes pulse {
                    0%, 100% {
                        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
                    }
                    50% {
                        box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
                    }
                }
            `}</style>
        </>
    );
};

export default TourOverlay;