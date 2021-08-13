import React, { useContext } from "react";
import { RoomContext } from "../../context/RoomContext";
import { UserContext } from "../../context/UserContext";

export default function Header({ forUser = "teacher", children }) {
    const { user } = useContext(UserContext);
    const { room } = useContext(RoomContext);
    return (
        <div className={`header header-${forUser} text-white`}>
            <div className="logo text-center text-smd font-display">
                <p>Quiz Online</p>
            </div>
            <div className="flex justify-between page-container text-base align-center mb-20">
                <div className="info">
                    <p>
                        Hello,&nbsp;
                        {user?.teacher?.info?.name ||
                            user?.student?.name ||
                            "User"}
                    </p>
                    {room && room?.name && <p>Room: {room.name}</p>}
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
}
