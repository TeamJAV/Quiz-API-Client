import React, { useState, useRef, useEffect, useCallback } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Question from "./Question";
import QuestionEditor from "./QuestionEditor";
import { useHeaderConfig } from "../../utils/Users";
import { getErrorMessage } from "../../utils/utils";
import axios from "axios";
import {
    createQuestionFormData,
    createQuestionFromResponseAPI,
} from "../../utils/Questions";

/**
 *
 */

/**
 *
 * props.quiz = {
 *      id: ,
 *      title: ,
 * }
 */

const questionEditorInitState = {
    mode: "none", // 1 - none ; 2 - create; 3 - edit
    question: { questionType: "" },
    key: 0,
};

const fetchSaveEditedQuizAPI = (id, title, config) => {
    return axios.post(
        `/api/teacher/quiz/edit_quiz/${id}`,
        { quiz_title: title },
        config
    );
};

const fetchGetQuestionInQuizAPI = (id, config) => {
    return axios.get(`/api/teacher/question/list_question/${id}`, config);
};

const fetchCreateQuestion = (id, question, config) => {
    return axios.post(
        `/api/teacher/question/create_question/${id}`,
        question,
        config
    );
};

const fetchDeleteQuizAPI = (id, config) => {
    return axios.post(`/api/teacher/quiz/delete_quiz/${id}`, {}, config);
};

const fetchSaveEditedQuestion = (id, question, config) => {
    return axios.post(
        `/api/teacher/question/edit_question/${id}`,
        question,
        config
    );
};

const fetchDeleteQuestion = (id, config) => {
    return axios.post(
        `/api/teacher/question/delete_question/${id}`,
        {},
        config
    );
};

export default function Quiz({ setSelectedQuiz,...props }) {
    const { id: quizId, title: pQuizName } = props.quiz || {};

    const [quizName, setQuizName] = useState(pQuizName);
    const [questionEditor, setQuestionEditor] = useState(
        questionEditorInitState
    );

    const [questions, setQuestions] = useState([]);
    const quizNameInputRef = useRef();
    const headerConfig = useHeaderConfig();

    const onDeleteQuestion = useCallback((id) => {
        fetchDeleteQuestion(id, headerConfig)
            .then((res) => {
                setQuestions((questions) =>
                    questions.filter((q) => q.id !== id)
                );
            })
            .catch((err) => alert(getErrorMessage(err)));
    }, []);

    const onSaveEditedQuestion = useCallback((editedQuestion) => {
        const formData = createQuestionFormData(editedQuestion);
        fetchSaveEditedQuestion(editedQuestion.id, formData, headerConfig)
            .then((res) => {
                console.log(res.data.data);
                const savedQuestion = createQuestionFromResponseAPI(
                    res.data.data
                );
                setQuestions((questions) =>
                    questions.map((q) => {
                        if (savedQuestion.id === q.id) {
                            return savedQuestion;
                        }
                        return q;
                    })
                );
            })
            .catch((err) => getErrorMessage(err));
    }, []);

    const onSaveEditQuiz = useCallback(
        (title) => {
            if (questions.length === 0) {
                fetchDeleteQuizAPI(quizId, headerConfig)
                    .then(() => {
                        setSelectedQuiz("");
                    })
                    .catch((err) => {
                        alert(getErrorMessage(err));
                        setSelectedQuiz("");
                    });
            }
            if (title === pQuizName) {
                setSelectedQuiz("");
                return;
            }
            fetchSaveEditedQuizAPI(quizId, title, headerConfig)
                .then((res) => {
                    setSelectedQuiz("");
                })
                .catch((err) => {
                    alert(getErrorMessage(err));
                    setSelectedQuiz("");
                });
        },
        [questions]
    );

    const onCreateQuestion = useCallback((question) => {
        const formData = createQuestionFormData(question);
        fetchCreateQuestion(quizId, formData, headerConfig)
            .then((res) => {
                setQuestions((q) => [
                    ...q,
                    createQuestionFromResponseAPI(res.data.data),
                ]);
            })
            .catch((err) => {
                alert(getErrorMessage(err));
            });
    }, []);

    useEffect(() => {
        setQuestionEditor(questionEditorInitState);
    }, [questions]);

    useEffect(() => {
        fetchGetQuestionInQuizAPI(quizId, headerConfig)
            .then((res) => {
                console.log(res.data.data);
                setQuestions(
                    res.data.data.map((question) => {
                        return createQuestionFromResponseAPI(question);
                    })
                );
            })
            .catch((err) => {
                alert(getErrorMessage(err));
            });
    }, []);

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
                    onClick={() => {
                        onSaveEditQuiz(quizNameInputRef.current.value);
                    }}
                >
                    Save and exit
                </Button>
            </div>
            <ListQuestions
                quizId={quizId}
                questions={questions}
                onDelete={onDeleteQuestion}
                onSave={onSaveEditedQuestion}
            />
            {questionEditor.mode === "create" ? (
                <QuestionEditor
                    key={questionEditor.key}
                    question={questionEditor.question}
                    questionNo={questions.length + 1}
                    quizId={quizId}
                    onSave={(question) => {
                        onCreateQuestion(question);
                    }}
                    onDelete={() => {
                        setQuestionEditor({
                            mode: "none",
                            question: { questionType: "" },
                        });
                    }}
                />
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
                                    key: questionEditor.key + 1,
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
    console.log("render List");
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
                    />
                );
            })}
        </div>
    );
});
