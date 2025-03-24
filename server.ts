import express, { RequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const app = express();

// Security middleware
app.use(cors()); // Configure CORS as needed
app.options('*', cors());

// Body parsing middleware
app.use(express.json());

// Start server
const handler: RequestHandler = (req, res) => {
    res.json({
        message: 'API Works'
    });
};

app.get('/', handler);

app.post('/ai-create', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4o-mini",
        });

        res.json({
            message: completion.choices[0].message.content
        });
    } catch (error) {
        console.error('OpenAI API Error:', error);
        res.status(500).json({ error: 'Failed to process AI request' });
    }
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;