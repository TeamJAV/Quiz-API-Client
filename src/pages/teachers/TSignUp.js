import React, { useState, useEffect } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import Modal from "../../components/commons/Modal";
import { getErrorMessage, isObjectEmpty } from "../../utils/utils";
import { useHistory } from "react-router-dom";

export default function TSignUp() {
    const [data, setData] = useState({});

    return (
        <Container className="register-container text-sm">
            <RegisterForm setData={setData}></RegisterForm>
            <RegisterModal data={data}></RegisterModal>
        </Container>
    );
}

const fetchRegisterAPI = (data) => {
    return axios.post("/api/teacher/auth/signup", data);
};

const RegisterForm = ({ setData }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm();
    const confirmPassword = watch("password", "");
    const onSubmit = (data) => {
        setData(data);
    };
    return (
        <>
            <div className="form-header text-center">
                <div className="logo">
                    <img src={logo} alt="quiz-logo" />
                </div>
                <p className="text-center">
                    Students do not need an account. Join a teacher‘s room{" "}
                    <Link to="/login/student">here</Link>
                </p>
                <p className="font-700 text-base" style={{ margin: "50px 0" }}>
                    NEW TEACHER ACCOUNT
                </p>
            </div>
            <div className="form-container bg-grey2--normal">
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="register-form flex flex-col "
                >
                    <div className="form-field">
                        <label htmlFor="name">Username</label>
                        <input
                            className={`input-2 ${errors.name && "error"}`}
                            type="text"
                            id="name"
                            {...register("name", {
                                required: "Username is required",
                            })}
                        />
                        {errors.name && <p>{errors.name.message}</p>}
                    </div>
                    <div className="form-field">
                        <label htmlFor="email">Email</label>
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
                        <label htmlFor="password">Password</label>
                        <input
                            className={`input-2 ${errors.password && "error"}`}
                            type="password"
                            id="password"
                            autoComplete="off"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 10,
                                    message:
                                        "Your password must have at least 10 characters",
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&].{10,}$/,
                                    message:
                                        "Your password must have at least one Uppercase, one Number and one Special Character",
                                },
                            })}
                        />
                        {errors.password && <p>{errors.password.message}</p>}
                    </div>
                    <div className="form-field">
                        <label htmlFor="c_password">Confirm Password</label>
                        <input
                            className={`input-2 ${
                                errors.c_password && "error"
                            }`}
                            type="password"
                            id="c_password"
                            autoComplete="off"
                            {...register("c_password", {
                                validate: (value) =>
                                    value === confirmPassword ||
                                    "Confirm password does not match",
                            })}
                        />
                        {errors.c_password && (
                            <p>{errors.c_password.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn-main--orange btn-signup py-1r"
                        onClick={handleSubmit(onSubmit)}
                    >
                        SIGN UP
                    </button>
                </form>
            </div>
        </>
    );
};

const RegisterModal = ({ data }) => {
    const [show, setShow] = useState(false);
    const [modalState, setModalState] = useState({ type: "loading" }); // loading, successful, error
    const history = useHistory();

    console.log(modalState);

    const renderModalContent = () => {
        const content = {
            loading: {
                message: <div>Please waiting</div>,
            },
            successful: {
                message: (
                    <div>
                        <p>Congratulations</p>
                        <p>Your account has been successfully created</p>
                        <p>
                            ...However, you need to confirm your email address.
                            Please check your inbox and click the link
                            we&apos;ve sent you
                        </p>
                        <button
                            type="button"
                            className="btn-main--orange btn-signup py-1r"
                            onClick={handleCloseModal}
                        >
                            Return to Login Page
                        </button>
                    </div>
                ),
            },
            error: {
                message: <div>{modalState?.message}</div>,
            },
        };
        return content[modalState.type].message;
    };

    const clearModalState = () => {
        setModalState({ type: "loading" });
    };

    const handleCloseModal = () => {
        setShow(false);
        if (modalState.type === "successful") {
            // setTimeout(function() {
            history.push("/login/teacher");
            // }, 2000)
        } else {
            clearModalState();
        }
    };

    useEffect(() => {
        if (!isObjectEmpty(data)) {
            setShow(true);
            fetchRegisterAPI(data)
                .then((res) => {
                    console.log(res);
                    setModalState({
                        type: "successful",
                        message: res.data.message,
                    });
                })
                .catch((err) => {
                    setModalState({
                        type: "error",
                        message: getErrorMessage(err),
                    });
                });
        }
    }, [data]);

    return (
        <Modal
            state={{ show }}
            onShow={() => {
                console.log("open");
            }}
            onHide={handleCloseModal}
        >
            {renderModalContent()}
        </Modal>
    );
};
