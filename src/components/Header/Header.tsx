import React, { FC } from "react"
import classes from './Header.module.scss'
import { Link } from "react-router-dom"

const Header:FC = () => {
    // const username = useAppSelector((state)=>state.account.user.user.username)   
    
    return(
        <header>
        <Link to='/articles'><h1>Realworld Blog</h1></Link>
            <div className={classes.right}>
                {localStorage.getItem('isLogged') === 'true'?
                <React.Fragment>
                    <button className={classes.createArticle}>Create article</button>
                    <Link to='/profile'>
                    <h2>{localStorage.getItem('username')}</h2>
                    <img src="https://static.productionready.io/images/smiley-cyrus.jpg" alt="img"/>
                        
                    </Link>
                    
                    <button className={classes.logOut}
                    onClick={()=>{localStorage.setItem('isLogged','false')}}>Log Out</button>
                </React.Fragment>
                :
                <React.Fragment>
                    <Link to = '/sign-in'><button className={`${classes['sign-in']}`}>Sign In</button></Link>
                    <Link to= '/sign-up'><button className={`${classes['sign-up']}`}>Sign Up</button></Link>
                </React.Fragment> 
                }
            </div>
        </header>
        
    )
}

export default Header