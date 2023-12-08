import React, { useLayoutEffect, useMemo, useState } from "react";
import styles from "./SupportRequest.module.scss";
import { search, deleteIcon } from "./../../assets";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Pagination, styled } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteSupportRequest,
  getAllSupportRequests,
  replyToSupportRequest,
} from "../../store/actions";
import { useGlobalContext } from "../../Context";
import { useFormik } from "formik";
import { replyToSupportRequestSchema } from "../../schemas";

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

const SupportRequest = () => {
  const [selectedId, setSelectedId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { loading, results, totalPages } = useSelector(
    (s) => s.supportRequestReducer
  );

  const dispatch = useDispatch();
  const { setIsGlobalLoading } = useGlobalContext();
  const selectedIssue = useMemo(() => {
    return results?.find((issue) => issue._id === selectedId);
  }, [results, selectedId]);
  const formik = useFormik({
    initialValues: {
      reply: "",
    },
    validationSchema: replyToSupportRequestSchema,
    onSubmit: (values, { resetForm }) => {
      const { reply } = values;
      dispatch(
        replyToSupportRequest(
          {
            page: currentPage,
            _id: selectedId,
            body: {
              email: selectedIssue?.email ?? "",
              name: selectedIssue?.name ?? "",
              issue: reply,
            },
            search: searchText,
          },
          () => {
            resetForm();
            setSelectedId("");
          }
        )
      );
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const search = formData.get("search");
    if (search) setSearchText(search);
  };

  useLayoutEffect(() => {
    dispatch(getAllSupportRequests({ search: searchText, page: currentPage }));
  }, [currentPage, dispatch, searchText]);

  useLayoutEffect(() => {
    setIsGlobalLoading(loading);
  }, [loading]);

  return (
    <>
      <Modal
        open={Boolean(selectedId)}
        onClose={() => {
          setSelectedId("");
        }}
        className={styles.modal}
      >
        <div className={styles.modal_box}>
          <label>Name</label>
          <input
            type="text"
            placeholder="Anton Hall"
            disabled
            value={selectedIssue?.name ?? "--"}
          />
          <label>Email</label>
          <input
            type="email"
            placeholder="anton@gmail.com"
            disabled
            value={selectedIssue?.email ?? "--"}
          />
          <label>Iissues</label>
          <textarea disabled value={selectedIssue?.issue ?? "--"}></textarea>
          <label>
            Reply <span>*</span>
          </label>
          <textarea
            placeholder="Reply To issue"
            value={formik.values.reply}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="reply"
          ></textarea>
          <label style={{ color: "#d63535" }}>
            {formik.errors.reply && formik.touched.reply
              ? formik.errors.reply
              : ""}
          </label>
          <button onClick={formik.handleSubmit}>Submit</button>
        </div>
      </Modal>

      <div className={styles.container}>
        <h1>Support Requests</h1>

        <div className={styles.bottom}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Search by Name"
              name="search"
              onChange={(e) => (e.target.value === "" ? setSearchText("") : "")}
            />
            <img onClick={handleSubmit} src={search} alt="search" />
          </form>

          <div className={styles.table}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Issue</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {results.map((supportRequest, i) => (
                  <tr
                    key={i}
                    onClick={() => setSelectedId(supportRequest?._id)}
                  >
                    <td>{supportRequest?.name ?? "--"}</td>
                    <td>{supportRequest?.email ?? "--"}</td>
                    <td>
                      {supportRequest?.issue
                        ? supportRequest?.issue?.length > 20
                          ? supportRequest?.issue.slice(0, 20) + "..."
                          : supportRequest?.issue
                        : "--"}
                    </td>
                    <td>
                      {supportRequest?.status
                        ? supportRequest?.status === "resolved"
                          ? "Resolved"
                          : "Pending"
                        : "--"}
                    </td>
                    <td>
                      <img
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(
                            deleteSupportRequest({
                              search: searchText,
                              page: currentPage,
                              _id: supportRequest?._id,
                            })
                          );
                        }}
                        src={deleteIcon}
                        alt="deleteIcon"
                      />
                    </td>
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

          {results?.length !== 0 && (
            <div className={styles.pagination}>
              <MyPagination
                count={totalPages}
                page={currentPage}
                onChange={(_, newPage) => setCurrentPage(newPage)}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SupportRequest;
