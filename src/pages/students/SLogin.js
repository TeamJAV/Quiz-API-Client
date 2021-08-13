import React, { useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { useForm } from "react-hook-form";
import logo from "../../assets/images/logo.svg";
import { getErrorMessage } from "../../utils/utils";
import axios from "axios";
import { RoomContext } from "../../context/RoomContext";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { useWhoIsLoggedIn } from "../../utils/Users";

export default function TSignUp() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setFocus,
    } = useForm();

    const {
        register: registerName,
        handleSubmit: handleSubmitName,
        formState: { errors: errorsName },
        setFocus: setFocusName,
    } = useForm();

    const { room, setRoom } = useContext(RoomContext);
    const { user, setUser } = useContext(UserContext);
    const [stage, setStage] = useState(0);
    const history = useHistory();
    const whoIsLoggedIn = useWhoIsLoggedIn();

    useEffect(() => {
        if (whoIsLoggedIn === "student") {
            history.push("/");
        }
    }, [whoIsLoggedIn, history]);

    useEffect(() => {
        setFocus("name");
    }, [setFocus]);

    useEffect(() => {
        if (stage === 1) {
            setFocusName("name");
        }
    }, [setFocusName, stage]);

    const onSubmit = (data) => {
        axios
            .post("/api/student/join-room", data)
            .then((res) => {
                console.log(res)
                setRoom({ r_id: res.data.data.r_id, name: data.name });
                setStage((s) => (s += 1));
            })
            .catch((err) => alert(getErrorMessage(err)));
    };

    const onSubmitStudentName = (data) => {
        axios
            .post("/api/student/register", data, {
                headers: {
                    r_id: room.r_id,
                },
            })
            .then((res) => {
                const data = res.data.data;
                console.log(data)
                setRoom((r) => ({ ...r, ...data.room }));
                setUser({ student: { ...data.result_detail } });
            })
            .catch((err) => alert(getErrorMessage(err)));
    };

    const renderFormContentByStage = () => {
        const content = [
            <form
                key={stage}
                onSubmit={(e) => e.preventDefault()}
                className="register-form flex flex-col"
            >
                <div className="form-field">
                    <label htmlFor="name">Room Name</label>
                    <input
                        className={`input-2 ${errors.name && "error"}`}
                        type="text"
                        id="name"
                        {...register("name", {
                            required: "Room Name is required",
                        })}
                    />
                    {errors.name && <p>{errors.name.message}</p>}
                </div>
                <button
                    type="submit"
                    className="btn-main--orange btn-signup py-1r"
                    onClick={handleSubmit(onSubmit)}
                >
                    JOIN
                </button>
            </form>,
            <>
                <form
                    key={stage}
                    onSubmit={(e) => e.preventDefault()}
                    className="register-form flex flex-col"
                >
                    <div className="form-field">
                        <label htmlFor="name">Please enter your name</label>
                        <input
                            className={`input-2 ${errorsName.name && "error"}`}
                            type="text"
                            id="name"
                            {...registerName("name", {
                                required: "Your Name is required",
                            })}
                        />
                        {errorsName.name && <p>{errorsName.name.message}</p>}
                    </div>
                    <button
                        type="submit"
                        className="btn-main--orange btn-signup py-1r"
                        onClick={handleSubmitName(onSubmitStudentName)}
                    >
                        DONE
                    </button>
                </form>
            </>,
        ];
        return content[stage];
    };

    return (
        <Container className="login-container text-sm">
            <div
                className="form-header text-center"
                style={{ marginBottom: "40px" }}
            >
                <div className="logo">
                    <img src={logo} alt="quiz-logo" />
                </div>
            </div>
            <div className="form-container bg-grey2--normal">
                <h2 className="font-300">Student Login</h2>
                {/* <form
                    onSubmit={(e) => e.preventDefault()}
                    className="register-form flex flex-col"
                > */}
                {renderFormContentByStage()}
                {/* </form> */}
            </div>
        </Container>
    );
}
