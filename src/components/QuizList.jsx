import React from 'react'
import Container from 'react-bootstrap/Container'
import QuestionList from './QuestionList'

export default function QuizList() {
    return (
        <Container className="quiz-list">
            <QuestionList></QuestionList>
        </Container>
    )
}