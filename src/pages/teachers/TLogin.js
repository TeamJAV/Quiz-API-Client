import axios from "axios";
import React, { useContext, useEffect } from "react";
import Container from "react-bootstrap/Container";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import { UserContext } from "../../context/UserContext";
import { useWhoIsLoggedIn } from "../../utils/Users";
import { getErrorMessage } from "../../utils/utils";

const fetchLoginAPI = (data) => {
    return axios.post("/api/teacher/auth/login", data);
};

export default function TLogin() {
    const { setUser } = useContext(UserContext);
    const history = useHistory();
    const whoIsLoggedIn = useWhoIsLoggedIn();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        fetchLoginAPI(data)
            .then((res) => {
                //TODO: Need studying more about how to save & secure a token on local storage -> improve this

                const data = res.data.data;
                setUser({ teacher: { info: data.user, token: data.token } });
            })
            .catch((err) => {
                //TODO: Handle login errors

                console.log(getErrorMessage(err));
            });
    };

    useEffect(() => {
        if (whoIsLoggedIn === "teacher") {
            history.push("/");
        }
    }, [whoIsLoggedIn, history]);

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
                <h2 className="font-300">Teacher Login</h2>
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="register-form flex flex-col "
                >
                    <div className="form-field">
                        <label>Email</label>
                        <input
                            className={`input-2 ${errors.email && "error"}`}
                            type="text"
                            id="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                    message: "Your email is not valid",
                                },
                            })}
                        />
                        {errors.email && <p>{errors.email.message}</p>}
                    </div>
                    <div className="form-field">
                        <label>Password</label>
                        <input
                            className={`input-2 ${errors.password && "error"}`}
                            type="password"
                            id="password"
                            autoComplete="off"
                            {...register("password", {
                                required: "Password is required",
                            })}
                        />
                        {errors.password && <p>{errors.password.message}</p>}
                    </div>
                    <button
                        type="submit"
                        className="btn-main--orange btn-signup py-1r"
                        onClick={handleSubmit(onSubmit)}
                    >
                        SIGN IN
                    </button>
                </form>
                <div
                    className="flex justify-between"
                    style={{ marginTop: "15px" }}
                >
                    <span>Reset password</span>
                    <Link to="/login/teacher/register">Create account</Link>
                </div>
            </div>
        </Container>
    );
}
