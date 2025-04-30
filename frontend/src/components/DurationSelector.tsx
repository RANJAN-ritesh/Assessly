import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Button } from '@mui/material';

interface DurationSelectorProps {
  selectedDuration: number;
  onDurationSelect: (duration: number) => void;
}

const durations = [30, 60, 90, 120, 150, 180];

const DurationSelector: React.FC<DurationSelectorProps> = ({
  selectedDuration,
  onDurationSelect,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        mt: 4,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          background: 'linear-gradient(45deg, #90caf9 30%, #ce93d8 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 600,
        }}
      >
        Select Duration
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {durations.map((duration) => (
          <motion.div
            key={duration}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={selectedDuration === duration ? 'contained' : 'outlined'}
              onClick={() => onDurationSelect(duration)}
              sx={{
                minWidth: '100px',
                background:
                  selectedDuration === duration
                    ? 'linear-gradient(45deg, #90caf9 30%, #ce93d8 90%)'
                    : 'transparent',
                border: '2px solid #90caf9',
                color: selectedDuration === duration ? '#fff' : '#90caf9',
                '&:hover': {
                  background:
                    selectedDuration === duration
                      ? 'linear-gradient(45deg, #42a5f5 30%, #ab47bc 90%)'
                      : 'rgba(144, 202, 249, 0.1)',
                },
              }}
            >
              {duration} min
            </Button>
          </motion.div>
        ))}
      </Box>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            mt: 2,
            height: '4px',
            background: 'linear-gradient(90deg, #90caf9, #ce93d8)',
            borderRadius: '2px',
          }}
        />
      </motion.div>
    </Box>
  );
};

export default DurationSelector; 