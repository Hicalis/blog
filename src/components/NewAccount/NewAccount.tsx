import React, { FC } from "react";
import Header from "../Header/Header";
import classes from "./NewAccount.module.scss";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../hook";
import { registerUser } from "../Store/AccountSlice";
import { Link, useNavigate } from "react-router-dom";

type FormFields = {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
  check: boolean;
};

const NewAccount: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm<FormFields>();
  const dispatch = useAppDispatch();
  const error = useAppSelector((state) => state.account.errorRegister);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormFields> = async ({
    username,
    email,
    password,
  }) => {
    try {
      await dispatch(registerUser({ username, email, password }));
      if (error === true) {
        throw new Error();
      }
      navigate("/articles");
    } catch (error) {
      setError("root", {
        message: "Email or username is already taken",
      });
    }
  };

  const password = watch("password", "");
  const passwordMatchChecked = (value) => {
    if (value !== password) {
      return "Password must match";
    }
    return value === password;
  };

  return (
    <React.Fragment>
      <Header />
      <form className={classes.formCreate} onSubmit={handleSubmit(onSubmit)}>
        <div className={classes.innerInput}>
          <h2>Create new account</h2>
          <div className={classes.innerInput_input}>
            <h3>Username</h3>
            <input
              placeholder="Username"
              {...register("username", {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at 3 to 20 characters",
                },
                maxLength: {
                  value: 20,
                  message: "Username must be at 3 to 20 characters",
                },
              })}
              type="text"
            />
            {errors.username && (
              <div style={{ color: "red" }}>{errors.username.message}</div>
            )}
          </div>

          <div className={classes.innerInput_input}>
            <h3>Email address</h3>
            <input
              placeholder="Email address"
              {...register("email", {
                required: "Email is required",
                validate: (value) => {
                  if (!value.includes("@")) {
                    return "Email is incorrect";
                  }
                  return true;
                },
              })}
              type="text"
            />
            {errors.email && (
              <div style={{ color: "red" }}>{errors.email.message}</div>
            )}
          </div>

          <div className={classes.innerInput_input}>
            <h3>Password</h3>
            <input
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at 6 to 40 characters",
                },
                maxLength: {
                  value: 40,
                  message: "Password must be at 6 to 40 characters",
                },
              })}
              type="password"
            ></input>
            {errors.password && (
              <div style={{ color: "red" }}>{errors.password.message}</div>
            )}
          </div>

          <div className={classes.innerInput_input}>
            <h3>Repeat Password</h3>
            <input
              placeholder="Password"
              {...register("repeatPassword", {
                required: "Repeat password",
                validate: passwordMatchChecked,
              })}
              type="password"
            ></input>
            {errors.repeatPassword && (
              <div style={{ color: "red" }}>
                {errors.repeatPassword.message}
              </div>
            )}
          </div>

          <div className={classes.line}></div>
          <div className={classes.info}>
            <input
              type="checkbox"
              {...register("check", {
                required: true,
              })}
            />
            I agree to the processing of my personal information
          </div>
          <button type="submit">Create</button>
          {errors.root && (
            <div style={{ color: "red" }}>{errors.root.message}</div>
          )}
          <span>
            Already have an account? <Link to="/sign-in">Sign In.</Link>
          </span>
        </div>
      </form>
    </React.Fragment>
  );
};

export default NewAccount;
