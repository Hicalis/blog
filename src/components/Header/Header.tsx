import { FC } from "react"
import classes from './Header.module.scss'
import { Link } from "react-router-dom"

const Header:FC = () => {
    return(
        <header>
        <Link to='/articles'><h1>Realworld Blog</h1></Link>
            <div className={classes.right}>
                <button className={`${classes['sign-in']}`}>Sign In</button>
                <button className={`${classes['sign-up']}`}>Sign Up</button>
            </div>
        </header>
        
    )
}

export default Header