import React, { FC } from "react";
import Header from "../Header/Header";
import classes from "./EditProfile.module.scss";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../hook";
import { editUser } from "../Store/AccountSlice";
import { useNavigate } from "react-router-dom";

type FormFields = {
  email: string;
  password: string;
  username: string;
  url: string;
};

const EditProfile: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormFields>();
  const error = useAppSelector((state) => state.account.errorEdit);
  const dispatch = useAppDispatch();
  const key = localStorage.getItem("token")!;
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormFields> = async ({
    username,
    email,
    password,
    url,
  }) => {
    try {
      await dispatch(editUser({ username, email, password, url, key }));
      if (error === true) {
        throw new Error();
      }
      navigate("/articles");
    } catch (error) {
      setError("root", {
        message: "Что то пошло не так",
      });
    }
  };

  return (
    <React.Fragment>
      <Header />
      <form className={classes.editForm} onSubmit={handleSubmit(onSubmit)}>
        <h2>Edit Profile</h2>
        <div className={classes.innerInput}>
          <h3>Username</h3>
          <input
            placeholder="Username"
            type="text"
            defaultValue={localStorage.getItem("username")!}
            {...register("username", {
              required: "Username can`t be null",
            })}
          />
          {errors.username && (
            <div style={{ color: "red" }}>{errors.username.message}</div>
          )}
        </div>
        <div className={classes.innerInput}>
          <h3>Email address</h3>
          <input
            placeholder="Email address"
            type="text"
            defaultValue={localStorage.getItem("email")!}
            {...register("email", {
              required: "Email is required",
              validate: (value) => {
                if (!value.includes("@")) {
                  return "Email is incorrect";
                }
                return true;
              },
            })}
          />
          {errors.email && (
            <div style={{ color: "red" }}>{errors.email.message}</div>
          )}
        </div>
        <div className={classes.innerInput}>
          <h3>New password</h3>
          <input
            placeholder="New password"
            type="text"
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
          />
          {errors.password && (
            <div style={{ color: "red" }}>{errors.password.message}</div>
          )}
        </div>
        <div className={classes.innerInput}>
          <h3>Avatar image (url)</h3>
          <input
            placeholder="Avatar image"
            type="text"
            {...register("url", {
              required: false,
              pattern: {
                value: /\.png$/,
                message: "Image must be .png format",
              },
            })}
          />
          {errors.url && (
            <div style={{ color: "red" }}>{errors.url.message}</div>
          )}
        </div>
        <button type="submit">Save</button>
        {errors.root && (
          <div style={{ color: "red" }}>{errors.root.message}</div>
        )}
      </form>
    </React.Fragment>
  );
};

export default EditProfile;
