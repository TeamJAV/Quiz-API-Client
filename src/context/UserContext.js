import { useEffect, useState, createContext } from "react";

export const UserContext = createContext();

export const UserProvider = (props) => {
    const [user, setUser] = useState(() => {
        const localData = localStorage.getItem("user");
        return localData ? JSON.parse(localData) : null;
    });

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(user));
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {props.children}
        </UserContext.Provider>
    );
};
