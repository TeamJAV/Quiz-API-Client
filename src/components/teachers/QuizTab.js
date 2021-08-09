import React from "react";
import { useState } from "react";
import Container from "react-bootstrap/Container";
import Quiz from "./Quiz";
import QuizList from "./QuizList";

export default function QuizTab() {
    const [selectedQuiz, setSelectedQuiz] = useState("");

    return (
        <Container fluid className="quiz-tab px-0">
            {selectedQuiz === "" ? (
                <QuizList onSelect={setSelectedQuiz}></QuizList>
            ) : (
                <Quiz quiz={selectedQuiz} setSelectedQuiz={setSelectedQuiz}></Quiz>
            )}
        </Container>
    );
}
