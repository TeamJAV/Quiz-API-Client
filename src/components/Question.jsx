import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { _throw } from "../utils/utils";

export default function Question(props) {
    const {
        title,
        questionType,
        explain,
        correct,
        questionId,
        questionNo,
        image,
    } = props.question;

    const choices = Object.entries(props.question.choices);

    const [isLabelVisible, setIsLabelVisible] = useState(
        questionType === "multiple" ? true : false
    );
    const [isShortAnswer, setIsShortAnswer] = useState(
        questionType === "short-answer" ? true : false
    );

    console.log(choices);

    return (
        <Container
            key={questionId}
            fluid
            className="question flex items-start text-base font-editor bg-white shadow-border-t"
        >
            <div className="grid question-grid flex-1 ">
                <div className="grid question-fields  w-100 wm-64r">
                    <div className="w-100 h-100 flex justify-center align-center">
                        <span className="font-700 text-md">
                            {questionNo + "."}
                        </span>
                    </div>
                    <div className="flex col-start-2">
                        <div className="flex-1 question-input">{title}</div>
                    </div>
                </div>
                <div className="image-field col-start-2--lg row-span-2">
                    <div className="w-100 h-100">
                        <img
                            className="w-100 h-100"
                            src={image}
                            style={{
                                objectFit: "cover",
                            }}
                            alt=""
                        />
                    </div>
                </div>
                <div className="row-start-2--lg -mr-3r mr-0--md mt-1r">
                    {choices.map(([key, value], i) => (
                        <div
                            key={key}
                            className="grid question-fields wm-64r"
                        >
                            {isLabelVisible ? (
                                <div className="flex flex-none align-center justify-center w-100 h-100">
                                    <div
                                        className={`order order--rounded ${
                                            correct.includes(key)
                                                ? "order--true"
                                                : ""
                                        }`}
                                    >
                                        <span className="font-700">{key}</span>
                                    </div>
                                </div>
                            ) : isShortAnswer ? (
                                <div className="w-3r h-3r flex justify-center align-center"></div>
                            ) : null}
                            <div className="flex col-start-2 col-span-2 flex-1">
                                <div className="flex-1 question-input">
                                    {value}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div
                        key="explanation"
                        className="grid question-fields wm-64r mt-1r"
                    >
                        <div className="flex align-center justify-center w-100 h-100">
                            <div className="order order--rounded2 order--shadow">
                                <span className="font-700">i</span>
                            </div>
                        </div>
                        <div className="flex col-start-2">
                            <div className="flex-1 question-input">
                                {explain}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col flex-none button-field">
                <Button
                    className="w-3r h-3r btn-main"
                    // onClick={() => {
                    //     try {
                    //         const question = createQuestionObject();
                    //         console.log(question);
                    //     } catch (err) {
                    //         console.log(err);
                    //     }
                    // }}
                >
                    <FontAwesomeIcon icon={faCheck} size="lg"></FontAwesomeIcon>
                </Button>
                <Button
                    className="w-3r h-3r mt-1r btn-sub"
                    variant="outline-light"
                    // onClick={() => deleteQuestion()}
                >
                    <FontAwesomeIcon
                        icon={faTrashAlt}
                        size="lg"
                    ></FontAwesomeIcon>
                </Button>
            </div>
        </Container>
    );
}
