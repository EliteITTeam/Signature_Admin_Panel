import React, { useEffect, useLayoutEffect, useState } from "react";
import styles from "./ChangePassword.module.scss";
import { share } from "./../../assets";
import OtpInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import {
  changePasswordByOTP,
  generateOTP,
} from "../../store/actions/auth.action";
import toast from "react-hot-toast";
import { useGlobalContext } from "../../Context";
import { useFormik } from "formik";
import { passwordChangeByOTPSchema } from "../../schemas";
import { useNavigate } from "react-router-dom";

const errorStyles = {
  color: "#d63535",
  fontSize: "1.3rem",
  paddingTop: ".65rem",
};

const ChangePassword = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const {
    user: { email },
    loading,
  } = useSelector((s) => s.authReducer);
  const { setIsGlobalLoading } = useGlobalContext();
  const dispatch = useDispatch();
  const [countdown, setCountdown] = useState(60);
  const [disabled, setDisabled] = useState(false);

  const { ...formik } = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: passwordChangeByOTPSchema,
    onSubmit: ({ newPassword }) => {
      if (otp.length !== 6) {
        return;
      }
      dispatch(
        changePasswordByOTP(
          {
            body: {
              email: email ?? "",
              otp,
              newPassword,
            },
          },
          () => {
            toast.success("Your password has been changed!");
            navigate("/settings");
          }
        )
      );
    },
  });

  useEffect(() => {
    dispatch(
      generateOTP({ body: { email: email ?? "" } }, () => {
        toast.success("OTP has been sent to your email!");
        setCountdown(60);
        setDisabled(true);
      })
    );
  }, [dispatch, email]);

  useEffect(() => {
    let interval;

    if (countdown > 0 && disabled) {
      interval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setDisabled(false);
    }

    return () => {
      clearInterval(interval);
    };
  }, [countdown, disabled]);

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
            <center>
              <h3>Email Sent</h3>
              <img src={share} alt="share" />
              <p>
                Enter your six digit code sent on <br />
                the given email
              </p>
            </center>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => <input {...props} />}
              inputStyle={{
                border: `1px solid #4EDAFC`,
                fontSize: "20px",
                padding: "2px",
                marginRight: "1.5rem",
                borderRadius: "5px",
                marginTop: "1.5rem",
              }}
              containerStyle={{
                display: "flex",
                justifyContent: "center",
              }}
            />

            <div className={styles.inputs}>
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
            </div>
            <div className={styles.buttons}>
              <button
                onClick={() =>
                  dispatch(
                    generateOTP({ body: { email: email ?? "" } }, () => {
                      toast.success("OTP has been sent to your email!");
                      setCountdown(60);
                      setDisabled(true);
                    })
                  )
                }
                type="submit"
                disabled={disabled}
              >
                Get New OTP{disabled ? ` (${countdown}s)` : ""}
              </button>
              <button
                onClick={formik.handleSubmit}
                type="submit"
                disabled={!formik.dirty || !formik.isValid || otp.length !== 6}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
