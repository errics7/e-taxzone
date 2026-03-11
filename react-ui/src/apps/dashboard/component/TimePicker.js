import React from "react";
import { TextField } from "@mui/material";

const TimePicker = ({ date, onChange, label = "Waktu" }) => {
    const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
    };

    const handleTimeChange = (e) => {
        const [hours, minutes] = e.target.value.split(":").map(Number);
        if (!isNaN(hours) && !isNaN(minutes)) {
            const newDate = new Date(date);
            newDate.setHours(hours);
            newDate.setMinutes(minutes);
            onChange(newDate);
        }
    };

    return (
        <TextField
            type="time"
            fullWidth
            label={label}
            value={formatTime(date)}
            onChange={handleTimeChange}
            InputLabelProps={{ shrink: true }}
        />
    );
};

export default TimePicker;
