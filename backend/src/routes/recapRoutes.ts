import express from 'express';
import { Recap } from '../models/Recap';
import { Topic } from '../models/Topic';

const router = express.Router();

// POST /api/recaps
router.post('/', async (req, res) => {
  try {
    const { topicIds } = req.body;
    if (!topicIds || !Array.isArray(topicIds) || topicIds.length === 0) {
      return res.status(400).json({ error: 'topicIds are required.' });
    }
    // Fetch recaps for the given topic IDs
    const recaps = await Recap.find({ topicId: { $in: topicIds } });
    // Fetch topic names for the recaps
    const topics = await Topic.find({ _id: { $in: topicIds } });
    const topicMap = Object.fromEntries(topics.map(t => [t._id.toString(), t.name]));
    const result = recaps.map(r => ({
      topicId: r.topicId,
      name: topicMap[r.topicId.toString()] || '',
      recap: r.recap
    }));
    res.json({ recaps: result });
  } catch (err) {
    console.error('Recap Fetch Error:', err);
    res.status(500).json({ error: 'Failed to fetch recaps.' });
  }
});

export default router; 