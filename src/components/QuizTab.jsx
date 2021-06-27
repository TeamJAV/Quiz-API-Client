import React from 'react'
import Container from 'react-bootstrap/Container'
import QuizList from './QuizList'

export default function QuizTab() {
    return (
        <Container fluid className="quiz-tab px-0">
            <QuizList></QuizList>
        </Container>
    )
}
