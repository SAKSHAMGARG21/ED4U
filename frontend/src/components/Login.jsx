
import React, { useEffect, useRef, useState } from 'react';
import { Button, Logo, Input, Loadar } from "./index"
import { useDispatch } from 'react-redux';
import { setCredentials } from "../features/auth/authSilce.js"
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../features/auth/authApiSlice.js';
function Login() {

    const userRef = useRef();
    const errRef = useRef();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    const [error, setError] = useState("");
    const [pwd, setPwd] = useState('');
    const [user, setUser] = useState('');

    const [login,{ isLoading }] = useLoginMutation();
    // axios.defaults.withCredentials = true;

    const submitdata = async (data) => {
        console.log(data);
        setPwd(data.email);
        setUser(data.password);
        handlelogin();
    }

    const handlelogin = async () => {
        try {
            setError("");
            setLoading(true);
            const res = await login({ user, pwd }).unwrap();
            console.log(res);
            dispatch(setCredentials(...res, user));
            setPwd('');
            setUser('')
            setLoading(false);
            navigate("/dashboard")
        } catch (error) {
            setError(err.message);
        }
    }

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setError('');
    }, [user, pwd])
    return isLoading ? <h1>Loading...</h1> : (
        <div className='flex justify-center items-center text-black h-lvh'>
            <div className={`w-full max-w-lg bg-gray-100 rounded-xl p-10`}>
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Don&apos;t have any account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
                <form onSubmit={handleSubmit(submitdata)} className='mt-8'>
                    <div className='space-y-5'>
                        <Input
                            label="Email: "
                            placeholder="Enter your email"
                            type="email"
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        "Email address must be a valid address",
                                }
                            })}
                        />
                        <Input
                            label="Password: "
                            type="password"
                            placeholder="Enter your password"
                            {...register("password", {
                                required: true,
                            })}
                        />
                        <Button
                            type="submit"
                            className="w-full hover:bg-blue-700"
                        > Sign in
                            {
                                loading && <Loadar />
                            }
                        </Button>
                    </div>
                </form>
            </div>

        </div>
    );
}

export default Login;