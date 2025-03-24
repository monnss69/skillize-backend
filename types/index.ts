export interface CourseOverview {
    estimatedTime: string;
    title: string;
    description: string;
    aim: string;
}

export interface AIResponse {
    question: string[];
    courseOverview: CourseOverview[];
}

export interface AICreateWithQuestionAndAnswerResponse extends AICreateRequest {
    question: string[];
    answer: string[];
}

export interface AICreateRequest {
    duration: string;
    dailyStudyTime: string;
    learningSubject: string;
    goal: string;
}