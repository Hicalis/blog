import classes from './App.module.scss';
import { FC, useEffect } from 'react';
import ArticleList from '../ArticleList/ArticleList';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Article from '../Article/Article';
import { useAppDispatch } from '../hook';
import { getArticles } from '../Store/ArticleSlice';

const router = createBrowserRouter([
  {
  path:'/',
  element:<ArticleList />
},
{
  path:'/articles',
  element:<ArticleList />
},
{
  path:`/articles/:id`,
  element:<Article/>
}
])

const App: FC = () => {

  const dispatch = useAppDispatch()

  useEffect(()=>{
    dispatch(getArticles(1))
  },[dispatch])

  return (
    
    <div className={classes.App}>
      <RouterProvider router={router}/>
    </div>
  
  );
}

export default App;
