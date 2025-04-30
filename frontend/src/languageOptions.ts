export interface LanguageOption {
  id: number; // Judge0 language ID
  value: string; // Monaco language value
  label: string; // Display label
}

export const languageOptions: LanguageOption[] = [
  { id: 63, value: 'javascript', label: 'JavaScript (Node.js 12.14.0)' },
  { id: 71, value: 'python', label: 'Python (3.8.1)' },
  { id: 54, value: 'cpp', label: 'C++ (GCC 9.2.0)' },
  { id: 62, value: 'java', label: 'Java (OpenJDK 13.0.1)' },
  { id: 68, value: 'php', label: 'PHP (7.4.1)' },
  { id: 50, value: 'c', label: 'C (GCC 9.2.0)' },
  { id: 60, value: 'go', label: 'Go (1.13.5)' },
  { id: 80, value: 'typescript', label: 'TypeScript (3.7.4)' },
  { id: 43, value: 'plaintext', label: 'Plain Text' },
  { id: 38, value: 'html', label: 'HTML (with JS/CSS)' }, // HTML (custom handling)
]; 