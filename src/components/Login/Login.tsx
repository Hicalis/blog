import React, { FC } from 'react'
import classes from './Login.module.scss'
import Header from '../Header/Header'
import { Link } from 'react-router-dom'
import { SubmitHandler,useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '../hook'
import { loginUser } from '../Store/AccountSlice'

type FormFields = {
    email:string,
    password:string
}

const Login:FC = () =>{
    const {register,handleSubmit,formState:{errors},setError} = useForm<FormFields>()
    const dispatch = useAppDispatch()
    const isLogged = useAppSelector((state)=>state.account.isLogged)
    const error = useAppSelector((state)=>state.account.error)


    const onSubmit: SubmitHandler<FormFields> =  async ({email, password}) => {
        try {
            await dispatch(loginUser({email, password}))
            if(error===true){
                throw new Error()
            }
        } catch (error) {
            setError("root",{
                message:"Email or password is invalid"
            })
        }
    }

    return(
        <React.Fragment>
            <Header/>
            <form className={classes.login} onSubmit={handleSubmit(onSubmit)}>
                <h2>Sign In</h2>
                <div className={classes.innerInput}>
                    <h3>Email address</h3>
                    <input placeholder='Email address' type='text'
                    {...register('email',{
                        required:'Email can`t be null',
                        validate:(value)=>{
                            if(!value.includes('@')){
                                return 'Email is incorrect'
                            }
                            return true
                        }
                    })}/>
                    {errors.email && (<div style={{color:'red'}}>{errors.email.message}</div>)}
                </div>
                <div className={classes.innerInput}>
                    <h3>Password</h3>
                    <input placeholder='Password' type='password'
                    {...register('password',{
                        required:"Password can`t be null"
                    })}/>
                    {errors.password && (<div style={{color:'red'}}>{errors.password.message}</div>)}
                </div>
                <button type='submit'>Login</button>
                {isLogged?(<div style={{color:'green', textAlign:'center'}}>Success login</div>):null}
                {errors.root && (<div style={{color:'red', textAlign:'center'}}>{errors.root.message}</div>)}
                <span>Don`t have an account? <Link to='/sign-up'>Sign Up.</Link></span>
            </form>
        </React.Fragment>
    )
}

export default Login