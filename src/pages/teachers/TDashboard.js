import React, { useEffect, useContext } from "react";
import QuizTab from "../../components/teachers/QuizTab";
import Nav from "react-bootstrap/Nav";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useHistory,
    useLocation,
    NavLink,
} from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { useWhoIsLoggedIn } from "../../utils/Users";
import RoomTab from "../../components/teachers/RoomTab";
import LaunchTab from "../../components/teachers/LaunchTab";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useHeaderConfig } from "../../utils/Users";
import { getErrorMessage } from "../../utils/utils";
import ResultTab from "../../components/teachers/ResultTab";
import Header from "../../components/commons/Header";
import LiveResult from "../../components/teachers/LiveResult";

const getCurrentActiveKey = (location) => {
    const strSplit = location.split("/");
    if (strSplit.length < 3) return "quizzes";
    return strSplit[2];
};

function TDashboard() {
    const { setUser } = useContext(UserContext);

    const history = useHistory();
    const whoIsLoggedIn = useWhoIsLoggedIn();
    const headerConfig = useHeaderConfig();

    useEffect(() => {
        if (whoIsLoggedIn !== "teacher") {
            history.push("/login/teacher");
        }
    }, [history, whoIsLoggedIn]);

    const handleLogOut = (e) => {
        axios
            .post("/api/teacher/auth/logout", {}, headerConfig)
            .then(() => {
                setUser(null);
            })
            .catch((err) => alert(getErrorMessage(err)));
    };

    return (
        <Router>
            <Header>
                <Button
                    onClick={handleLogOut}
                    as="a"
                    className="text-white"
                    bsPrefix="a"
                    style={{ textDecoration: "underline" }}
                >
                    Log out
                </Button>
            </Header>
            <div className="page-container page-container--sm text-base">
                <Nav variant="tabs" as="ul" className="nav-custom text-white">
                    <Nav.Item as="li">
                        <NavLink className="nav-link" to="/teacher/launch">
                            Launch
                        </NavLink>
                    </Nav.Item>
                    <Nav.Item as="li">
                        <NavLink
                            className="nav-link"
                            to="/teacher/quizzes"
                            isActive={(match, location) => {
                                const regex = new RegExp("^/teacher/?$");
                                return match || regex.test(location.pathname);
                            }}
                        >
                            Quizzes
                        </NavLink>
                    </Nav.Item>
                    <Nav.Item as="li">
                        <NavLink className="nav-link" to="/teacher/rooms">
                            Rooms
                        </NavLink>
                    </Nav.Item>
                    <Nav.Item as="li">
                        <NavLink className="nav-link" to="/teacher/reports">
                            Reports
                        </NavLink>
                    </Nav.Item>
                    <Nav.Item as="li">
                        <NavLink className="nav-link" to="/teacher/results">
                            Results
                        </NavLink>
                    </Nav.Item>
                </Nav>
                <Switch>
                    <Route path="/teacher/launch">
                        <LaunchTab></LaunchTab>
                    </Route>
                    <Route path="/teacher/quizzes">
                        <QuizTab></QuizTab>
                    </Route>
                    <Route path="/teacher/rooms">
                        <RoomTab></RoomTab>
                    </Route>
                    <Route path="/teacher/reports">
                        <div>Reports</div>
                    </Route>
                    <Route path="/teacher/results/:id">
                        <LiveResult></LiveResult>
                    </Route>
                    <Route path="/teacher/results">
                        <ResultTab></ResultTab>
                    </Route>
                    <Route path="/teacher/">
                        <QuizTab></QuizTab>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default TDashboard;
