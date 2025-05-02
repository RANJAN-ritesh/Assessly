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

    // Fetch topics with their recaps
    const topics = await Topic.find({ _id: { $in: topicIds } });
    const topicMap = Object.fromEntries(topics.map(t => [t._id.toString(), t]));

    // Fetch additional recaps from Recap model
    const recaps = await Recap.find({ topicId: { $in: topicIds } });
    const recapMap = Object.fromEntries(recaps.map(r => [r.topicId.toString(), r]));

    // Combine recaps from both models, preferring Recap model if available
    const result = topicIds.map(topicId => {
      const topic = topicMap[topicId.toString()];
      const recap = recapMap[topicId.toString()];
      
      if (!topic) return null;

      return {
        topicId,
        name: topic.name,
        recap: recap ? recap.recap : topic.recap
      };
    }).filter(Boolean);

    res.json({ recaps: result });
  } catch (err) {
    console.error('Recap Fetch Error:', err);
    res.status(500).json({ error: 'Failed to fetch recaps.' });
  }
});

export default router; 