import React, { useState, useContext, useEffect, useMemo } from "react";
import Container from "react-bootstrap/Container";
import { RoomContext } from "../../context/RoomContext";
import HashLoader from "react-spinners/HashLoader";
import Pusher from "pusher-js";
import QuizSidebar from "./QuizSidebar";
import axios from "axios";
import { useHeaderConfig } from "../../utils/Users";
import { getErrorMessage } from "../../utils/utils";
import { QuestionsContext } from "../../context/QuestionContext";
import { handleShuffleQuiz } from "../../utils/Questions";
import Question from "./Question";
import Button from "react-bootstrap/Button";
import Countdown from "react-countdown";
import { useHistory } from "react-router-dom";
import { TimeProvider } from "../../context/TimeContext";
import { UserContext } from "../../context/UserContext";

const questionTemplate = {
    id: 12,
    answered: [],
    choices: {},
    question_type: "multiple",
    title: "asdasd",
    img: "https://",
    explain: null,
    mapping: { A: "A", B: "C" }, //key is current answer order after shuffle, value is the original
};
const RoomListener = ({ room, setRoom, children }) => {
    useEffect(() => {
        Pusher.logToConsole = true;
        const pusher = new Pusher(process.env.REACT_APP_PUSHER_APP_KEY, {
            cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER,
        });

        const channel = pusher.subscribe(`room.${room.r_id}`);
        channel.bind("event-room-online", function (data) {
            console.log(data);
            setRoom((r) => ({
                ...r,
                status: data.is_online ? "Online" : "Offline",
                shuffle_answer: data.is_shuffle_answer || false,
                shuffle_question: data.is_shuffle_question || false,
                time_offline: data.time_out || 60,
            }));
        });
    }, []);

    return room && room?.r_id && room?.status && room.status === "Online" ? (
        children
    ) : (
        <div className="loading-container text-center">
            <HashLoader
                color={"#ffa100"}
                size={100}
                css={{ display: "block", margin: "100px auto" }}
            />
            <p className="text-smd">Please wait the room to be open</p>
        </div>
    );
};

const QuestionSelector = () => {
    const [selectedQuestion, setSelectedQuestion] = useState(0);
    return (
        <Question
            selectedQuestion={selectedQuestion}
            setSelectedQuestion={setSelectedQuestion}
        ></Question>
    );
};

export default function QuizTab() {
    const {user} = useContext(UserContext)
    const { room, setRoom } = useContext(RoomContext);
    const { questions, setQuestions } = useContext(QuestionsContext);
    const isRoomValid = useMemo(
        () => room && room?.r_id && room?.status,
        [room]
    );
    const isRoomOffline = useMemo(
        () => isRoomValid && room.status === "Offline",
        [isRoomValid]
    );
    const studentHeaderConfig = useHeaderConfig("student");

    const history = useHistory();

    useEffect(() => {
        if (isRoomValid && !isRoomOffline && !questions) {
            axios
                .get("/api/student", studentHeaderConfig)
                .then((res) => {
                    const resQuestions = res.data.data.quiz.questions;
                    console.log(resQuestions);
                    setQuestions(
                        handleShuffleQuiz(
                            resQuestions,
                            room?.shuffle_question,
                            room?.shuffle_answer
                        )
                    );
                })
                .catch((err) => alert(getErrorMessage(err)));
        }
    }, [room, questions, isRoomValid, isRoomOffline]);

    const handleFinishQuiz = () => {
        const rd_id = user?.student?.rd_id || "";
        const name = user?.student?.name || "";
        const _room = room?.name || "";
        axios
            .post("/api/student/finished", {}, studentHeaderConfig)
            .then(() => {
                history.push(`/student/result/${rd_id}/${name}/${_room}`);
                setQuestions(null);
                setRoom((r) => ({ ...r, status: "Offline" }));
            })
            .catch((err) => alert(getErrorMessage(err)));
    };

    return (
        <Container fluid className="no-pd s-quiz-tab">
            <TimeProvider>
                <RoomListener room={room} setRoom={setRoom}>
                    <div className="flex justify-between info-container">
                        {/* <Countdown
                            date={
                                Date.now() +
                                parseInt(room.time_offline) * 60 * 1000
                            }
                            renderer={({ hours, minutes, seconds }) => (
                                <span>
                                    {hours < 10 ? "0" + hours : hours}:
                                    {minutes < 10 ? "0" + minutes : minutes}:
                                    {seconds < 10 ? "0" + seconds : seconds}
                                </span>
                            )}
                            onCompleted={() => history.push("/student/result")}
                        ></Countdown> */}
                        <div className="text-xl">00:00:00</div>
                        <Button
                            className="btn-custom--2 btn-inc py-1r btn-finish btn-pill text-display font-600"
                            onClick={handleFinishQuiz}
                        >
                            FINISH
                        </Button>
                    </div>
                    <QuestionSelector></QuestionSelector>
                </RoomListener>
            </TimeProvider>
        </Container>
    );
}
