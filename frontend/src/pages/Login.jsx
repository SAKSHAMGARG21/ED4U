import React from 'react'
import Template from '../components/Core/Auth/Template'
import loginImg from "../assets/Images/login.webp"
function Login() {
    return (
        <div>
            <Template
                title="Welcome Back"
                description1="Build skills for today, tomorrow, and beyond."
                description2="Education to future-proof your career."
                image={loginImg}
                formType="login"
            ></Template>
        </div>
    )
}

export default Login