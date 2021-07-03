import React from "react";
import QuizTab from "../components/teachers/QuizTab";
import Nav from "react-bootstrap/Nav";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

export default function THomePage() {
    return (
        <Router>
            <div className="page-container page-container--sm">
                <Nav variant="tabs" defaultActiveKey="quizzes">
                    <Nav.Item>
                        <Nav.Link eventKey="launch" as={Link} to="/launch">
                            Launch
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="quizzes" as={Link} to="/quizzes">
                            Quizzes
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="rooms" as={Link} to="/rooms">
                            Rooms
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="reports" as={Link} to="/reports">
                            Reports
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="results" as={Link} to="/results">
                            Results
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
                <Switch>
                    <Route path="/launch">
                        <div>Launch</div>
                    </Route>
                    <Route path="/quizzes">
                        <QuizTab></QuizTab>
                    </Route>
                    <Route path="/rooms">
                        <div>Rooms</div>
                    </Route>
                    <Route path="/reports">
                        <div>Reports</div>
                    </Route>
                    <Route path="/results">
                        <div>Results</div>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}
