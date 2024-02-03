import React, { FC } from 'react'
import classes from './ArticleList.module.scss'
import { Pagination, Spin } from 'antd';
import Header from "../Header/Header";
import ArticleItem from '../ArticleItem/ArticleItem';
import { useAppDispatch, useAppSelector } from '../hook';
import { getArticles, Article } from '../Store/ArticleSlice';

const ArticleList:FC = () => {

    let articles = useAppSelector((state) => state.articles.articles)
    const status = useAppSelector((state)=> state.articles.status)
    
    const dispatch = useAppDispatch()

    const handlerArticles = (e:number) => {

        dispatch(getArticles(e))
    }

    console.log(articles);
    
    
    
    
    return(
        <React.Fragment>
            <Header/>
            {status==='loading'? <div className={classes.articleList}><Spin/></div>
            :<div className={classes.articleList}>
            {articles.map((el:Article)=>{
                return <ArticleItem 
                key={el.slug}
                author={el.author} body={el.body}
                title={el.title} tagList={el.tagList} 
                favoritesCount={el.favoritesCount}
                favorited={el.favorited}
                description={el.description}
                slug={el.slug}
                createdAt={el.createdAt}
                updatedAt={el.updatedAt}/>
            })}
            <Pagination style={{margin:'20px'}} 
            defaultCurrent={1} total={500} 
            onChange={handlerArticles}/>
        </div>}
            
        </React.Fragment>
        
        
    )
}

export default ArticleList