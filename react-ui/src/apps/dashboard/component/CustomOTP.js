import React, { useState, useRef, useEffect } from 'react';

const OtpInput = ({ length = 6, onChange, value = '', disabled = false }) => {
    const [otp, setOtp] = useState(Array(length).fill(''));
    const inputRefs = useRef([]);

    // Initialize refs array when component mounts
    useEffect(() => {
        // Pre-populate the refs array with the correct number of refs
        inputRefs.current = Array(length)
            .fill(null)
            .map((_, i) => inputRefs.current[i] || React.createRef());
    }, [length]);

    // Update OTP state when external value prop changes
    useEffect(() => {
        if (value) {
            const valueArray = value.toString().split('').slice(0, length);
            setOtp([...valueArray, ...Array(length - valueArray.length).fill('')]);
        } else {
            setOtp(Array(length).fill(''));
        }
    }, [value, length]);

    const handleChange = (e, index) => {
        const { value } = e.target;

        // Take only the last character if pasting multiple characters
        const digit = value.slice(-1);

        // Update OTP state
        const newOtp = [...otp];
        newOtp[index] = digit;
        setOtp(newOtp);

        // Call onChange with the combined OTP value
        onChange(newOtp.join(''));

        // Move focus to the next input if current input is filled
        if (digit && index < length - 1 && inputRefs.current[index + 1]?.current) {
            inputRefs.current[index + 1].current.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        // Move focus to previous input on backspace if current input is empty
        if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]?.current) {
            inputRefs.current[index - 1].current.focus();
        }

        // Move focus on arrow keys
        if (e.key === 'ArrowLeft' && index > 0 && inputRefs.current[index - 1]?.current) {
            e.preventDefault();
            inputRefs.current[index - 1].current.focus();
        }

        if (e.key === 'ArrowRight' && index < length - 1 && inputRefs.current[index + 1]?.current) {
            e.preventDefault();
            inputRefs.current[index + 1].current.focus();
        }
    };

    const handlePaste = (e, index) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').trim();

        // Uncomment if you want to restrict to numbers only
        // if (!/^\d*$/.test(pastedData)) return;

        const chars = pastedData.split('').slice(0, length - index);

        const newOtp = [...otp];
        chars.forEach((char, i) => {
            if (index + i < length) {
                newOtp[index + i] = char;
            }
        });

        setOtp(newOtp);
        onChange(newOtp.join(''));

        // Move focus to the appropriate input after pasting
        const focusIndex = Math.min(index + chars.length, length - 1);
        if (inputRefs.current[focusIndex]?.current) {
            inputRefs.current[focusIndex].current.focus();
        }
    };

    return (
        <div className="flex gap-2">
            {Array(length).fill(null).map((_, index) => (
                <input
                    key={index}
                    ref={el => {
                        // Ensure ref is set properly
                        if (inputRefs.current[index]) {
                            inputRefs.current[index].current = el;
                        } else {
                            inputRefs.current[index] = { current: el };
                        }
                    }}
                    type="text"
                    maxLength={1}
                    value={otp[index] || ''}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={(e) => handlePaste(e, index)}
                    disabled={disabled}
                    className="w-[2.5rem] h-10 text-lg text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
            ))}
        </div>
    );
};

export default OtpInput;