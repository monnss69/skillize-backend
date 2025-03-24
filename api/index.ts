import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { aiCreateWithQuestionHandler, aiCreateWithQuestionAndAnswerHandler, testHandler } from '../handlers';

dotenv.config();
const app = express();

// Security middleware
app.use(express.json());
app.use(cors()); // Configure CORS as needed
app.options('*', cors());

// Body parsing middleware
app.use(express.json());

app.get('/', testHandler);

app.post('/ai-create-with-question', aiCreateWithQuestionHandler);
app.post('/ai-create-with-question-and-answer', aiCreateWithQuestionAndAnswerHandler);

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;