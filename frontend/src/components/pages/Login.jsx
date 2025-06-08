import React from "react";
import { MdLogin } from "react-icons/md";
import { TextField, Button, Divider } from "@mui/material";
import { Google, ArrowBack } from "@mui/icons-material";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import httpAction from "../../utils/httpActions";
import apis from "../../utils/apis";
import './style/Login.css'

const initialState = {
  email: "",
  password: "",
};

const loginWithGoogle = ()=>{
  window.location.href = 'http://localhost:3000/auth/google'
}

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();

  const submitHandler = async(values) => {
    try {
      //console.log(values);
      const data = {
            url: apis().loginUser,
            method: "POST",
            body: values,
          };
      
      const result = await httpAction(data);
      if (result?.success) {
        toast.success(result?.message);
        localStorage.setItem('token', result?.accessToken); // Store the accessToken in localStorage
        navigate("/dashboard");
      } else {
        // Handle error case
        toast.error(result?.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    }
  };

  return (
    <div className="login-container">
      <Formik
        onSubmit={submitHandler}
        validationSchema={validationSchema}
        initialValues={initialState}
      >
        {({ handleBlur, handleChange, values, touched, errors }) => (
          <Form>
            <div className="auth_card">
              <div className="container-fluid">
                <div className="header-section">
                  <div className="login-icon">
                    <MdLogin />
                  </div>
                  <p className="welcome-text">Welcome back</p>
                  <span className="subtitle">Login to continue</span>
                </div>

                <div className="form-field">
                  <TextField
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    label="Your email"
                    fullWidth
                    variant="outlined"
                  />
                </div>

                <div className="form-field">
                  <TextField
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    label="Your password"
                    fullWidth
                    variant="outlined"
                  />
                </div>

                <div className="form-field">
                  <Button 
                    variant="contained" 
                    fullWidth 
                    type="submit"
                    className="login-button"
                  >
                    Login
                  </Button>
                </div>

                <div className="divider-section">
                  <Divider>OR</Divider>
                </div>

                <div className="form-field">
                  <Button 
                  onClick={loginWithGoogle}
                    variant="outlined" 
                    fullWidth 
                    endIcon={<Google />}
                    className="google-button"
                  >
                    Continue with Google
                  </Button>
                </div>

                <div className="form-field">
                  <Button 
                    onClick={()=>navigate('/register')}
                    startIcon={<ArrowBack/>} 
                    variant="outlined" 
                    fullWidth
                    className="signup-button"
                  >
                    Create new account
                  </Button>
                </div>

                <div className="form-field">
                  <Button 
                  onClick={()=>navigate('/forgetpassword')}
                    variant="text" 
                    color="error"
                    className="forgot-password"
                  >
                    Forgot password?
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;