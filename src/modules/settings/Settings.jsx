import React, { useLayoutEffect } from "react";
import styles from "./Settings.module.scss";
import { checkBox } from "./../../assets";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { passwordChangeSchema } from "../../schemas";
import { useGlobalContext } from "../../Context";
import { changePasswordByOld } from "../../store/actions/auth.action";
import toast from "react-hot-toast";

const errorStyles = {
  color: "#d63535",
  fontSize: "1.3rem",
  paddingTop: ".65rem",
};

const Settings = () => {
  const navigate = useNavigate();
  const { user, loading } = useSelector((s) => s.authReducer);
  const { setIsGlobalLoading } = useGlobalContext();
  const dispatch = useDispatch();
  const { ...formik } = useFormik({
    initialValues: {
      email: user?.email ?? "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: passwordChangeSchema,
    onSubmit: (values, { resetForm }) => {
      const { email, oldPassword, newPassword } = values;
      dispatch(
        changePasswordByOld(
          { body: { email, oldPassword, newPassword } },
          () => {
            toast.success("Changed Successfully!");
          }
        )
      );
      resetForm();
    },
  });

  useLayoutEffect(() => {
    setIsGlobalLoading(loading);
  }, [loading]);

  return (
    <div className={styles.container}>
      <div className={styles.parent}>
        <div className={styles.child}>
          <h1 className={styles.child_heading}>Change Password</h1>
          <p className={styles.child_desc}>
            Your Password has Expired, Please choose a New Password
          </p>
          <div className={styles.child_form}>
            <form onSubmit={formik.handleSubmit}>
              <label>Old Password</label>
              <br></br>
              <input
                type="password"
                placeholder="*********"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.oldPassword}
                name="oldPassword"
              />
              {formik.touched.oldPassword && formik.errors.oldPassword && (
                <p style={errorStyles}>{formik.errors.oldPassword}</p>
              )}
              <div className={styles.child_form_question}>
                <label>New Password</label>
              </div>
              <input
                type="password"
                placeholder="*********"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.newPassword}
                name="newPassword"
              />
              {formik.touched.newPassword && formik.errors.newPassword && (
                <p style={errorStyles}>{formik.errors.newPassword}</p>
              )}
              <div className={styles.child_form_question}>
                <label>Confirm New Password</label>
              </div>
              <input
                type="password"
                placeholder="*********"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
                name="confirmPassword"
              />
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <p style={errorStyles}>{formik.errors.confirmPassword}</p>
                )}
              <button type="submit">Reset Password</button>
              <div
                className={styles.child_form_question}
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/changePassword")}
              >
                <p>Two factor authentication</p>
                {/* <input type="checkbox" checked /> */}
                <img src={checkBox} alt="checkBox" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
