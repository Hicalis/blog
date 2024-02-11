import React, { FC, useEffect } from "react";
import classes from "./ArticleList.module.scss";
import { Pagination, Spin } from "antd";
import Header from "../Header/Header";
import ArticleItem from "../ArticleItem/ArticleItem";
import { useAppDispatch, useAppSelector } from "../hook";
import { getArticles, Article, changePage } from "../Store/ArticleSlice";

const ArticleList: FC = () => {
  let articles = useAppSelector((state) => state.articles.articles);
  const status = useAppSelector((state) => state.articles.status);
  const currentPage = useAppSelector((state) => state.articles.currentPage);
  const articleCount =
    useAppSelector((state) => state.articles.articlesCount) / 5;
  console.log(articleCount);

  const dispatch = useAppDispatch();

  const handlerArticles = (e: number) => {
    dispatch(changePage(e));
    dispatch(getArticles(e));
  };

  useEffect(() => {
    dispatch(getArticles(1));
  }, [dispatch]);

  console.log(articles);

  return (
    <React.Fragment>
      <Header />
      {status === "loading" ? (
        <div className={classes.articleList}>
          <Spin />
        </div>
      ) : (
        <div className={classes.articleList}>
          {articles.map((el: Article) => {
            return (
              <ArticleItem
                key={el.slug}
                author={el.author}
                body={el.body}
                title={el.title}
                tagList={el.tagList}
                favoritesCount={el.favoritesCount}
                favorited={el.favorited}
                description={el.description}
                slug={el.slug}
                createdAt={el.createdAt}
                updatedAt={el.updatedAt}
              />
            );
          })}
          <Pagination
            style={{ margin: "20px" }}
            defaultCurrent={currentPage}
            total={articleCount * 10}
            onChange={handlerArticles}
          />
        </div>
      )}
    </React.Fragment>
  );
};

export default ArticleList;
