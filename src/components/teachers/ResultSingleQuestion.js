import React, { useEffect, useState } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import { useParams } from "react-router-dom";
import { useHeaderConfig } from "../../utils/Users";
import { getErrorMessage } from "../../utils/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import ProgressBar from "react-bootstrap/ProgressBar";

export default function ResultSingleQuestion() {
    const { id, questionId } = useParams();
    const headerConfig = useHeaderConfig();
    const [result, setResult] = useState({});

    useEffect(() => {
        console.log(id, questionId);
        axios
            .get(
                `/api/teacher/result/detail_result/${id}/question/${questionId}`,
                headerConfig
            )
            .then((res) => {
                const data = res.data.data;
                console.log(data);
                setResult(data);
                // setQuiz(data.quiz);
                // setTestId(data.key_channel);
            })
            .catch((err) => alert(getErrorMessage(err)));
    }, []);

    const renderChoices = () => {
        if (!result?.question?.choices) return null;
        return Object.entries(result.question.choices).map(
            ([key, value], index) => {
                return (
                    <div
                        key={key}
                        className="grid question-fields result wm-64r"
                    >
                        {result?.question?.question_type === "short-answer" ? (
                            <div className="w-3r h-3r flex justify-center align-center"></div>
                        ) : (
                            <div className="flex flex-none align-center justify-center w-100 h-100">
                                <div
                                    className={`order order--rounded ${
                                        key === result?.question?.correct
                                            ? "order--true"
                                            : ""
                                    }`}
                                >
                                    <span className="font-700">{key}</span>
                                </div>
                            </div>
                        )}
                        <div className="flex col-start-2 col-span-2 flex-1">
                            <div
                                className={`flex-1 question-input progress-container ${
                                    // key === result?.question?.correct
                                    index === 0
                                        ? "true"
                                        : "false"
                                }`}
                            >
                                <ProgressBar
                                    className={`progress-question ${
                                        key === result?.question?.correct
                                            ? "true"
                                            : "false"
                                    }`}
                                    now={
                                        result?.percent?.[key]?.percent.split(
                                            "%"
                                        )[0] || 0
                                    }
                                ></ProgressBar>
                                <div className="progress-label answer">
                                    {value}
                                </div>
                                <div className="progress-label percent">
                                    {result?.percent?.[key]?.percent || "0%"}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
        );
    };

    const renderQuestionDetail = () => {
        return (
            <div className="question flex items-start text-base font-editor">
                <div className="grid question-grid flex-1 ">
                    <div className="grid question-fields result title w-100 wm-64r">
                        <div className="w-100 h-100 flex justify-center align-center">
                            <span className="font-700 text-md">
                                {result?.question?.id + "."}
                            </span>
                        </div>
                        <div className="flex col-start-2 align-center">
                            <div className="flex-1 question-input">
                                {result?.question?.title}
                            </div>
                        </div>
                    </div>

                    {result?.question?.img ? (
                        <div className="image-field col-start-2--lg row-span-2">
                            <div className="w-100 h-100">
                                <img
                                    className="w-100 h-100"
                                    src={result?.question?.img}
                                    style={{
                                        objectFit: "cover",
                                    }}
                                    alt=""
                                />
                            </div>
                        </div>
                    ) : null}
                    <div className="row-start-2--lg -mr-3r mr-0--md mt-1r">
                        {renderChoices()}
                        <div
                            key="explanation"
                            className="grid question-fields result explain wm-64r mt-1r result"
                        >
                            <div className="flex align-center justify-center w-100 h-100">
                                <div className="order order--rounded2 order--shadow">
                                    <span className="font-700">i</span>
                                </div>
                            </div>
                            <div className="flex col-start-2">
                                <div className="flex-1 question-input">
                                    {result?.question?.explain || ""}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Container fluid className="no-pd">
            <div
                className="flex justify-between shadow-border-b"
                style={{ padding: "4rem 0", marginBottom: "20px" }}
            >
                <div className="text-blue-900">
                    {/* <p className="text-xl font-700 m-0">{quiz?.title}</p>
                    <p className="text-md m-0">{quiz?.created_at}</p> */}
                    <p className="text-xl font-700 m-0">Test 3</p>
                    <p className="text-md m-0">Sun, Aug 15, 2021 9:43 PM</p>
                </div>
            </div>
            <div
                className="flex justify-between shadow-border-b"
                style={{ paddingBottom: "20px" }}
            >
                <Button className="btn-custom btn-trans text-sm">
                    <FontAwesomeIcon
                        icon={faChevronLeft}
                        style={{ marginRight: "20px" }}
                    ></FontAwesomeIcon>
                    Back to Results Table
                </Button>
            </div>
            {renderQuestionDetail()}
        </Container>
    );
}
