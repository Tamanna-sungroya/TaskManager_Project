import React, { useContext, useEffect, useRef, useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout'; 
import { Link, useNavigate } from 'react-router-dom';
import Input from "../../components/Inputs/Input";
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from "../../context/userContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [useOtp, setUseOtp] = useState(false);
  const [error, setError] = useState(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const googleBtnRef = useRef(null);

  const {updateUser} = useContext(UserContext);
  const navigate = useNavigate();

  //Handle Login Form Submit
  const handleLogin = async (e) => {
    e.preventDefault();

    if(!validateEmail(email)){
      setError("Please enter a valid email address.");
      return;
    }

    if(!useOtp && !password){
      setError("Please enter the password");
      return;
    }

    setError("");

    //Login API Call
    try{
      const response = useOtp
        ? await axiosInstance.post(API_PATHS.AUTH.VERIFY_LOGIN_OTP, { email, otp })
        : await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password });

      const { token, role } = response.data;

      if(token){
        localStorage.setItem("token", token);
        updateUser(response.data);

        //Redirected based on role
        if(role === "admin"){
          navigate("/admin/dashboard");
        }
        else{
          navigate("/user/dashboard");
        }
      }
    } catch(error){
      if(error.response && error.response.data.message){
        setError(error.response.data.message);
      }
      else{
        setError("Something went wrong. Please try again.");
      }
    }
  };

  const sendOtp = async () => {
    if(!validateEmail(email)) return setError("Please enter a valid email address.");
    try {
      await axiosInstance.post(API_PATHS.AUTH.SEND_LOGIN_OTP, { email });
      setUseOtp(true);
      setError("");
    } catch (error) {
      if (!error.response) {
        setError("Backend is not reachable. Start backend server on port 5000.");
        return;
      }
      setError(error.response?.data?.message || "Failed to send OTP.");
    }
  };

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || !window.google || !googleBtnRef.current) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        try {
          setGoogleLoading(true);
          const res = await axiosInstance.post(API_PATHS.AUTH.GOOGLE_LOGIN, {
            idToken: response.credential,
          });
          const { token, role } = res.data;
          if (token) {
            localStorage.setItem("token", token);
            updateUser(res.data);
            navigate(role === "admin" ? "/admin/dashboard" : "/user/dashboard");
          }
        } catch (e) {
          setError("Google login failed");
        } finally {
          setGoogleLoading(false);
        }
      },
    });

    googleBtnRef.current.innerHTML = "";
    window.google.accounts.id.renderButton(googleBtnRef.current, {
      theme: "outline",
      size: "large",
      width: 260,
      text: "continue_with",
      shape: "pill",
    });
  }, [navigate, updateUser]);

  return <AuthLayout>
    <div className = "lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
      <h3 className = "text-xl font-semibold text-black">Welcome Back</h3>
      <p className = "text-xs text-slate-700 mt-[5px] mb-6">Please enter your details to log in</p>

      <form onSubmit = {handleLogin}>
        <Input
        value = {email}
        onChange = {({ target }) => setEmail(target.value)}
        label = "Email Address"
        placeholder = "john@example.com"
        type = "text"
        />

        {useOtp ? (
          <Input
            value = {otp}
            onChange = {({ target }) => setOtp(target.value)}
            label = "OTP"
            placeholder = "6 digit code"
            type = "text"
          />
        ) : (
          <Input
            value = {password}
            onChange = {({ target }) => setPassword(target.value)}
            label = "Password"
            placeholder = "Min 8 Characters"
            type = "password"
          />
        )}

        {error && <p className = "text-red-500 text-xs pb-2.5">{error}</p>}

        <button type = "submit" className = "btn-primary">LOGIN</button>
        {!useOtp && <button type="button" className="btn-primary" onClick={sendOtp}>LOGIN WITH OTP</button>}
        <div className="mt-3 flex justify-center">
          <div ref={googleBtnRef} />
        </div>
        {googleLoading && <p className="text-xs text-slate-500 mt-2">Completing Google login...</p>}

        <p className = "text-[13px] text-slate-800 mt-3">
          Don't have an account?{" "}
          <Link className = "font-medium text-primary underline" to = "/signup">
          SignUp
          </Link>
          </p>
      </form>
    </div>
  </AuthLayout>
};

export default Login;