import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';

const TimerContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1, 3),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.grey[100],
    minWidth: 120,
}));

const TimerText = styled(Typography)(({ theme, warning }) => ({
    fontSize: '1.5rem',
    fontWeight: 'bold',
    fontVariantNumeric: 'tabular-nums',
    color: warning ? theme.palette.error.main : theme.palette.text.primary,
    transition: 'color 0.3s ease',
}));

const Timer = ({ initialSeconds, onTimeout, autoSubmit = true }) => {
    const [seconds, setSeconds] = useState(initialSeconds || 0);
    const [warning, setWarning] = useState(false);
    const intervalRef = useRef(null);
    const onTimeoutRef = useRef(onTimeout);

    useEffect(() => {
        onTimeoutRef.current = onTimeout;
    }, [onTimeout]);

    useEffect(() => {
        if (seconds <= 0) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            if (autoSubmit && onTimeoutRef.current) {
                onTimeoutRef.current();
            }
            return;
        }

        if (seconds <= 60) {
            setWarning(true);
        }

        intervalRef.current = setInterval(() => {
            setSeconds(prev => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                    if (autoSubmit && onTimeoutRef.current) {
                        onTimeoutRef.current();
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [seconds, autoSubmit]);

    const formatTime = (totalSeconds) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <TimerContainer>
            <TimerText variant="h6" warning={warning}>
                {formatTime(seconds)}
            </TimerText>
            {warning && (
                <Alert severity="warning" sx={{ py: 0, '& .MuiAlert-message': { py: 0.5 } }}>
                    زمان در حال اتمام است!
                </Alert>
            )}
        </TimerContainer>
    );
};

export default Timer;