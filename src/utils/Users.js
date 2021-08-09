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
    let token = "";
    const whoIsLoggedIn = useWhoIsLoggedIn()
    if (role === "teacher" && whoIsLoggedIn === "teacher") {
        token = user.teacher.token.access_token;
    }
    // const headers = useMemo(
    //     () => ({
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //         },
    //     }),
    //     [token]
    // );
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export { useWhoIsLoggedIn, useHeaderConfig };
