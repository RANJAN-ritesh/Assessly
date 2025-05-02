import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  TextField,
  InputAdornment,
  useTheme,
  MenuItem,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import SearchIcon from '@mui/icons-material/Search';

interface Subject {
  _id: string;
  name: string;
  topics: Topic[];
}

interface Topic {
  _id: string;
  name: string;
  subjectId: string;
  problems: Problem[];
}

interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topicId: string;
  attempts?: number;
  successRate?: number;
}

interface AnalyticsViewProps {
  data: Subject[];
  loading: boolean;
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ data, loading }) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  // Calculate metrics
  const totalSubjects = data.length;
  const totalTopics = data.reduce((acc, subject) => acc + subject.topics.length, 0);
  const totalProblems = data.reduce(
    (acc, subject) => acc + subject.topics.reduce((topicAcc, topic) => topicAcc + topic.problems.length, 0),
    0
  );

  // Prepare data for charts
  const subjectTopicData = data.map(subject => ({
    name: subject.name,
    topics: subject.topics.length,
    problems: subject.topics.reduce((acc, topic) => acc + topic.problems.length, 0),
  }));

  const difficultyData = data.reduce((acc, subject) => {
    subject.topics.forEach(topic => {
      topic.problems.forEach(problem => {
        acc[problem.difficulty] = (acc[problem.difficulty] || 0) + 1;
      });
    });
    return acc;
  }, {} as Record<string, number>);

  const difficultyChartData = Object.entries(difficultyData).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  // Get unique subjects, topics, and difficulties for filters
  const subjects = useMemo(() => [...new Set(data.map(subject => subject.name))], [data]);
  const topics = useMemo(() => {
    const allTopics = data.flatMap(subject => subject.topics.map(topic => topic.name));
    return [...new Set(allTopics)];
  }, [data]);
  const difficulties = ['easy', 'medium', 'hard'];

  // Filter problems based on selected filters
  const problemStats = useMemo(() => {
    const stats = data.reduce((acc, subject) => {
      subject.topics.forEach(topic => {
        topic.problems.forEach(problem => {
          acc.push({
            title: problem.title,
            subject: subject.name,
            topic: topic.name,
            difficulty: problem.difficulty,
            attempts: problem.attempts || 0,
            successRate: problem.successRate || 0,
          });
        });
      });
      return acc;
    }, [] as Array<{
      title: string;
      subject: string;
      topic: string;
      difficulty: string;
      attempts: number;
      successRate: number;
    }>);

    return stats.filter(problem => {
      const matchesSearch = searchQuery
        ? problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          problem.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          problem.topic.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const matchesSubject = selectedSubject ? problem.subject === selectedSubject : true;
      const matchesTopic = selectedTopic ? problem.topic === selectedTopic : true;
      const matchesDifficulty = selectedDifficulty ? problem.difficulty === selectedDifficulty : true;

      return matchesSearch && matchesSubject && matchesTopic && matchesDifficulty;
    });
  }, [data, searchQuery, selectedSubject, selectedTopic, selectedDifficulty]);

  // Custom colors based on theme
  const chartColors = {
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    success: theme.palette.success.main,
    warning: theme.palette.warning.main,
    error: theme.palette.error.main,
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'background.paper' }}>
            <Typography variant="h6" color="textSecondary">
              Total Subjects
            </Typography>
            <Typography variant="h4" color="primary">
              {totalSubjects}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'background.paper' }}>
            <Typography variant="h6" color="textSecondary">
              Total Topics
            </Typography>
            <Typography variant="h4" color="secondary">
              {totalTopics}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'background.paper' }}>
            <Typography variant="h6" color="textSecondary">
              Total Problems
            </Typography>
            <Typography variant="h4" color="success">
              {totalProblems}
            </Typography>
          </Paper>
        </Grid>

        {/* Subject Distribution Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom>
              Problems per Subject
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectTopicData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={theme.palette.divider}
                  vertical={false}
                />
                <XAxis 
                  dataKey="name" 
                  stroke={theme.palette.text.secondary}
                  tick={{ fill: theme.palette.text.secondary }}
                  axisLine={{ stroke: theme.palette.divider }}
                />
                <YAxis 
                  stroke={theme.palette.text.secondary}
                  tick={{ fill: theme.palette.text.secondary }}
                  axisLine={{ stroke: theme.palette.divider }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: theme.shape.borderRadius,
                    boxShadow: theme.shadows[2],
                  }}
                  cursor={{ fill: theme.palette.action.hover }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  wrapperStyle={{
                    paddingBottom: '20px'
                  }}
                />
                <Bar 
                  dataKey="topics" 
                  name="Topics" 
                  fill={theme.palette.primary.light}
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="problems" 
                  name="Problems" 
                  fill={theme.palette.secondary.light}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Difficulty Distribution Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom>
              Problem Difficulty Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={difficultyChartData}
                margin={{ top: 16, right: 16, left: 0, bottom: 0 }}
                barSize={27}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={theme.palette.divider}
                  vertical={false}
                />
                <XAxis 
                  dataKey="name" 
                  stroke={theme.palette.text.secondary}
                  tick={{ fill: theme.palette.text.secondary }}
                  axisLine={{ stroke: theme.palette.divider }}
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis 
                  stroke={theme.palette.text.secondary}
                  tick={{ fill: theme.palette.text.secondary }}
                  axisLine={{ stroke: theme.palette.divider }}
                  tickCount={7}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: theme.shape.borderRadius,
                    boxShadow: theme.shadows[2],
                  }}
                  cursor={{ fill: theme.palette.action.hover }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  wrapperStyle={{
                    paddingBottom: '20px'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  name="Problems" 
                  fill={theme.palette.secondary.light}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Problem Statistics Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Problem Statistics
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  select
                  size="small"
                  label="Subject"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  sx={{ width: 150 }}
                >
                  <MenuItem value="">All Subjects</MenuItem>
                  {subjects.map((subject) => (
                    <MenuItem key={subject} value={subject}>
                      {subject}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  size="small"
                  label="Topic"
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  sx={{ width: 150 }}
                >
                  <MenuItem value="">All Topics</MenuItem>
                  {topics.map((topic) => (
                    <MenuItem key={topic} value={topic}>
                      {topic}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  size="small"
                  label="Difficulty"
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  sx={{ width: 150 }}
                >
                  <MenuItem value="">All Difficulties</MenuItem>
                  {difficulties.map((difficulty) => (
                    <MenuItem key={difficulty} value={difficulty}>
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  size="small"
                  placeholder="Search problems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: 300 }}
                />
              </Box>
            </Box>
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Problem Title</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Topic</TableCell>
                    <TableCell>Difficulty</TableCell>
                    <TableCell align="right">Attempts</TableCell>
                    <TableCell align="right">Success Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {problemStats.map((problem, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{problem.title}</TableCell>
                      <TableCell>{problem.subject}</TableCell>
                      <TableCell>{problem.topic}</TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            color: problem.difficulty === 'easy' 
                              ? 'success.main' 
                              : problem.difficulty === 'medium' 
                                ? 'warning.main' 
                                : 'error.main'
                          }}
                        >
                          {problem.difficulty}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{problem.attempts}</TableCell>
                      <TableCell align="right">
                        <Typography
                          sx={{
                            color: problem.successRate >= 70 
                              ? 'success.main' 
                              : problem.successRate >= 40 
                                ? 'warning.main' 
                                : 'error.main'
                          }}
                        >
                          {problem.successRate.toFixed(1)}%
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsView; 