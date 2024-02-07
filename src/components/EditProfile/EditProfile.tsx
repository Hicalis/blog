import React, { FC } from "react";
import Header from "../Header/Header";
import classes from './EditProfile.module.scss'
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../hook";
import { editUser } from "../Store/AccountSlice";

type FormFields = {
    email:string,
    password:string,
    username:string,
    url:string
}


const EditProfile:FC = () => {
    const {register,handleSubmit, formState:{errors} ,setError} = useForm<FormFields>()
    const error = useAppSelector((state)=>state.account.error)
    const dispatch = useAppDispatch()
    const key = localStorage.getItem('token')!

    console.log(key);
    

    const onSubmit: SubmitHandler<FormFields> =  async ({username, email, password, url}) => {
        try {
            await dispatch(editUser({username, email, password, url, key}))
            if(error===true){
                throw new Error()
            }
        } catch (error) {
            setError("root",{
                message:"Email or username is already taken"
            })
        }
    }

    return (
        <React.Fragment>
            <Header/>
            <form className={classes.editForm} onSubmit={handleSubmit(onSubmit)}>
                <h2>Edit Profile</h2>
                <div className={classes.innerInput}>
                    <h3>Username</h3>
                    <input placeholder='Username' type='text' 
                    defaultValue={localStorage.getItem('username')!}
                    {...register('username',{
                        required:"Username can`t be null"
                    })}/>
                    {errors.username && (<div style={{color:'red'}}>{errors.username.message}</div>)}
                </div>
                <div className={classes.innerInput}>
                    <h3>Email address</h3>
                    <input placeholder='Email address' type='text' 
                    defaultValue={localStorage.getItem('email')!}
                    {...register("email",{
                        required:'Email is required',
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
                    <h3>New password</h3>
                    <input placeholder='New password' type='text'
                    {...register("password",{
                        minLength:{
                            value:6,
                            message: "Password must be at 6 to 40 characters"
                        },
                        maxLength:{
                            value:40,
                            message: "Password must be at 6 to 40 characters"
                        },
                        })}
                    />
                    {errors.password && (<div style={{color:'red'}}>{errors.password.message}</div>)}
                </div>
                <div className={classes.innerInput}>
                    <h3>Avatar image (url)</h3>
                    <input placeholder='Avatar image' type='text'
                     {...register("url",{
                        required:false,
                        validate:(value)=>{
                            if(!value.includes('/')){
                                return 'Url is incorrect'
                            }
                            return true
                            }
                     })}
                    />
                    {errors.url && (<div style={{color:'red'}}>{errors.url.message}</div>)}

                </div>
                <button type="submit">Save</button>
            </form>
        </React.Fragment>

    )
}

export default EditProfile