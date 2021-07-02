import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import QuizTab from "../components/teachers/QuizTab";
import Nav from "react-bootstrap/Nav";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

export default function THomePage() {
    return (
        <Router>
            <div className="page-container page-container--sm">
                {/* <Tabs
                defaultActiveKey="quizzes"
                transition={false}
                id="uncontrolled-tab"
                className="mb-3"
                unmountOnExit={true}
            >
                <Tab eventKey="launch" title="Launch">
                    <div>Launch</div>
                </Tab>
                <Tab eventKey="quizzes" title="Quizzes" to="/quiz">
                    <QuizTab></QuizTab>
                </Tab>
                <Tab eventKey="rooms" title="Rooms">
                    <div>Rooms</div>
                </Tab>
                <Tab eventKey="reports" title="Reports">
                    <div>Reports</div>
                </Tab>
                <Tab eventKey="results" title="Results">
                    <div>Results</div>
                </Tab>
            </Tabs> */}
                <Nav variant="tabs" defaultActiveKey="quizzes">
                    <Nav.Item>
                        <Nav.Link eventKey="launch">
                            <Link to="/launch">Launch</Link>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="quizzes">
                            <Link to="/quizzes">Quizzes</Link>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="rooms">
                            <Link to="/rooms">Rooms</Link>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="reports">
                            <Link to="/reports">Reports</Link>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="results">
                            <Link to="/results">Results</Link>
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
