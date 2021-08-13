import { useContext } from "react";
import { RoomContext } from "../context/RoomContext";
import { UserContext } from "../context/UserContext";

const useWhoIsLoggedIn = () => {
    const { user } = useContext(UserContext);
    const { room } = useContext(RoomContext);
    if (user && user?.teacher?.token?.access_token) {
        return "teacher";
    }
    if (room && room?.r_id && room?.name && user && user?.student) {
        return "student";
    }
    return null;
};

const useHeaderConfig = (role = "teacher") => {
    const { user } = useContext(UserContext);
    const { room } = useContext(RoomContext);
    let headers = {};
    const whoIsLoggedIn = useWhoIsLoggedIn();
    if (role === "teacher" && whoIsLoggedIn === "teacher") {
        const token = user.teacher.token.access_token;
        headers = { Authorization: `Bearer ${token}` };
    }
    if (role === "student" && whoIsLoggedIn === "student") {
        headers = {
            r_id: room.r_id,
            rd_id: user.student.rd_id,
        };
    }
    return {
        headers: headers,
    };
};

export { useWhoIsLoggedIn, useHeaderConfig };
