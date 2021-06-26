import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import QuizTab from "../components/QuizTab";
import './THomePage.scss';

export default function THomePage() {
    return (
        <div className="page-container page-container--sm">
            <div className="">
                <Tabs
                    defaultActiveKey="quizzes"
                    transition={false}
                    id="uncontrolled-tab"
                    className="mb-3"
                    unmountOnExit={true}
                >
                    <Tab eventKey="launch" title="Launch">
                        <div>Launch</div>
                    </Tab>
                    <Tab eventKey="quizzes" title="Quizzes">
                        <QuizTab></QuizTab>
                    </Tab>
                    <Tab eventKey="rooms" title="Rooms" >
                        <div>Rooms</div>
                    </Tab>
                    <Tab eventKey="reports" title="Reports" >
                        <div>Reports</div>    
                    </Tab>
                    <Tab eventKey="results" title="Results">
                        <div>Results</div>
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
}
