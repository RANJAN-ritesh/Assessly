import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, Card, Typography, Box } from '@mui/material';

interface TopicGridProps {
  topics: Array<{
    _id: string;
    name: string;
  }>;
  selectedTopics: string[];
  onTopicSelect: (topicId: string) => void;
}

const TopicGrid: React.FC<TopicGridProps> = ({ topics, selectedTopics, onTopicSelect }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <Grid container spacing={2}>
          {topics.map((topic) => (
            <Grid item xs={12} sm={6} md={4} key={topic._id}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onTopicSelect(topic._id)}
                style={{ cursor: 'pointer' }}
              >
                <Card
                  sx={{
                    p: 2,
                    background: selectedTopics.includes(topic._id)
                      ? 'linear-gradient(145deg, #2a2a2a 0%, #1e1e1e 100%)'
                      : 'linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 100%)',
                    border: selectedTopics.includes(topic._id) ? '2px solid #ce93d8' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      background: 'linear-gradient(45deg, #ce93d8 30%, #90caf9 90%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 500,
                    }}
                  >
                    {topic.name}
                  </Typography>
                  <AnimatePresence>
                    {selectedTopics.includes(topic._id) && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Box
                          sx={{
                            mt: 1,
                            height: '3px',
                            background: 'linear-gradient(90deg, #ce93d8, #90caf9)',
                            borderRadius: '2px',
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </AnimatePresence>
  );
};

export default TopicGrid; 