import React, { useLayoutEffect, useState } from "react";
import styles from "./ManageEmployee.module.scss";
import { employSearch } from "./../../assets";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import styled from "@emotion/styled";
import { Modal, Pagination, useMediaQuery } from "@mui/material";
import { useFormik } from "formik";
import { invitationSchema } from "../../schemas";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, inviteNewUser } from "../../store/actions";
import toast from "react-hot-toast";
import { useGlobalContext } from "../../Context";
import { RxOpenInNewWindow } from "react-icons/rx";

const MyPagination = styled(({ ...props }) => <Pagination {...props} />)`
  & > .MuiPagination-ul {
    & > li > button {
      font-size: 1.3rem;

      & > svg {
        height: 1.8rem;
        width: 1.8rem;
      }
    }
  }
`;

const ManageEmployee = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const { loading, results, totalPages } = useSelector(
    (s) => s.manageEmployeeReducer
  );
  const { setIsGlobalLoading } = useGlobalContext();
  const { ...formik } = useFormik({
    initialValues: {
      email: "",
      role: "Account Manager",
    },
    validationSchema: invitationSchema,
    onSubmit: (values, { resetForm }) => {
      const { email, role } = values;
      dispatch(
        inviteNewUser(
          {
            body: {
              email,
              role,
            },
          },
          () => {
            toast.success("Invited Successfully!");
            resetForm();
          }
        )
      );
    },
  });

  useLayoutEffect(() => {
    dispatch(getAllUsers({ page: currentPage }));
  }, [currentPage, dispatch]);

  useLayoutEffect(() => {
    setIsGlobalLoading(loading);
  }, [loading]);
  return (
    <div className={styles.container}>
      <h1>Manage employee</h1>

      <div className={styles.bottom}>
        <div className={styles.left}>
          <div className={styles.table}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {results?.map((singleUser, ind) => (
                  <tr key={ind}>
                    <td>{singleUser?.userName ?? "--"}</td>
                    <td className={styles.table_active}>
                      {singleUser?.email ?? "--"}
                    </td>
                    <td>{singleUser?.role ?? "--"}</td>
                  </tr>
                ))}

                {results?.length === 0 && (
                  <tr>
                    <td colSpan={5}>
                      <p style={{ textAlign: "center" }}>No Record Found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className={styles.pagination}>
            <MyPagination
              count={totalPages}
              page={currentPage}
              onChange={(_, newPage) => setCurrentPage(newPage)}
            />
          </div>
        </div>

        <WithResponsive>
          <div className={styles.inviteForm}>
            <div className={styles.formInput}>
              <h2>Add members</h2>
              <div>
                <div className={styles.input}>
                  <FaUserAlt />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formik.values.email}
                    name="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                {formik.errors.email && formik.touched.email && (
                  <p>{formik.errors.email}</p>
                )}
              </div>
            </div>

            <div className={styles.formInput}>
              <h2>Role</h2>
              <div>
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="Account Manager"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    defaultChecked
                  />
                  <span className="text">Account Manager</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="Support Manager"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <span className="text">Support Manager</span>
                </label>
              </div>
            </div>

            <button
              className={styles.container_grid_right_side_btns_btn2}
              onClick={formik.handleSubmit}
            >
              Send Invite
            </button>
          </div>
        </WithResponsive>
      </div>
    </div>
  );
};

export default ManageEmployee;

const WithResponsive = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const isTab = useMediaQuery("(max-width: 900px)");
  return isTab ? (
    <>
      <button onClick={() => setIsModalOpen(true)} className={styles.floating}>
        <RxOpenInNewWindow />
      </button>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className={styles.modal}
      >
        {children}
      </Modal>
    </>
  ) : (
    children
  );
};
