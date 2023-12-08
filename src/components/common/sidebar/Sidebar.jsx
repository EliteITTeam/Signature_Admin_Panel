import React, { useMemo } from "react";
import { logo } from "../../../assets";
import styles from "./Sidebar.module.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  dashboardWithoutBackground,
  manageEmployee,
  setting,
  subscription,
  supportRequest,
  avatar,
  logout,
} from "./../../../assets";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../store/actions/auth.action";
import { toast } from "react-hot-toast";

const Sidebar = ({ handler }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((s) => s.authReducer);

  const getColor = (current) => {
    if (location.pathname === current) {
      return "#01C8FB";
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logged out successfully!");
    navigate("/", { replace: true });
  };

  const data = useMemo(
    () =>
      user?.role === "admin"
        ? [
            {
              path: "/dashboard",
              icon: dashboardWithoutBackground,
              title: "Dashboard",
            },
            {
              path: "/supportRequest",
              icon: supportRequest,
              title: "Support Request",
            },
            {
              path: "/subscription",
              icon: subscription,
              title: "Subscription",
            },
            {
              path: "/manageEmployee",
              icon: manageEmployee,
              title: "Manage employee",
            },
            {
              path: "/settings",
              icon: setting,
              title: "Settings",
            },
          ]
        : user?.role === "Support Manager"
        ? [
            {
              path: "/supportRequest",
              icon: supportRequest,
              title: "Support Request",
            },
            {
              path: "/settings",
              icon: setting,
              title: "Settings",
            },
          ]
        : user?.role === "Account Manager"
        ? [
            {
              path: "/dashboard",
              icon: dashboardWithoutBackground,
              title: "Dashboard",
            },
            {
              path: "/subscription",
              icon: subscription,
              title: "Subscription",
            },
            {
              path: "/settings",
              icon: setting,
              title: "Settings",
            },
          ]
        : [],
    [user?.role]
  );

  return (
    <div className={styles.container}>
      <div
        className={styles.container_main_logo}
        onClick={() => navigate("/dashboard")}
        style={{ cursor: "pointer" }}
      >
        <img src={logo} alt="main_logo" />
      </div>
      <div className={styles.container_routing}>
        <ul>
          {data.map((item, ind) => {
            return (
              <li key={ind}>
                <Link to={item.path} onClick={() => handler()}>
                  <span className={styles.icon}>
                    <img src={item.icon} alt="icons" />
                  </span>
                  <span
                    className={styles.text}
                    style={{
                      color: getColor(item.path),
                    }}
                  >
                    {item.title}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className={styles.container_bottom} onClick={handleLogout}>
        <div className={styles.left}>
          <img src={user?.photoPath ?? avatar} alt="avatar" />
        </div>
        <div className={styles.info}>
          <p className={styles.name}>{user?.userName ?? "--"}</p>
          <span className={styles.scale}>{user?.role ?? "--"}</span>
        </div>
        <div className={styles.right}>
          <img src={logout} alt="logout" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
