import express from 'express';
import cors from 'cors';
const app = express();

// Security middleware
app.use(cors()); // Configure CORS as needed

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app; 