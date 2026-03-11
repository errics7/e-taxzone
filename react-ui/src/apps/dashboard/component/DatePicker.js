import React from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { DateRange as DateRangeIcon } from "@mui/icons-material";

const DatePicker = ({ date, onChange, label = "Tanggal", fullWidth = true, disabled = false }) => {
    // Ensure date is a valid Date object
    const formatDate = (date) => {
        // If the date is already a Date object, return formatted string
        if (date instanceof Date && !isNaN(date.getTime())) {
            return date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
        }
        // Return current date if date is invalid
        return new Date().toISOString().split("T")[0];
    };

    const handleDateChange = (e) => {
        const newDate = new Date(e.target.value);
        if (!isNaN(newDate.getTime())) {
            // Retain hour and minute from the original date
            if (date instanceof Date && !isNaN(date.getTime())) {
                newDate.setHours(date.getHours(), date.getMinutes());
            }
            onChange(newDate);
        }
    };

    // Check if date is a valid Date object or not
    const validatedDate = date instanceof Date && !isNaN(date.getTime()) ? date : new Date();

    return (
        <TextField
            type="date"
            fullWidth={fullWidth}
            label={label}
            value={formatDate(validatedDate)}
            onChange={handleDateChange}
            disabled={disabled}
            InputLabelProps={{ shrink: true }}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            edge="end"
                            onClick={() => {
                                const input = document.querySelector(`input[value="${formatDate(validatedDate)}"]`);
                                if (input) input.click();
                            }}
                            size="small"
                        >
                            <DateRangeIcon />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
            sx={{
                '& input[type="date"]::-webkit-calendar-picker-indicator': {
                    opacity: 0, // Hide the default calendar icon
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    cursor: 'pointer',
                },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.87)',
                    },
                },
            }}
        />
    );
};

export default DatePicker;