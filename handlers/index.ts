import { RequestHandler } from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { prompt } from '../constants/prompt';
import { AICreateRequest, AICreateWithQuestionAndAnswerResponse, AIResponse } from '../types';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export const testHandler: RequestHandler = (req, res) => {
    res.json({
        message: 'API Works'
    });
};

export const aiCreateWithQuestionHandler: RequestHandler = async (req, res) => {
    const { duration, dailyStudyTime, learningSubject, goal } = req.body as AICreateRequest;
    
    // Validate required fields
    if (!duration || !dailyStudyTime || !learningSubject || !goal) {
        res.status(400).json({ 
            error: 'Missing required fields. Please provide duration, dailyStudyTime, learningSubject, and goal.' 
        });
        return;
    }

    // Replace placeholders in the prompt template
    const formattedPrompt = prompt.aiCreateWithQuestion
        .replace(/\[DURATION\]/g, duration)
        .replace(/\[DAILY STUDY TIME\]/g, dailyStudyTime)
        .replace(/\[LEARNING SUBJECT\]/g, learningSubject)
        .replace(/\[GOAL\]/g, goal);
    
    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: formattedPrompt }],
            model: "o4-mini",
        });

        const messageContent = completion.choices[0].message.content;
        console.log(messageContent);
        
        if (!messageContent) {
            res.status(500).json({ error: 'No response from AI' });
            return;
        }

        try {
            const parsedMessage = JSON.parse(messageContent) as AIResponse;
            res.json(parsedMessage);
        } catch (parseError) {
            console.error('Failed to parse AI response as JSON:', parseError);
            res.status(500).json({ error: 'Invalid JSON response from AI' });
        }
    } catch (error) {
        console.error('OpenAI API error:', error);
        res.status(500).json({ error: 'Failed to get AI response' });
    }
};

export const aiCreateWithQuestionAndAnswerHandler: RequestHandler = async (req, res) => {
    const { duration, dailyStudyTime, learningSubject, goal, question, answer } = req.body as AICreateWithQuestionAndAnswerResponse;
    
    // Validate required fields
    if (!duration || !dailyStudyTime || !learningSubject || !goal || !question || !answer) {
        res.status(400).json({ 
            error: 'Missing required fields. Please provide duration, dailyStudyTime, learningSubject, goal, question, and answer.' 
        });
        return;
    }

    if (question.length !== answer.length) {
        res.status(400).json({ 
            error: 'Question and answers invalid. Please provide a valid question and answer.' 
        });
        return;
    }

    // Replace placeholders in the prompt template
    let formattedPrompt = prompt.aiCreateWithQuestionAndAnswer
        .replace(/\[DURATION\]/g, duration)
        .replace(/\[DAILY STUDY TIME\]/g, dailyStudyTime)
        .replace(/\[LEARNING SUBJECT\]/g, learningSubject)
        .replace(/\[GOAL\]/g, goal);

    for(let i = 0; i < question.length; i++) {
        formattedPrompt += `
        Expert: ${question[i]}
        User: ${answer[i]}
        `;
    }

    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: formattedPrompt }],
            model: "o4-mini",
        });

        const messageContent = completion.choices[0].message.content;
        console.log(messageContent);

        if (!messageContent) {
            res.status(500).json({ error: 'No response from AI' });
            return;
        }

        try {
            const parsedMessage = JSON.parse(messageContent) as AICreateWithQuestionAndAnswerResponse;
            res.json(parsedMessage);
        } catch (parseError) {
            console.error('Failed to parse AI response as JSON:', parseError);
            res.status(500).json({ error: 'Invalid JSON response from AI' });
        }
    } catch (error) {
        console.error('OpenAI API error:', error);
        res.status(500).json({ error: 'Failed to get AI response' });
    }
};

