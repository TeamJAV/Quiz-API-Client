import React, { useState, useRef, useEffect, useCallback } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Question from "./Question";
import QuestionEditor from "./QuestionEditor";
import { nanoid } from "nanoid";

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

const questionEditorInitState = {
    mode: "none", // 1 - none ; 2 - create; 3 - edit
    question: { questionType: "" },
};

const fakeQuestion = [
    {
        title: "bangbros",
        questionType: "true-false",
        explain: "true-false",
        choices: {
            A: "true",
            B: "false",
        },
        correct: ["A"],
        id: "a218",
        questionNo: 2,
        image: "https://pix10.agoda.net/hotelImages/294/294166/294166_15040615130026720872.jpg?s=1024x768",
    },
    {
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
        id: "a217",
        questionNo: 1,
        image: "https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg",
    },
    {
        title: "brazzers",
        questionType: "short-answer",
        explain: "asdfkhjaklsd",
        choices: {
            A: "abc",
            B: "zyz",
            C: "Hotel California",
            D: "Baby 1 more time",
            E: "This is luck",
        },
        correct: ["A", "B", "C", "D", "E"],
        id: "a219",
        questionNo: 3,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQp2MSeY4hViZvKC4bU5vUWamLoAKwjZrfTA&usqp=CAU",
    },
];

export default function Quiz(props) {
    const { quizId = 3, quizName: pQuizName = "Untitled" } =
        props.quiz || {};

    const [quizName, setQuizName] = useState(pQuizName);
    const [questionEditor, setQuestionEditor] = useState(
        questionEditorInitState
    );

    const [questions, setQuestions] = useState(fakeQuestion);
    const quizNameInputRef = useRef();

    const onDeleteQuestion = useCallback((id) => {
        setQuestions((questions) => questions.filter((q) => q.id !== id));
    }, []);

    const onSaveEditQuestion = useCallback((editedQuestion) => {
        console.log("save")
        setQuestions((questions) =>
            questions.map((q) => {
                if (editedQuestion.id === q.id) {
                    return editedQuestion;
                }
                return q;
            })
        );
    }, []);

    useEffect(() => {
        setQuestionEditor(questionEditorInitState);
    }, [questions]);

    return (
        <Container fluid className="quiz-container px-0" id="quiz-container">
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
            <ListQuestions
                quizId={quizId}
                questions={questions}
                onDelete={onDeleteQuestion}
                onSave={onSaveEditQuestion}
            ></ListQuestions>
            {questionEditor.mode === "create" ? (
                <QuestionEditor
                    question={questionEditor.question}
                    questionNo={questions.length + 1}
                    quizId={quizId}
                    onSave={(question) => {
                        setQuestions((prevQuestions) => [
                            ...prevQuestions,
                            question,
                        ]);
                    }}
                    onDelete={() => {
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

const ListQuestions = React.memo((props) => {
    console.log("render List")
    return (
        <div className="question-list">
            {props.questions.map((question, index) => {
                return (
                    <Question
                        key={question.id}
                        question={question}
                        questionNo={index + 1}
                        quizId={props.quizId}
                        onDelete={props.onDelete}
                        onSave={props.onSave}
                    ></Question>
                );
            })}
        </div>
    );
});
