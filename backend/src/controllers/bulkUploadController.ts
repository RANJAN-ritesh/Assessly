import { Request, Response } from 'express';
import fs from 'fs';
import { parse } from 'csv-parse';
import { Subject } from '../models/Subject';
import { Topic } from '../models/Topic';
import { Problem } from '../models/Problem';

export const handleBulkUpload = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const createdSubjects: string[] = [];
  const createdTopics: string[] = [];
  const createdProblems: string[] = [];
  const skipped: string[] = [];

  const filePath = req.file.path;
  const parser = fs.createReadStream(filePath).pipe(parse({ columns: true, trim: true }));

  try {
    for await (const row of parser) {
      const subjectName = (row['Subject Name'] || '').trim();
      const topicName = (row['Topic Name'] || '').trim();
      const topicRecap = (row['Topic Recap'] || '').trim();
      const problemTitle = (row['Problem Title'] || '').trim();
      const problemDescription = (row['Problem Description'] || '').trim();
      const problemDifficulty = (row['Problem Difficulty'] || '').trim().toLowerCase();

      if (!subjectName || !topicName || !problemTitle) {
        skipped.push(`Missing required fields in row: ${JSON.stringify(row)}`);
        continue;
      }

      // Find or create subject (case-insensitive)
      let subject = await Subject.findOne({ name: { $regex: `^${subjectName}$`, $options: 'i' } });
      if (!subject) {
        subject = new Subject({ name: subjectName });
        await subject.save();
        createdSubjects.push(subjectName);
      }

      // Find or create topic (case-insensitive, under subject)
      let topic = await Topic.findOne({
        name: { $regex: `^${topicName}$`, $options: 'i' },
        subjectId: subject._id,
      });
      if (!topic) {
        topic = new Topic({ name: topicName, subjectId: subject._id, recap: topicRecap });
        await topic.save();
        createdTopics.push(`${subjectName} > ${topicName}`);
      } else if (topicRecap && topic.recap !== topicRecap) {
        topic.recap = topicRecap;
        await topic.save();
      }

      // Check for duplicate problem (case-insensitive, under topic)
      const existingProblem = await Problem.findOne({
        title: { $regex: `^${problemTitle}$`, $options: 'i' },
        topicId: topic._id,
      });
      if (existingProblem) {
        skipped.push(`Problem already exists: ${subjectName} > ${topicName} > ${problemTitle}`);
        continue;
      }

      // Create problem
      const problem = new Problem({
        title: problemTitle,
        description: problemDescription,
        difficulty: ['easy', 'medium', 'hard'].includes(problemDifficulty) ? problemDifficulty : 'easy',
        topicId: topic._id,
      });
      await problem.save();
      createdProblems.push(`${subjectName} > ${topicName} > ${problemTitle}`);
    }
    fs.unlinkSync(filePath);
    res.json({ createdSubjects, createdTopics, createdProblems, skipped });
  } catch (err) {
    fs.unlinkSync(filePath);
    res.status(500).json({ error: 'Failed to process CSV', details: err instanceof Error ? err.message : String(err) });
  }
}; 