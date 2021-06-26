import React from 'react'
import Container from 'react-bootstrap/Container'
import QuestionList from './QuestionList'

export default function QuizTab() {
    return (
        <Container fluid className="quiz-tab px-0">
            <QuestionList quizId="3"></QuestionList>
        </Container>
    )
}
