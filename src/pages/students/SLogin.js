import React from "react";
import Container from "react-bootstrap/Container";
import { useForm } from "react-hook-form";
import logo from "../../assets/images/logo.svg";

export default function TSignUp() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <Container className="login-container text-sm">
            <div className="form-header text-center" style={{marginBottom: "40px"}}>
                <div className="logo">
                    <img src={logo} alt="quiz-logo" />
                </div>
            </div>
            <div className="form-container bg-grey2--normal">
                <h2 className="font-300">Student Login</h2>
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="register-form flex flex-col "
                >
                    <div className="form-field">
                        <label htmlFor="room">Room Name</label>
                        <input
                            className={`input-2 ${errors.room && "error"}`}
                            type="text"
                            id="room"
                            {...register("room", {
                                required: "Room Name is required",
                            })}
                        />
                        {errors.room && <p>{errors.room.message}</p>}
                    </div>
                    <button
                        type="submit"
                        className="btn-main--orange btn-signup py-1r"
                        onClick={handleSubmit(onSubmit)}
                    >
                        JOIN
                    </button>
                </form>
            </div>
        </Container>
    );
}

