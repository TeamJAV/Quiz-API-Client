import React, { useContext, useEffect } from "react";
import { RoomContext } from "../../context/RoomContext";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useHistory,
} from "react-router-dom";
import Button from "react-bootstrap/Button";
import { useWhoIsLoggedIn } from "../../utils/Users";
import { UserContext } from "../../context/UserContext";
import QuizTab from "../../components/students/QuizTab";
import {
    QuestionsProvider,
    QuestionsContext,
} from "../../context/QuestionContext";
import Header from "../../components/commons/Header";
import ResultTab from "../../components/students/ResultTab";

export default function SDashboard() {
    const { room } = useContext(RoomContext);

    const whoIsLoggedIn = useWhoIsLoggedIn();
    const history = useHistory();

    useEffect(() => {
        if (whoIsLoggedIn !== "student") {
            history.push("/login/student");
        }
    }, [history, whoIsLoggedIn]);

    // useEffect(() => {
    //     return () => {
    //         handleFinishSession();
    //     };
    // }, []);

    return (
        <QuestionsProvider>
            <Header forUser="student">
                <BtnLogOut></BtnLogOut>
            </Header>
            <Router>
                <div className="page-container page-container--sm">
                    <Switch>
                        <Route path="/student/result/:rd_id/:name/:room">
                            <ResultTab></ResultTab>
                        </Route>
                        <Route path="/student/quiz">
                            <QuizTab></QuizTab>
                        </Route>
                        <Route path="/student/">
                            <QuizTab></QuizTab>
                        </Route>
                    </Switch>
                </div>
            </Router>
        </QuestionsProvider>
    );
}

const BtnLogOut = () => {
    const { setRoom } = useContext(RoomContext);
    const { setUser } = useContext(UserContext);
    const { setQuestions } = useContext(QuestionsContext);
    const handleFinishSession = () => {
        setUser(null);
        setRoom(null);
        setQuestions(null);
    };
    return (
        <Button
            onClick={handleFinishSession}
            as="a"
            className="text-white"
            bsPrefix="a"
            style={{ textDecoration: "underline" }}
        >
            Log out
        </Button>
    );
};
