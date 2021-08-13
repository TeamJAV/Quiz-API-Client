import axios from "axios";
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { useHistory, useParams } from "react-router-dom";
import { useHeaderConfig } from "../../utils/Users";
import { getErrorMessage } from "../../utils/utils";
import Button from "react-bootstrap/Button";
import Pusher from "pusher-js";

export default function LiveResult() {
    const { id } = useParams();
    const [result, setResult] = useState([]);
    const [quiz, setQuiz] = useState({});
    const [testId, setTestId] = useState(null);
    const headerConfig = useHeaderConfig();
    const history = useHistory();

    console.log(quiz, result, testId);

    useEffect(() => {
        axios
            .get(`/api/teacher/result-live/${id}`, headerConfig)
            .then((res) => {
                const data = res.data.data;
                console.log(data);
                setResult(data.result_live);
                setQuiz(data.quiz);
                setTestId(data.key_channel);
            })
            .catch((err) => alert(getErrorMessage(err)));
    }, []);

    useEffect(() => {
        if (!testId) return;
        Pusher.logToConsole = true;
        const pusher = new Pusher(process.env.REACT_APP_PUSHER_APP_KEY, {
            cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER,
        });
        const channel = pusher.subscribe(`result-teacher.${testId}`);
        channel.bind("event-result-teacher", function (data) {
            // console.log(data);
            const newResult = data.map((d) => {
                const oldResult = result.filter((r) => r.id === d.id);
                if (oldResult.length === 0) return d;
                return {
                    ...oldResult[0],
                    scores: d.scores,
                    student_choices: d.student_choices,
                };
            });
            console.log(newResult);
            setResult(newResult);
        });
    }, [testId]);

    const renderTableContent = () => {
        if (!quiz?.questions) return null;
        return (
            <table>
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
                <div className="text-xl font-600">{quiz?.title}</div>
                <Button
                    className="btn-custom--2 btn-inc py-1r btn-finish btn-pill text-display font-600"
                    onClick={() => {
                        axios
                            .post(
                                `/api/teacher/room/${id}/stop-launch`,
                                {},
                                headerConfig
                            )
                            .then(() => history.push("/teacher/results"))
                            .catch((err) => alert(getErrorMessage(err)));
                    }}
                >
                    FINISH
                </Button>
            </div>
            {renderTableContent()}
        </Container>
    );
}
