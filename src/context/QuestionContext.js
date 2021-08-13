import { useEffect, useState, createContext } from "react";

export const QuestionsContext = createContext();

export const QuestionsProvider = (props) => {
    const [questions, setQuestions] = useState(() => {
        const localData = localStorage.getItem("questions");
        return localData ? JSON.parse(localData) : null;
    });

    useEffect(() => {
        localStorage.setItem("questions", JSON.stringify(questions));
    }, [questions]);

    return (
        <QuestionsContext.Provider value={{ questions, setQuestions }}>
            {props.children}
        </QuestionsContext.Provider>
    );
};