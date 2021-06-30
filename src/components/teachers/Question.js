import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { _throw } from "../../utils/utils";

export default function Question(props) {
    const { title, questionType, explain, correct, id, image } = props.question;

    const questionNo = props.questionNo;
    const choices = Object.entries(props.question.choices);

    const [isLabelVisible, setIsLabelVisible] = useState(
        questionType === "multiple" ? true : false
    );
    const [isShortAnswer, setIsShortAnswer] = useState(
        questionType === "short-answer" ? true : false
    );

    console.log(choices);

    const renderMultipleChoices = () => {
        return choices.map(([key, value], i) => {
            const isCorrect = correct.includes(key);
            return (
                <div key={key} className="grid question-fields wm-64r">
                    {isLabelVisible ? (
                        <div className="flex flex-none align-center justify-center w-100 h-100">
                            <div
                                className={`order order--rounded ${
                                    isCorrect ? "order--true" : ""
                                }`}
                            >
                                <span className="font-700">{key}</span>
                            </div>
                        </div>
                    ) : isShortAnswer ? (
                        <div className="w-3r h-3r flex justify-center align-center"></div>
                    ) : null}
                    <div className="flex col-start-2 col-span-2 flex-1">
                        <div className="flex-1 question-input">{value}</div>
                    </div>
                </div>
            );
        });
    };

    const renderTrueFalseChoices = () => {
        const value = correct[0] === "A" ? true : false;
        return (
            <div key={correct[0]} className="grid question-fields wm-64r">
                <div className="w-3r h-3r flex justify-center align-center"></div>
                <div className="flex col-start-2 col-span-2 flex-1">
                    <div className={`question-input btn-custom btn-${value}`}>
                        {value ? "True" : "False"}
                    </div>
                </div>
            </div>
        );
    };

    const renderShortChoices = () => {
        return (
            <div className="grid question-fields wm-64r">
                <div className="flex col-start-2 col-span-2 flex-1">
                    <div className="w-3r h-3r flex justify-center align-center"></div>
                    <div className="flex flex-wrap col-start-2 col-span-2 flex-1">
                        {choices.map(([key, value], i) => {
                            return (
                                <div
                                    className="question-input bg-green--light text-green mr-1r brad-_25r"
                                    key={key}
                                >
                                    {value}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Container
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

                {image !== null && image !== undefined ? (
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
                ) : null}
                <div className="row-start-2--lg -mr-3r mr-0--md mt-1r">
                    {(() => {
                        switch (questionType) {
                            case "true-false":
                                return renderTrueFalseChoices();
                            case "short-answer":
                                return renderShortChoices();
                            case "multiple":
                            default:
                                return renderMultipleChoices();
                        }
                    })()}
                    {explain !== "" ? (
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
                    ) : null}
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
                    <FontAwesomeIcon
                        icon={faPencilAlt}
                        size="lg"
                    ></FontAwesomeIcon>
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
