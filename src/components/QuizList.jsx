import React from 'react'
import Container from 'react-bootstrap/Container'
import Quiz from './Quiz'

export default function QuizList() {
    return (
        <Container className="quiz-list">
            <Quiz quiz={{quizId: 3, quizName: "abxyz"}}></Quiz>
        </Container>
    )
}