import express from 'express';
import axios from 'axios';

const router = express.Router();

// POST /api/run
router.post('/', async (req, res) => {
  const { code, languageId, input } = req.body;
  if (!code || !languageId) {
    return res.status(400).json({ error: 'Code and languageId are required.' });
  }

  try {
    const submissionRes = await axios.post(
      process.env.JUDGE0_URL || 'https://judge0-ce.p.rapidapi.com/submissions',
      {
        language_id: languageId,
        source_code: Buffer.from(code).toString('base64'),
        stdin: input ? Buffer.from(input).toString('base64') : '',
      },
      {
        params: { base64_encoded: 'true', fields: '*' },
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Host': process.env.JUDGE0_HOST,
          'X-RapidAPI-Key': process.env.JUDGE0_KEY,
        },
      }
    );
    const token = submissionRes.data.token;
    // Poll for result
    let result = null;
    for (let i = 0; i < 10; i++) {
      const statusRes = await axios.get(
        `${process.env.JUDGE0_URL || 'https://judge0-ce.p.rapidapi.com/submissions'}/${token}`,
        {
          params: { base64_encoded: 'true', fields: '*' },
          headers: {
            'X-RapidAPI-Host': process.env.JUDGE0_HOST,
            'X-RapidAPI-Key': process.env.JUDGE0_KEY,
          },
        }
      );
      result = statusRes.data;
      if (![1, 2].includes(result.status?.id)) break; // 1: In Queue, 2: Processing
      await new Promise((r) => setTimeout(r, 1500));
    }
    res.json({ result });
  } catch (err: any) {
    console.error('Judge0 Error:', err?.response?.data || err.message);
    res.status(500).json({ error: 'Failed to run code.' });
  }
});

export default router; 