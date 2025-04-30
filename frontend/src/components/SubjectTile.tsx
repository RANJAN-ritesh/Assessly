import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Typography, Box, Grid } from '@mui/material';

interface SubjectTileProps {
  subject: {
    _id: string;
    name: string;
  };
  isSelected: boolean;
  onClick: () => void;
  topics?: Array<{
    _id: string;
    name: string;
  }>;
  selectedTopics?: string[];
  onTopicSelect?: (topicId: string) => void;
}

const SubjectTile: React.FC<SubjectTileProps> = ({ subject, isSelected, onClick, topics = [], selectedTopics = [], onTopicSelect }) => {
  const handleCardClick = (e: React.MouseEvent) => {
    if (!isSelected) {
      onClick();
    }
  };

  return (
    <motion.div
      initial={{ scale: 1 }}
      animate={{ scale: isSelected ? 0.95 : 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      style={{ cursor: 'pointer' }}
    >
      <Card
        onClick={handleCardClick}
        sx={{
          p: 6,
          width: '600px',
          height: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: isSelected
            ? 'linear-gradient(145deg, #2a2a2a 0%, #1e1e1e 100%)'
            : 'linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 100%)',
          border: isSelected ? '2px solid #90caf9' : 'none',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          backdropFilter: 'blur(10px)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(144, 202, 249, 0.1), rgba(206, 147, 216, 0.1))',
            opacity: isSelected ? 0.5 : 0,
            transition: 'opacity 0.3s ease',
          },
        }}
      >
        <AnimatePresence mode="wait">
          {!isSelected ? (
            <motion.div
              key="subject"
              initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ 
                opacity: [1, 0.8, 0],
                scale: [1, 0.5, 0],
                x: [0, 0, 0],
                y: [0, 0, 0],
                transition: { 
                  duration: 0.4,
                  times: [0, 0.5, 1],
                  ease: [0.4, 0, 0.2, 1]
                }
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  background: 'linear-gradient(45deg, #90caf9 30%, #ce93d8 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 600,
                  textAlign: 'center',
                }}
              >
                {subject.name}
              </Typography>
            </motion.div>
          ) : (
            <motion.div
              key="topics"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              style={{ 
                width: '100%',
                position: 'relative',
                zIndex: 2,
                pointerEvents: 'auto'
              }}
            >
              <Grid container spacing={2}>
                {topics.map((topic) => {
                  const selected = selectedTopics.includes(topic._id);
                  return (
                    <Grid item xs={6} key={topic._id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onTopicSelect && onTopicSelect(topic._id);
                        }}
                        style={{ 
                          cursor: 'pointer',
                          position: 'relative',
                          zIndex: 3
                        }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            background: selected
                              ? 'linear-gradient(90deg, #90caf9, #ce93d8)'
                              : 'rgba(144, 202, 249, 0.1)',
                            borderRadius: 2,
                            border: selected
                              ? '2px solid #ce93d8'
                              : '1px solid rgba(144, 202, 249, 0.2)',
                            textAlign: 'center',
                            color: selected ? '#222' : '#90caf9',
                            fontWeight: 500,
                            boxShadow: selected ? '0 0 8px #ce93d8' : 'none',
                            transition: 'all 0.2s',
                            '&:hover': {
                              background: selected
                                ? 'linear-gradient(90deg, #ce93d8, #90caf9)'
                                : 'rgba(144, 202, 249, 0.2)',
                            },
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              color: selected ? '#222' : '#90caf9',
                              fontWeight: 500,
                            }}
                          >
                            {topic.name}
                          </Typography>
                        </Box>
                      </motion.div>
                    </Grid>
                  );
                })}
              </Grid>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default SubjectTile; 