import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const registerUser = createAsyncThunk('registerUser',
async ({ username, email, password }: { username: string, email: string, password: string },
    {rejectWithValue})=>{
    
        const res = await fetch(`https://blog.kata.academy/api/users`,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body:`{"user":{"username":"${username}","email":"${email}",
            "password":"${password}"}}`,
        })
        if (!res.ok) {
            // Ошибка, если ответ не "200 OK"
            return rejectWithValue(1);
        }
        const user = await res.json()
        return user
            
    
})

export const loginUser = createAsyncThunk('loginUser',
async({email,password}:{email:string, password:string},{rejectWithValue})=>{
    const res = await fetch(`https://blog.kata.academy/api/users/login`,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: `{"user":{"email":"${email}","password":"${password}"}}`,
        })
        if(!res.ok){
            return rejectWithValue(1);
        }
        const user = await res.json()
        return user
    }
)

export const editUser = createAsyncThunk('editUser',
async ({username, email, password, url, key}:
    {username:string,email:string, password:string, url:string, key:string}
    ,{rejectWithValue})=>{
    const res = await fetch(`https://blog.kata.academy/api/user`,{
        method:'PUT',
        headers:{
            'Content-Type': 'application/json',
            'Authorization':`${key}`
        },
        body: `{"user":{"email":"${email}","username":"${username}","image":"${url}","password":"${password}"}}`
    })
    if(!res.ok){
        return rejectWithValue(1);
    }
    const user = await res.json()
    return user
}
)


export type Account = {

}

const initialState = {
    user:{
        user:{
            email:'',
            token:'',
            username:''
        }
    },
    error:false,
    result:'',
    isLogged:false
}

export const accountSlice = createSlice({
    name:'account',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.fulfilled,(state)=>{
                state.result = '200'
                state.error = false
            })
            .addCase(registerUser.rejected,(state, action:PayloadAction<any>)=>{
                state.error = true
            })
            .addCase(loginUser.rejected,(state, action)=>{
                state.error = true
            })
            .addCase(loginUser.fulfilled,(state,action)=>{
                state.user = action.payload
                state.error = false
                state.isLogged = true
                localStorage.setItem('email',action.payload.user.email)
                localStorage.setItem('token',action.payload.user.token)
                localStorage.setItem('isLogged', 'true')
                localStorage.setItem('username',action.payload.user.username)
            })
            .addCase(editUser.rejected,(state, action)=>{
                state.error = true
            })
            .addCase(editUser.fulfilled,(state, action)=>{
                state.user = action.payload
            })
    }
})

export default accountSlice.reducer