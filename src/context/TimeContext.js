import { useEffect, useState, createContext } from "react";

export const TimeContext = createContext();

export const TimeProvider = (props) => {
    const [time, setTime] = useState(() => {
        const localData = localStorage.getItem("time");
        return localData ? JSON.parse(localData) : null;
    });

    useEffect(() => {
        localStorage.setItem("time", JSON.stringify(time));
    }, [time]);

    return (
        <TimeContext.Provider value={{ time: time, setTime: setTime }}>
            {props.children}
        </TimeContext.Provider>
    );
};