import React, { useContext, useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import { QuestionsContext } from "../../context/QuestionContext";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useHeaderConfig } from "../../utils/Users";
import { getErrorMessage } from "../../utils/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronLeft,
    faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export default function Question({ selectedQuestion, setSelectedQuestion }) {
    const { questions, setQuestions } = useContext(QuestionsContext);
    const { id, answered, choices, question_type, title, img, mapping } =
        (questions && questions[selectedQuestion]) || {};
    const [answer, setAnswer] = useState("");
    const headerConfig = useHeaderConfig("student");

    // TODO: currently, answer can only be one.
    // answer needs to be an array of user's answers.
    // So:
    // 1. answer state is an array
    // 2. every time answered context changes, answer need to be exactly equal to it (useEffect below)
    // 3. handleSubmitAnswer need to take value from array of answers
    // 4. when user chooses the answers from multiple choices questions,
    //      it needs to know whether user checks or unchecks that answer
    //      if check: add it to answer array,
    //      if uncheck: remove it from answer array.

    useEffect(() => {
        if (Array.isArray(answered)) {
            setAnswer(answered.length > 0 ? answered[0] : "");
        }
    }, [answered]);

    const renderSelectionChoices = () => {
        return choices.map(([key, value]) => {
            return (
                <div key={key} className="grid question-fields wm-64r">
                    <div className="flex col-start-2 col-span-2 flex-1">
                        <div className="w-3r h-3r flex justify-center align-center">
                            <div className="checkbox">
                                <div className="checkbox-rounded">
                                    <input
                                        className="input-1"
                                        id={key}
                                        type="checkbox"
                                        checked={key === answer}
                                        onChange={() => setAnswer(key)}
                                    ></input>
                                    <label htmlFor={key}></label>
                                </div>
                            </div>
                        </div>
                        {question_type === "multiple" ? (
                            <div className="flex-1 question-input">{value}</div>
                        ) : (
                            <div
                                className={`question-input btn-custom btn-${
                                    String(value).toLowerCase() || ""
                                }`}
                            >
                                {String(value)}
                            </div>
                        )}
                    </div>
                </div>
            );
        });
    };

    const renderShortChoices = () => {
        return (
            <div className="grid question-fields wm-64r">
                <div className="flex col-start-2 col-span-2 flex-1">
                    <div className="w-3r h-3r flex justify-center align-center"></div>
                    <div className="flex flex-wrap col-start-2 col-span-2 flex-1">
                        <input
                            className="flex-1 question-input input-1"
                            type="text"
                            name="choices"
                            value={answer}
                            placeholder="Your answer"
                            onChange={(e) => {
                                setAnswer(e.target.value);
                            }}
                        ></input>
                    </div>
                </div>
            </div>
        );
    };

    const handleSaveAnswer = () => {
        setQuestions((questions) =>
            questions.map((q) =>
                q.id === id ? { ...q, answered: [answer] } : q
            )
        );
    };

    const handleChangeQuestion = (type) => {
        handleSaveAnswer();
        if ((selectedQuestion === 0) & (type === "dec")) return;
        if (selectedQuestion === questions.length - 1 && type === "inc") return;
        if (type === "dec") setSelectedQuestion((sq) => sq - 1);
        if (type === "inc") setSelectedQuestion((sq) => sq + 1);
    };

    const handleSubmitAnswer = () => {
        console.log({
            question_id: id,
            choices: [
                question_type === "short-answer" ? answer : mapping[answer],
            ],
            type: question_type,
            mapping: mapping,
        });
        axios
            .post(
                "/api/student/submit-answer",
                {
                    answer: {
                        question_id: id,
                        choices: [
                            question_type === "short-answer"
                                ? answer
                                : mapping[answer],
                        ],
                        type: question_type,
                    },
                    is_finished: 0,
                },
                headerConfig
            )
            .then(() => {
                setQuestions((prevQuestions) =>
                    prevQuestions.map((q) =>
                        q.id === id ? { ...q, isSubmitted: true } : q
                    )
                );
            })
            .catch((err) => alert(getErrorMessage(err)));
    };

    return questions && questions[selectedQuestion] ? (
        <>
            <Container
                fluid
                className="question flex items-start text-base font-editor bg-grey--light"
            >
                <div className="grid question-grid flex-1 ">
                    <div className="grid question-fields  w-100 wm-64r">
                        <div className="w-100 h-100 flex justify-center align-center">
                            <span className="font-700 text-md">
                                {parseInt(selectedQuestion) + 1 + "."}
                            </span>
                        </div>
                        <div className="flex col-start-2">
                            <div className="flex-1 question-input">{title}</div>
                        </div>
                    </div>

                    {img !== null && img !== undefined ? (
                        <div className="image-field col-start-2--lg row-span-2">
                            <div className="w-100 h-100">
                                <img
                                    className="w-100 h-100"
                                    src={img}
                                    style={{
                                        objectFit: "cover",
                                    }}
                                    alt=""
                                />
                            </div>
                        </div>
                    ) : null}
                    <div className="row-start-2--lg -mr-3r mr-0--md mt-1r">
                        {(() => {
                            switch (question_type) {
                                case "short-answer":
                                    return renderShortChoices();
                                case "multiple":
                                case "true-false":
                                default:
                                    return renderSelectionChoices();
                            }
                        })()}
                    </div>
                </div>
            </Container>
            <div className="w-100 flex justify-between button-field">
                <Button
                    className="btn-main btn-change-question text-base"
                    onClick={() => {
                        handleChangeQuestion("dec");
                    }}
                    disabled={selectedQuestion <= 0}
                >
                    <FontAwesomeIcon
                        icon={faChevronLeft}
                        size="lg"
                    ></FontAwesomeIcon>
                </Button>
                {!questions[selectedQuestion]?.isSubmitted ? (
                    <Button
                        className="btn-main--orange btn-change-question text-base"
                        onClick={handleSubmitAnswer}
                    >
                        Submit
                    </Button>
                ) : (
                    <Button
                        className="btn-main--orange btn-change-question text-base"
                        onClick={handleSubmitAnswer}
                        style={{backgroundColor: "#4FBF26"}}
                    >
                        Submitted
                    </Button>
                )}

                <Button
                    className="btn-main btn-change-question text-base"
                    onClick={() => {
                        handleChangeQuestion("inc");
                    }}
                    disabled={selectedQuestion >= questions.length - 1}
                >
                    <FontAwesomeIcon
                        icon={faChevronRight}
                        size="lg"
                    ></FontAwesomeIcon>
                </Button>
            </div>
        </>
    ) : (
        <h2>isLoading</h2>
    );
}
