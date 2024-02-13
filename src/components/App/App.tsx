import classes from "./App.module.scss";
import { FC } from "react";
import ArticleList from "../ArticleList/ArticleList";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Article from "../Article/Article";
import NewAccount from "../NewAccount/NewAccount";
import Login from "../Login/Login";
import EditProfile from "../EditProfile/EditProfile";
import CreateArticle from "../CreateArticle/CreateArticle";
import EditArticle from "../EditArticle/EditArticle";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ArticleList />,
  },
  {
    path: "/articles",
    element: <ArticleList />,
  },
  {
    path: `/articles/:id`,
    element: <Article />,
  },
  {
    path: "/sign-up",
    element: <NewAccount />,
  },
  {
    path: "/sign-in",
    element: <Login />,
  },
  {
    path: "/profile",
    element: <EditProfile />,
  },
  { path: "/new-article", element: <CreateArticle /> },
  { path: "/articles/:id/edit", element: <EditArticle /> },
]);

const App: FC = () => {
  return (
    <div className={classes.App}>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
