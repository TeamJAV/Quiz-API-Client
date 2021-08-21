import axios from "axios";
import React, { useEffect, useState } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import Container from "react-bootstrap/Container";
import { useParams } from "react-router-dom";
import { useHeaderConfig } from "../../utils/Users";
import { getErrorMessage } from "../../utils/utils";

export default function ResultTab() {
    const [result, setResult] = useState("");
    const { rd_id, name, room } = useParams();
    useEffect(() => {
        if (!rd_id) return;
        axios
            .post(`/api/student/result-test/${rd_id}`, {}, {})
            .then((res) => {
                setResult(res.data.data);
                console.log(res.data.data);
            })
            .catch((err) => alert(getErrorMessage(err)));
    }, []);

    const calculateProgress = (a, b) => {
        return !a || !b || b === 0 || b < a ? 0 : Math.floor((a / b) * 100);
    };

    const score = result?.scores;
    const total =
        result?.student_choices &&
        Array.isArray(result.student_choices) &&
        result.student_choices.length;
    const progress = calculateProgress(score, total);
    console.log(score, total);

    return (
        <Container fluid className="text-center text-display s-result-tab">
            <h2>
                Your Score: {score}&#47;
                {total}
            </h2>
            <div className="progress-container">
                <ProgressBar
                    striped
                    animated={true}
                    now={progress}
                    label={`${progress}%`}
                ></ProgressBar>
            </div>
            <table>
                <tbody>
                    <tr>
                        <td>Joined at:</td>
                        <td>{result?.time_joined || ""}</td>
                    </tr>
                    <tr>
                        <td>Finished at:</td>
                        <td>{result?.time_end || ""}</td>
                    </tr>
                    <tr>
                        <td>Total Time(s):</td>
                        <td>{result?.time_do_seconds || ""}</td>
                    </tr>
                </tbody>
            </table>
        </Container>
    );
}
