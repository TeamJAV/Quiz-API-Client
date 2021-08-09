import { useEffect, useState, createContext } from "react";

export const RoomContext = createContext();

export const RoomProvider = (props) => {
    const [room, setRoom] = useState(() => {
        const localData = localStorage.getItem("room");
        return localData ? JSON.parse(localData) : null;
    });

    useEffect(() => {
        localStorage.setItem("room", JSON.stringify(room));
    }, [room]);

    return (
        <RoomContext.Provider value={{ room, setRoom }}>
            {props.children}
        </RoomContext.Provider>
    );
};
