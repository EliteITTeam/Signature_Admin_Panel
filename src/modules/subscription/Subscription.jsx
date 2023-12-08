import React, { useLayoutEffect, useState } from "react";
import styles from "./Subscription.module.scss";
import { deleteIcon, search } from "./../../assets";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGlobalContext } from "../../Context";
import { getAllSubscriptions } from "../../store/actions/subscription.actions";
import { Pagination, styled } from "@mui/material";

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

const Subscription = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { loading, results, totalPages } = useSelector(
    (s) => s.subscriptionReducer
  );
  const dispatch = useDispatch();
  const { setIsGlobalLoading } = useGlobalContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const search = formData.get("search");
    if (search) setSearchText(search);
  };

  useLayoutEffect(() => {
    dispatch(getAllSubscriptions({ search: searchText, page: currentPage }));
  }, [currentPage, dispatch, searchText]);

  useLayoutEffect(() => {
    setIsGlobalLoading(loading);
  }, [loading]);

  return (
    <div className={styles.container}>
      <h1>Subscribed users</h1>

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
                <th>Clients Name</th>
                <th>Email</th>
                <th>Subscription Plan</th>
                <th>Monthly</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {results.map((subsription, i) => (
                <tr
                  key={i}
                  onClick={() =>
                    navigate(`/subscriptionUpdate?_id=${subsription._id}`)
                  }
                >
                  <td>{subsription?.user?.name ?? "--"}</td>
                  <td>{subsription?.user?.email ?? "--"}</td>
                  <td>{subsription?.name ?? "--"}</td>
                  <td>By Card</td>
                  <td>{/* <img src={deleteIcon} alt="deleteIcon" /> */}</td>
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
  );
};

export default Subscription;
