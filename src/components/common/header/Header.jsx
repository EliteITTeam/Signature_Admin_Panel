import React from "react";
import styles from "./Header.module.scss";
import { CgMenuRightAlt } from "react-icons/cg";
import { logo } from "./../../../assets";
import { useNavigate } from "react-router-dom";
const Header = ({ handler, isSideOpen }) => {
  const navigate = useNavigate();
  return (
    <>
      <div
        onClick={handler}
        className={`${styles.bgWrapper} ${isSideOpen ? styles.show : ""}`}
      ></div>
      <div className={styles.container}>
        <div
          className={styles.left}
          onClick={() => navigate("/dashboard")}
          style={{ cursor: "pointer" }}
        >
          <a>
            <img src={logo} alt="Stamplify" />
          </a>
        </div>
        <div className={styles.right}>
          <button onClick={handler}>
            <CgMenuRightAlt />
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;
