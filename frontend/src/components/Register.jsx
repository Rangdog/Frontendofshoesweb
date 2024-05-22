import '../App.css'
import { Box, Button } from '@mui/material'
import MyTextField from './form/MyTextField'
import MyPassField from './form/MyPassField'
import MyButton from './form/MyButton'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import AxiosInstance from './AxiosInstante'
import { useNavigate } from 'react-router-dom'

const Register = ()=>{
    const {handleSubmit, control} = useForm()
    const submission = (data)=>{
        AxiosInstance.post(`register/`,{
            email:data.email,
            password: data.password,
        })
        .then(() =>{
            navigate(`/`)
        })
    }
    return(
        <div className={"myBackground"}>
            <form onSubmit={handleSubmit(submission)}>
                <Box className={"whiteBox"}>
                    <Box className={"itemBox"}>
                        <Box className={"title"}>
                            User registration
                        </Box>
                    </Box>
                    <Box className={"itemBox"}>
                        <MyTextField label = {"Email"} name = {"email"} control={control}/>
                    </Box>
                    <Box className={"itemBox"}>
                        <MyPassField label = {"Password"} name = {"password"} control={control}/>
                    </Box>
                    <Box className={"itemBox"}>
                        <MyPassField label = {"Comfirm password"} name = {"password2"} control={control}/>
                    </Box>
                    <Box className={"itemBox"}>
                        <MyButton label={"Register"} type = {"submit"}/>
                    </Box>
                    <Box className={"itemBox"}>
                        <Link to = "/login" >Already registred? Please login!</Link>
                    </Box>  
                </Box>
            </form>
        </div>
    )
}

export default Register