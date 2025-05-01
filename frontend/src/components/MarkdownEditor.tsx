import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Paper,
  useTheme,
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as PreviewIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownEditorProps {
  title: string;
  content: string;
  open: boolean;
  onClose: () => void;
  onSave: (content: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  title,
  content,
  open,
  onClose,
  onSave,
}) => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleSave = () => {
    onSave(editedContent);
    setIsEditing(false);
  };

  const midnightBlueTheme = {
    backgroundColor: '#1a1f2e',
    color: '#e0e0e0',
    borderColor: '#2a2f3e',
    codeBackground: '#2a2f3e',
    linkColor: '#64b5f6',
    headingColor: '#ffffff',
    blockquoteBorder: '#3a3f4e',
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          background: 'linear-gradient(145deg, #1a1f2e, #2a2f3e)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#ffffff',
          borderBottom: `1px solid ${midnightBlueTheme.borderColor}`,
          background: 'linear-gradient(90deg, #1a1f2e, #2a2f3e)',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Box>
          <IconButton
            onClick={() => setIsEditing(!isEditing)}
            sx={{ color: '#ffffff' }}
          >
            {isEditing ? <PreviewIcon /> : <EditIcon />}
          </IconButton>
          <IconButton onClick={onClose} sx={{ color: '#ffffff' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent
        sx={{
          padding: 2,
          background: 'linear-gradient(145deg, #1a1f2e, #2a2f3e)',
        }}
      >
        {isEditing ? (
          <TextField
            fullWidth
            multiline
            rows={15}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#2a2f3e',
                color: '#e0e0e0',
                '& fieldset': {
                  borderColor: midnightBlueTheme.borderColor,
                },
                '&:hover fieldset': {
                  borderColor: '#3a3f4e',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#64b5f6',
                },
              },
            }}
          />
        ) : (
          <Paper
            elevation={0}
            sx={{
              padding: 3,
              backgroundColor: midnightBlueTheme.backgroundColor,
              color: midnightBlueTheme.color,
              borderRadius: 2,
              border: `1px solid ${midnightBlueTheme.borderColor}`,
              '& pre': {
                backgroundColor: midnightBlueTheme.codeBackground,
                padding: 2,
                borderRadius: 1,
                overflowX: 'auto',
              },
              '& code': {
                backgroundColor: midnightBlueTheme.codeBackground,
                padding: '0.2em 0.4em',
                borderRadius: 2,
                fontSize: '0.9em',
              },
              '& a': {
                color: midnightBlueTheme.linkColor,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              },
              '& h1, & h2, & h3, & h4, & h5, & h6': {
                color: midnightBlueTheme.headingColor,
                marginTop: 2,
                marginBottom: 1,
              },
              '& blockquote': {
                borderLeft: `4px solid ${midnightBlueTheme.blockquoteBorder}`,
                paddingLeft: 2,
                marginLeft: 0,
                fontStyle: 'italic',
              },
              '& table': {
                borderCollapse: 'collapse',
                width: '100%',
                marginBottom: 2,
              },
              '& th, & td': {
                border: `1px solid ${midnightBlueTheme.borderColor}`,
                padding: '8px',
              },
              '& th': {
                backgroundColor: midnightBlueTheme.codeBackground,
              },
              '& img': {
                maxWidth: '100%',
                borderRadius: 1,
              },
              '& ul, & ol': {
                paddingLeft: 2,
              },
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {editedContent}
            </ReactMarkdown>
          </Paper>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          padding: 2,
          borderTop: `1px solid ${midnightBlueTheme.borderColor}`,
          background: 'linear-gradient(90deg, #1a1f2e, #2a2f3e)',
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: '#ffffff',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            backgroundColor: '#64b5f6',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#4a9ed6',
            },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MarkdownEditor; 