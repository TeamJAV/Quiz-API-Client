import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHeaderConfig } from "../../utils/Users";
import Container from "react-bootstrap/Container";
import { useHistory, useParams } from "react-router-dom";
import { getErrorMessage } from "../../utils/utils";

export default function Result({ live = false }) {
    const { id } = useParams();
    const [result, setResult] = useState([]);
    const [quiz, setQuiz] = useState({});
    const headerConfig = useHeaderConfig();
    const history = useHistory();

    const [percent, setPercent] = useState({});
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    console.log(percent);

    useEffect(() => {
        axios
            .get(`/api/teacher/result/detail_result/${id}`, headerConfig)
            .then((res) => {
                const data = res.data.data;
                console.log(data);

                setResult(data.result_live);
                setQuiz(data.quiz);
                setPercent(data.percent);

                //Let the server handle calculating percent in the future?
                // if (data?.result_live && Array.isArray(data.result_live)) {
                //     const p = {};
                //     data.result_live.forEach((student) => {
                //         student.student_choices.forEach((question) => {
                //             if (question.student_choice.correct) {
                //                 p[question.question_id] =
                //                     (p[question.question_id] || 0) + 1;
                //             }
                //         });
                //     });
                //     setTotalCorrect(p);
                // }
            })
            .catch((err) => alert(getErrorMessage(err)));
    }, []);

    useEffect(() => {}, [result]);

    const renderTableContent = () => {
        if (!quiz?.questions) return null;
        return (
            <table className="font-editor text-blue-900">
                <thead>
                    <tr>
                        <th>
                            <div className="flex justify-between">
                                <span>Name</span>
                                <span>Point</span>
                            </div>
                        </th>
                        {quiz.questions.map((q, index) => (
                            <th
                                className={q.question_type}
                                data-id={q.id}
                                key={index}
                                onClick={() => {
                                    if (!live) {
                                        history.push(
                                            `/teacher/reports/${id}/${q.id}`
                                        );
                                    }
                                }}
                            >
                                {index + 1}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {result.map((res, index) => (
                        <tr key={index}>
                            <td>
                                <div className="flex justify-between">
                                    <span>{res.student_name}</span>
                                    <span>{res.scores}</span>
                                </div>
                            </td>
                            {quiz.questions.map((q, index2) => {
                                const stdChoices = res.student_choices.filter(
                                    (std) => std.question_id === q.id
                                )[0]["student_choice"];
                                const choices = stdChoices["choices"];
                                const correct =
                                    choices.length === 0
                                        ? null
                                        : String(stdChoices["correct"]);
                                return (
                                    <td className={correct} key={index2}>
                                        {choices}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    <tr>
                        <td>
                            <div style={{ textAlign: "left" }}>
                                <span style={{ marginRight: "20px" }}>
                                    {result.length}
                                </span>
                                <span>Class Total</span>
                            </div>
                        </td>
                        {quiz.questions.map((q, index) => {
                            return (
                                <td key={index}>
                                    {result.length > 0
                                        ? percent?.[q.id]?.percent || "0%"
                                        : null}
                                </td>
                            );
                        })}
                    </tr>
                </tbody>
            </table>
        );
    };

    return (
        <Container fluid className="live-result-container">
            <div
                className="flex justify-between shadow-border-b"
                style={{ padding: "4rem 0", marginBottom: "20px" }}
            >
                <div className="text-blue-900">
                    <p className="text-xl font-700 m-0">{quiz?.title}</p>
                    <p className="text-md m-0">{quiz?.created_at}</p>
                </div>
            </div>
            {renderTableContent()}
        </Container>
    );
}
