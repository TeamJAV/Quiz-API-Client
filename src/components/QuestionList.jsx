import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import QuestionEditor from "./QuestionEditor";

export default function QuestionList(props) {
    const quizId = props.quizId;
    const [questionEditor, setQuestionEditor] = useState({
        mode: "none", // 1 - none ; 2 - create; 3 - edit
        question: { questionType: "" },
    });
    console.log(questionEditor);
    return (
        <Container fluid className="question-list px-0">
            {questionEditor.mode === "create" ? (
                <QuestionEditor
                    question={questionEditor.question}
                    quizId={quizId}
                    delete={() => {
                        setQuestionEditor({
                            mode: "none",
                            question: { questionType: "" },
                        });
                    }}
                ></QuestionEditor>
            ) : null}
            <div>
                <p>Add a Question</p>
                <div className="flex justify-center align-center">
                    {[
                        ["multiple", "Multiple Choice"],
                        ["true-false", "True/False"],
                        ["short-answer", "Short Answer"],
                    ].map((btn, index) => (
                        <Button
                            key={index}
                            onClick={() => {
                                setQuestionEditor({
                                    mode: "create",
                                    question: { questionType: btn[0] },
                                });
                            }}
                        >
                            {btn[1]}
                        </Button>
                    ))}
                </div>
            </div>
        </Container>
    );
}
