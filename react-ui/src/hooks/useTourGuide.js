import { useState, useCallback, useRef, useEffect } from 'react';
import useUserTour from './useUserTour';

const useTourGuide = (tourKey, tourSteps, dependencies = []) => {
    const [showTour, setShowTour] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    
    // Use refs to manage state without causing renders
    const initializedRef = useRef(false);
    const tourCheckedRef = useRef(false);
    const isMountedRef = useRef(true);
    const timeoutIdRef = useRef(null);
    
    // Use the existing useUserTour hook
    const { 
        loading: tourLoading, 
        completed: tourCompleted, 
        error: tourError,
        markCompletedTour, 
        checkUserTour 
    } = useUserTour();
    
    // localStorage keys
    const TOUR_COMPLETED_KEY = `tour_completed_${tourKey}`;
    const TOUR_STEP_KEY = `tour_step_${tourKey}`;
    
    // localStorage helper functions
    const saveToLocalStorage = useCallback((key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn('Failed to save to localStorage:', error);
        }
    }, []);
    
    const getFromLocalStorage = useCallback((key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn('Failed to read from localStorage:', error);
            return defaultValue;
        }
    }, []);
    
    const removeFromLocalStorage = useCallback((key) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.warn('Failed to remove from localStorage:', error);
        }
    }, []);
    
    // Check if tour is completed (with localStorage fallback)
    const checkTourCompleted = useCallback(async () => {
        try {
            // First try to check from server
            const serverCompleted = await checkUserTour(tourKey);
            
            // Save result to localStorage for future fallback
            saveToLocalStorage(TOUR_COMPLETED_KEY, {
                completed: serverCompleted,
                timestamp: Date.now(),
                source: 'server'
            });
            
            return serverCompleted;
        } catch (error) {
            console.warn('Server check failed, falling back to localStorage:', error);
            
            // Fallback to localStorage
            const localData = getFromLocalStorage(TOUR_COMPLETED_KEY);
            
            if (localData && localData.completed) {
                // Check if localStorage data is not too old (e.g., 7 days)
                const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
                const isDataFresh = (Date.now() - localData.timestamp) < maxAge;
                
                if (isDataFresh) {
                    console.log('Using localStorage fallback for tour completion status');
                    return localData.completed;
                }
            }
            
            // If no valid localStorage data, assume not completed
            return false;
        }
    }, [tourKey, checkUserTour, saveToLocalStorage, getFromLocalStorage]);
    
    // Mark tour as completed (with localStorage backup)
    const markTourCompleted = useCallback(async () => {
        const completionData = {
            completed: true,
            timestamp: Date.now(),
            source: 'local'
        };
        
        // Save to localStorage immediately
        saveToLocalStorage(TOUR_COMPLETED_KEY, completionData);
        
        try {
            // Try to save to server
            await markCompletedTour(tourKey);
            
            // Update localStorage to indicate server sync
            saveToLocalStorage(TOUR_COMPLETED_KEY, {
                ...completionData,
                source: 'server'
            });
            
            console.log('Tour completion saved to server and localStorage');
        } catch (error) {
            console.warn('Failed to save tour completion to server, kept in localStorage:', error);
            // Keep the localStorage version as fallback
        }
    }, [tourKey, markCompletedTour, saveToLocalStorage]);
    
    // Save current step to localStorage
    const saveCurrentStep = useCallback((step) => {
        saveToLocalStorage(TOUR_STEP_KEY, {
            step,
            timestamp: Date.now()
        });
    }, [TOUR_STEP_KEY, saveToLocalStorage]);
    
    // Load current step from localStorage
    const loadCurrentStep = useCallback(() => {
        const stepData = getFromLocalStorage(TOUR_STEP_KEY, { step: 0 });
        
        // Check if step data is not too old (e.g., 1 hour)
        const maxAge = 60 * 60 * 1000; // 1 hour in milliseconds
        const isDataFresh = stepData.timestamp && (Date.now() - stepData.timestamp) < maxAge;
        
        return isDataFresh ? stepData.step : 0;
    }, [TOUR_STEP_KEY, getFromLocalStorage]);
    
    // Function to check if dependencies are ready
    const checkDependencies = useCallback(() => {
        return dependencies.every(dep => !!dep);
    }, [dependencies]);
    
    // Initialize the tour with useEffect
    useEffect(() => {
        isMountedRef.current = true;
        
        const initTour = async () => {
            try {
                // Check if the tour is already completed
                const isCompleted = await checkTourCompleted();

                if (!isCompleted && isMountedRef.current) {
                    // Load saved step from localStorage
                    const savedStep = loadCurrentStep();
                    
                    if (savedStep > 0 && savedStep < tourSteps.length) {
                        setCurrentStep(savedStep);
                    }
                    
                    // Delay to ensure UI is fully rendered
                    timeoutIdRef.current = setTimeout(() => {
                        if (isMountedRef.current) {
                            setShowTour(true);
                        }
                    }, 1000);
                }
            } catch (error) {
                console.error("Tour initialization error:", error);
            }
        };

        initTour();
        
        return () => {
            isMountedRef.current = false;
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }
        };
    }, [tourKey, checkTourCompleted, loadCurrentStep, tourSteps.length]);
    
    // Update currentStep effect to save to localStorage
    useEffect(() => {
        if (showTour) {
            saveCurrentStep(currentStep);
        }
    }, [currentStep, showTour, saveCurrentStep]);

    // Tour navigation handlers
    const handleNext = useCallback(async () => {
        if (currentStep < tourSteps.length - 1) {
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);
        } else {
            // Tour completed
            try {
                await markTourCompleted();
                setShowTour(false);
                setCurrentStep(0);
                
                // Clean up localStorage step data
                removeFromLocalStorage(TOUR_STEP_KEY);
                
            } catch (error) {
                console.error("Error marking tour completed:", error);
            }
        }
    }, [currentStep, tourSteps.length, markTourCompleted, removeFromLocalStorage, TOUR_STEP_KEY]);

    const handlePrev = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    }, [currentStep]);

    const handleSkip = useCallback(async () => {
        try {
            await markTourCompleted();
            setShowTour(false);
            setCurrentStep(0);
            
            // Clean up localStorage step data
            removeFromLocalStorage(TOUR_STEP_KEY);
            
        } catch (error) {
            console.error("Error marking tour completed on skip:", error);
        }
    }, [markTourCompleted, removeFromLocalStorage, TOUR_STEP_KEY]);

    const handleComplete = useCallback(async () => {
        try {
            await markTourCompleted();
            setShowTour(false);
            setCurrentStep(0);
            
            // Clean up localStorage step data
            removeFromLocalStorage(TOUR_STEP_KEY);
            
        } catch (error) {
            console.error("Error marking tour completed on complete:", error);
        }
    }, [markTourCompleted, removeFromLocalStorage, TOUR_STEP_KEY]);

    // Reset tour for debugging or manual restart
    const resetTour = useCallback(() => {
        initializedRef.current = false;
        tourCheckedRef.current = false;
        setCurrentStep(0);
        setShowTour(true);
        
        // Clear localStorage data
        removeFromLocalStorage(TOUR_COMPLETED_KEY);
        removeFromLocalStorage(TOUR_STEP_KEY);
    }, [removeFromLocalStorage, TOUR_COMPLETED_KEY, TOUR_STEP_KEY]);
    
    // Clear localStorage data (utility function)
    const clearTourData = useCallback(() => {
        removeFromLocalStorage(TOUR_COMPLETED_KEY);
        removeFromLocalStorage(TOUR_STEP_KEY);
    }, [removeFromLocalStorage, TOUR_COMPLETED_KEY, TOUR_STEP_KEY]);

    // Get tooltip position (updated to work with fixed positioning)
    const getTooltipPosition = useCallback((targetSelector, placement = 'bottom', offset = 10) => {
        const element = document.querySelector(targetSelector);
        if (!element) return { top: 0, left: 0 };

        const rect = element.getBoundingClientRect();
        // Since we're using fixed positioning, no need to add scroll offset
        
        let top, left;

        switch (placement) {
            case 'top':
                top = rect.top - offset;
                left = rect.left + rect.width / 2;
                break;
            case 'bottom':
                top = rect.bottom + offset;
                left = rect.left + rect.width / 2;
                break;
            case 'left':
                top = rect.top + rect.height / 2;
                left = rect.left - offset;
                break;
            case 'right':
                top = rect.top + rect.height / 2;
                left = rect.right + offset;
                break;
            case 'center':
                top = rect.top + rect.height / 2;
                left = rect.left + rect.width / 2;
                break;
            default:
                top = rect.bottom + offset;
                left = rect.left + rect.width / 2;
        }

        return { top, left };
    }, []);

    return {
        // Tour state
        showTour,
        currentStep,
        loading: tourLoading,
        completed: tourCompleted,
        error: tourError,
        
        // Tour data
        totalSteps: tourSteps.length,
        currentStepData: tourSteps[currentStep],
        progress: ((currentStep + 1) / tourSteps.length) * 100,
        isFirstStep: currentStep === 0,
        isLastStep: currentStep === tourSteps.length - 1,
        
        // Tour handlers
        handleNext,
        handlePrev,
        handleSkip,
        handleComplete,
        resetTour,
        getTooltipPosition,
        
        // Manual controls
        setShowTour,
        setCurrentStep,
        
        // Utility functions
        clearTourData,
        
        // localStorage status (for debugging)
        localStorageAvailable: typeof Storage !== 'undefined'
    };
};

export default useTourGuide;