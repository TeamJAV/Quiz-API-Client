import React, { useState, useRef } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Question from "./Question";
import QuestionEditor from "./QuestionEditor";

/**
 *
 */

/**
 *
 * props.quiz = {
 *      quizId: ,
 *      quizName: ,
 * }
 */

export default function Quiz(props) {
    const { quizId: pQuizId = null, quizName: pQuizName = "Untitled" } =
        props.quiz || {};

    const [quizId, setQuizId] = useState(pQuizId);
    const [quizName, setQuizName] = useState(pQuizName);
    const [questionEditor, setQuestionEditor] = useState({
        mode: "none", // 1 - none ; 2 - create; 3 - edit
        question: { questionType: "" },
    });

    const quizNameInputRef = useRef();

    const fakeQuestion = {
        title: "fake taxi",
        questionType: "multiple",
        explain: "explain yourself",
        choices: {
            A: "asd",
            B: "fghd",
            C: "wrtwertwert",
            D: "fghdfghdfghdfgh",
        },
        correct: ["B", "D"],
        questionId: "a217",
        questionNo: 1,
        image: "https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg",
    };

    console.log(questionEditor);
    return (
        <Container fluid className="question-list px-0" id="question-list">
            <div
                className="w-100 justify-between py-3r flex"
                id="name-input-container"
            >
                <textarea
                    className="text-xl font-700"
                    id="quiz-name-edit"
                    type="text"
                    defaultValue={quizName}
                    ref={quizNameInputRef}
                    rows="1"
                    maxLength="128"
                    placeholder="Untitled"
                />
                <Button
                    className="btn-save-quiz text-display"
                    id="btn-save-quiz"
                    onClick={(e) => {
                        console.log(quizNameInputRef.current.value);
                    }}
                >
                    Save and exit
                </Button>
            </div>
            <Question question={fakeQuestion}></Question>
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
            <div
                className={`py-5r ${
                    questionEditor.mode !== "create" ? "shadow-border-t" : ""
                }`}
            >
                <p className="text-center text-md">Add a Question</p>
                <div className="flex flex-wrap justify-center align-center">
                    {[
                        ["multiple", "Multiple Choice"],
                        ["true-false", "True/False"],
                        ["short-answer", "Short Answer"],
                    ].map((btn, index) => (
                        <Button
                            key={index}
                            className={
                                "btn-select-question btn-" + btn[0] + " m-0_5r"
                            }
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
