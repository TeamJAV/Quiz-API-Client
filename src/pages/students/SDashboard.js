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

export default function SDashboard() {
    const { room, setRoom } = useContext(RoomContext);
    const { setUser } = useContext(UserContext);
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

    const handleFinishSession = () => {
        setUser(null);
        setRoom(null);
    };

    return (
        <Router>
            <div className="page-container page-container--sm">
                <h2>{room?.name}</h2>
                <Button type="button" onClick={handleFinishSession}>
                    Finish
                </Button>

                <Switch>
                    <Route path="/student/name">
                        <div>Enter your name</div>
                    </Route>
                    <Route path="/student/result">
                        <div>result</div>
                    </Route>
                    <Route path="/student/quiz">
                        <div>quiz</div>
                    </Route>
                    <Route path="/student/">
                        <div>quiz</div>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}
