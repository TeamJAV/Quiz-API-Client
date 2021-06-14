import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { nanoid } from "nanoid";
import { nextAnswerIdAlphabet, prevAnswerIdAlphabet } from "../utils/Questions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default function QuestionEditor(props) {
    const {
        title: pTitle = "",
        questionType: pQuestionType = "",
        explain: pExplain = "",
        choices: pChoices = pQuestionType === "true-false"
            ? { A: true, B: false }
            : { A: "", B: "", C: "", D: "" },
        correct: pCorrect = [],
        questionId: pQuestionId = nanoid(),
    } = props.question || {};

    const [title, setTitle] = useState(pTitle);
    const [explain, setExplain] = useState(pExplain);
    const [choices, setChoices] = useState(Object.entries(pChoices));
    const [correct, setCorrect] = useState(pCorrect);
    const [questionType, setQuestionType] = useState(pQuestionType);
    const [questionId, setQuestionId] = useState(pQuestionId);
    const [isLabelVisible, setIsLabelVisible] = useState(
        questionType === "multiple" ? true : false
    );
    const [isChangeAnsQuantAllowed, setIsChangeAnsQuantAllowed] = useState(
        questionType !== "true-false" ? true : false
    );

    const handleOnClickAddAnswer = (e) => {
        console.log(correct);
        if (choices.length >= 26) {
            return;
        }
        if (choices.length <= 0) {
            setChoices([["A", ""]]);
            return;
        }
        const lastAnswerKey = choices[choices.length - 1][0];
        setChoices((prevState) => [
            ...prevState,
            [nextAnswerIdAlphabet(lastAnswerKey), ""],
        ]);
    };

    const handleOnClickRemoveAnswer = (index) => {
        console.log(choices);
        console.log(index);
        const newChoices = choices.slice();
        let lastChoice = newChoices[index][0];
        updateCorrectAnswer(lastChoice);
        for (let i = index; i < newChoices.length; i++) {
            [newChoices[i][0], lastChoice] = [lastChoice, newChoices[i][0]];
        }
        newChoices.splice(index, 1);
        console.log(newChoices);
        setChoices(newChoices);
    };

    const handleOnChangeCorrectAnswer = (key) => {
        const newCorrect = correct.slice();
        const index = newCorrect.indexOf(key);
        console.log(index);
        console.log(key);
        if (index > -1) {
            newCorrect.splice(index, 1);
        } else {
            newCorrect.push(key);
        }
        newCorrect.sort();
        setCorrect(newCorrect);
    };

    const updateCorrectAnswer = (key) => {
        const newCorrect = correct.slice();
        const index = newCorrect.indexOf(key);
        if (index > -1) {
            newCorrect.splice(index, 1);
        }
        for (let i = 0; i < newCorrect.length; i++) {
            if (newCorrect[i] > key) {
                newCorrect[i] = prevAnswerIdAlphabet(newCorrect[i]);
            }
        }

        console.log(newCorrect)
        setCorrect(newCorrect);
    };

    return (
        <Container key={questionId} fluid>
            <Row>
                <Col>
                    <Row>
                        <Col sm={9}>
                            <input
                                name="title"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                }}
                            ></input>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {choices.map(([key, value], i) => (
                                <Row key={key}>
                                    <Col xs={11}>
                                        {isLabelVisible ? (
                                            <span>{key}</span>
                                        ) : null}
                                        <input
                                            type="checkbox"
                                            checked={correct.includes(key)}
                                            onChange={() =>
                                                handleOnChangeCorrectAnswer(key)
                                            }
                                        ></input>
                                        <input
                                            name="choices"
                                            value={value}
                                            data-key={key}
                                            onChange={(e) => {
                                                const newChoices =
                                                    choices.slice();
                                                newChoices[i][1] =
                                                    e.target.value;
                                                setChoices(newChoices);
                                            }}
                                        ></input>
                                    </Col>
                                    <Col xs={1}>
                                        {isChangeAnsQuantAllowed ? (
                                            <FontAwesomeIcon
                                                icon={faTimes}
                                                onClick={() =>
                                                    handleOnClickRemoveAnswer(i)
                                                }
                                            ></FontAwesomeIcon>
                                        ) : null}
                                    </Col>
                                </Row>
                            ))}
                            {isChangeAnsQuantAllowed ? (
                                <Row>
                                    <Col>
                                        <Button
                                            onClick={handleOnClickAddAnswer}
                                        >
                                            Add Answer
                                        </Button>
                                    </Col>
                                </Row>
                            ) : null}
                            <Row key="explain">
                                <Col>
                                    <input
                                        name="explain"
                                        value={explain}
                                        onChange={(e) => {
                                            setExplain(e.target.value);
                                        }}
                                    ></input>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col md={3}>
                    <div>For picture</div>
                </Col>
                <Col md={1}>
                    <div>For button</div>
                </Col>
            </Row>
        </Container>
    );
}
