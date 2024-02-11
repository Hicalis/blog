import React, { FC } from "react";
import classes from "./Article.module.scss";
import Header from "../Header/Header";
import { useAppDispatch, useAppSelector } from "../hook";
import { Button, Popconfirm, Spin, message } from "antd";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { Link, useNavigate } from "react-router-dom";
import {
  addLike,
  deleteArticle,
  getArticleBySlug,
  removeLike,
} from "../Store/ArticleSlice";

const Article: FC = () => {
  const article = useAppSelector((state) => state.articles.article);
  const status = useAppSelector((state) => state.articles.status);
  const dateString = article?.createdAt;
  const date = new Date(dateString!);
  const key = localStorage.getItem("token")!;
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const dispatch = useAppDispatch();
  const slug = article?.slug!;
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const isLogged = useAppSelector((state) => state.account.isLogged);

  const error = () => {
    messageApi.open({
      type: "error",
      content: "Чтобы проставить лайк, нужно авторизоваться",
    });
  };
  const deleteArticles = async () => {
    await dispatch(deleteArticle({ slug, key })!);
    navigate("/articles");
  };
  const handleAddLike = async () => {
    if (localStorage.getItem("isLogged") === "false" || !isLogged) {
      error();
    } else {
      await dispatch(addLike({ slug, key }));
      await dispatch(
        getArticleBySlug({
          slug: article?.slug!,
          key: localStorage.getItem("token")!,
        })
      );
    }
  };

  const handleRemoveLike = async () => {
    await dispatch(removeLike({ slug, key }));
    await dispatch(
      getArticleBySlug({
        slug: article?.slug!,
        key: localStorage.getItem("token")!,
      })
    );
  };

  return (
    <React.Fragment>
      <Header />
      {contextHolder}
      {status === "loading" ? (
        <div className={classes.article}>
          <Spin style={{ margin: "auto auto" }} />
        </div>
      ) : (
        <div className={classes.article}>
          <div className={classes.top}>
            <div className={classes.left}>
              <div className={classes.leftTop}>
                <h2>{article?.title}</h2>
                {article?.favorited ? (
                  <button type="button" onClick={handleRemoveLike}>
                    {redHeart}
                    <h3>{article?.favoritesCount}</h3>
                  </button>
                ) : (
                  <button type="button" onClick={handleAddLike}>
                    {heart}
                    <h3>{article?.favoritesCount}</h3>
                  </button>
                )}
              </div>
              <div className={classes.articleTags}>
                {article?.tagList.map((el) => {
                  return (
                    <div className={classes.tag} key={el}>
                      {el}
                    </div>
                  );
                })}
              </div>
              <p>{article?.description}</p>
            </div>
            <div className={classes.right}>
              <div className={classes.top}>
                <div className={classes.rightInfo}>
                  <h2>{article?.author.username}</h2>
                  <h3>{formattedDate}</h3>
                </div>
                <img src={`${article?.author.image}`} alt="sdas" />
              </div>
              {article?.author.username === localStorage.getItem("username") ? (
                <div className={classes.bottom}>
                  <Popconfirm
                    placement={"right"}
                    title=""
                    description="Are you sure to delete this article?"
                    cancelText="No"
                    okText="Yes"
                    onConfirm={deleteArticles}
                  >
                    <Button danger>Delete</Button>
                  </Popconfirm>
                  <Link to={`/articles/${article!.slug}/edit`}>
                    <Button className={classes.edit}>Edit</Button>
                  </Link>
                </div>
              ) : null}
            </div>
          </div>

          <article className={classes.info}>
            <ReactMarkdown
              remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
            >
              {article?.body}
            </ReactMarkdown>
          </article>
        </div>
      )}
    </React.Fragment>
  );
};

const heart = (
  <svg
    width="15.999969"
    height="14.234863"
    viewBox="0 0 16 14.2349"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <desc>Created with Pixso.</desc>
    <defs />
    <path
      id="Vector"
      d="M8 14.2349C7.77222 14.2349 7.55261 14.1523 7.38147 14.0024C6.73511 13.4373 6.11194 12.9061 5.56213 12.4376L5.55933 12.4352C3.94739 11.0615 2.55542 9.87524 1.58691 8.70667C0.504272 7.40027 0 6.16162 0 4.80847C0 3.49377 0.450806 2.28088 1.26929 1.39307C2.09753 0.494751 3.23401 0 4.46973 0C5.39331 0 6.23914 0.291992 6.98364 0.867798C7.35938 1.15845 7.69995 1.51416 8 1.92908C8.30014 1.51416 8.64059 1.15845 9.01645 0.867798C9.76096 0.291992 10.6068 0 11.5304 0C12.766 0 13.9026 0.494751 14.7308 1.39307C15.5493 2.28088 16 3.49377 16 4.80847C16 6.16162 15.4958 7.40027 14.4132 8.70654C13.4447 9.87524 12.0528 11.0614 10.4411 12.4349C9.89035 12.9042 9.2662 13.4362 8.61838 14.0027C8.44736 14.1523 8.22766 14.2349 8 14.2349ZM4.46973 0.937256C3.4989 0.937256 2.60706 1.32471 1.95825 2.02832C1.2998 2.74255 0.937134 3.72986 0.937134 4.80847C0.937134 5.94653 1.36011 6.96436 2.30847 8.10864C3.2251 9.21472 4.5885 10.3766 6.16711 11.7219L6.17004 11.7244C6.72192 12.1947 7.34753 12.7279 7.99866 13.2972C8.65366 12.7268 9.28024 12.1927 9.83322 11.7217C11.4117 10.3763 12.775 9.21472 13.6916 8.10864C14.6399 6.96436 15.0628 5.94653 15.0628 4.80847C15.0628 3.72986 14.7002 2.74255 14.0417 2.02832C13.393 1.32471 12.5011 0.937256 11.5304 0.937256C10.8192 0.937256 10.1662 1.16333 9.58969 1.60913C9.0759 2.00659 8.71799 2.50903 8.50815 2.8606C8.40024 3.04138 8.21033 3.14929 8 3.14929C7.78967 3.14929 7.59973 3.04138 7.49182 2.8606C7.2821 2.50903 6.92419 2.00659 6.41028 1.60913C5.83374 1.16333 5.18079 0.937256 4.46973 0.937256Z"
      fill="#000000"
      fillOpacity="0.750000"
      fillRule="nonzero"
    />
  </svg>
);

const redHeart = (
  <svg
    width="14.276917"
    height="13.046143"
    viewBox="0 0 14.2769 13.0461"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <desc>Created with Pixso.</desc>
    <defs />
    <path
      id="path4"
      d="M7.13846 2.09229C6.39999 0.861572 5.16922 0 3.69232 0C1.60001 0 0 1.6001 0 3.69238C0 7.75391 2.21539 8.36914 7.13846 13.0461C12.0615 8.36914 14.2769 7.75391 14.2769 3.69238C14.2769 1.6001 12.6769 0 10.5846 0C9.1077 0 7.87692 0.861572 7.13846 2.09229Z"
      fill="#FF0707"
      fillOpacity="1.000000"
      fillRule="nonzero"
    />
  </svg>
);

export default Article;
