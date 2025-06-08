import React from "react";
import { TextField, Button } from "@mui/material";
import { Send, ArrowBack } from "@mui/icons-material";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { MdOutlineLockReset } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import './style/ForgetPassword.css'

const ForgetPassword = () => {
  const initialState = {
    email: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  const submitHandler = (values) => {
    console.log(values);
  };
  const navigate = useNavigate()

  return (
    <div className="forget-password-container">
      <div>
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
                    <div className="forget-password-icon">
                      <MdOutlineLockReset />
                    </div>
                    <p className="welcome-text">Find your account</p>
                    <span className="subtitle">
                      Enter your registered email
                    </span>
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
                    <Button
                      onClick={() => navigate("/otp")}
                      variant="contained"
                      fullWidth
                      type="submit"
                      endIcon={<Send />}
                      className="send-otp-button"
                    >
                      Send OTP
                    </Button>
                  </div>

                  <div className="form-field">
                    <Button
                      onClick={() => navigate("/login")}
                      startIcon={<ArrowBack />}
                      variant="outlined"
                      fullWidth
                      className="back-button"
                    >
                      Back to Login
                    </Button>
                  </div>

                  <div className="form-field">
                    <Button
                      variant="text"
                      color="secondary"
                      className="help-button"
                    >
                      Need help?
                    </Button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ForgetPassword;
