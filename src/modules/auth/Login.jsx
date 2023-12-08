import React, { useEffect } from "react";
import styles from "./Login.module.scss";
import { line, google } from "./../../assets";
import { useFormik } from "formik";
import { loginSchema } from "./../../schemas";
import { Puff } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/actions/auth.action";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";

const ButtonLoader = () => {
  return (
    <span className={styles.buttonLoader}>
      <Puff
        height="20"
        width="20"
        radius="6"
        color="white"
        ariaLabel="loading"
        wrapperStyle
        wrapperClass
      />
    </span>
  );
};

const LoginComp = () => {
  const { loading } = useSelector((s) => s.authReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { values, errors, handleBlur, handleChange, touched, handleSubmit } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: loginSchema,
      onSubmit: (values, action) => {
        const { email, password } = values;
        let body = { email, password };
        dispatch(
          loginUser({ body }, ({ user }) => {
            toast.success("Logged in successfully!");
            navigate(
              `${
                user?.role === "Support Manager"
                  ? "/supportRequest"
                  : "/dashboard"
              }`,
              { replace: true }
            );
          })
        );
      },
    });

  return (
    <>
      <div className={styles.login_container}>
        <div className={styles.login_container_box}>
          <h1>Sign in</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Email</label>
              <input
                type="text"
                placeholder="example@email.com"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              {errors.email && touched.email && (
                <p className="custom-form-error">{errors.email}</p>
              )}
            </div>

            <div>
              <label>Password</label>
              <input
                type="password"
                placeholder="*********"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              {errors.password && touched.password && (
                <p className="custom-form-error">{errors.password}</p>
              )}
            </div>

            <button type="submit" disabled={loading}>
              {loading && <ButtonLoader />}
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginComp;
