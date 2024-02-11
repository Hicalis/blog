import React, { FC, useEffect, useState } from "react";
import classes from "./Header.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hook";
import { logOut } from "../Store/AccountSlice";

const Header: FC = () => {
  const dispatch = useAppDispatch();
  const [isLogged, setIsLogged] = useState(localStorage.getItem("isLogged"));
  useEffect(() => {
    console.log("Значение isLogged изменилось:", isLogged);
  }, [isLogged]);
  const navigate = useNavigate();

  return (
    <header>
      <Link to="/articles">
        <h1>Realworld Blog</h1>
      </Link>
      <div className={classes.right}>
        {localStorage.getItem("isLogged") === "true" ? (
          <React.Fragment>
            <Link to="/new-article">
              <button type="button" className={classes.createArticle}>
                Create article
              </button>
            </Link>
            <Link to="/profile" className={classes.profile}>
              <h2>{localStorage.getItem("username")}</h2>
              <img src={localStorage.getItem("avatar")!} alt="img" />
            </Link>

            <button
              type="button"
              className={classes.logOut}
              onClick={() => {
                localStorage.clear();
                setIsLogged(localStorage.setItem("isLogged", "false")!);
                dispatch(logOut());
                navigate("/articles");
              }}
            >
              Log Out
            </button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Link to="/sign-in">
              <button type="button" className={`${classes["sign-in"]}`}>
                Sign In
              </button>
            </Link>
            <Link to="/sign-up">
              <button type="button" className={`${classes["sign-up"]}`}>
                Sign Up
              </button>
            </Link>
          </React.Fragment>
        )}
      </div>
    </header>
  );
};

export default Header;
