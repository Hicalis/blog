import classes from './App.module.scss';
import { FC, useEffect } from 'react';
import ArticleList from '../ArticleList/ArticleList';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Article from '../Article/Article';
import { useAppDispatch } from '../hook';
import { getArticles } from '../Store/ArticleSlice';
import NewAccount from '../NewAccount/NewAccount';
import Login from '../Login/Login';
import EditProfile from '../EditProfile/EditProfile';

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
},
{
  path:'/sign-up',
  element:<NewAccount/>
},
{
  path:'/sign-in',
  element:<Login/>
},
{
  path:'/profile',
  element:<EditProfile/>
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
