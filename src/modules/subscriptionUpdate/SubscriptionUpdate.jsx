import React, { useLayoutEffect, useMemo } from "react";
import styles from "./SubscriptionUpdate.module.scss";
import { search, billingCard, downArrow, horizontalLine } from "./../../assets";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { formatDate } from "../../utils";

const SubscriptionUpdate = () => {
  const { results } = useSelector((s) => s.subscriptionReducer);
  const _id = new URLSearchParams(useLocation().search).get("_id");
  const navigate = useNavigate();

  const singleSubscription = useMemo(() => {
    if (!_id) return null;
    return results?.find((item) => item._id === _id);
  }, [results, _id]);

  useLayoutEffect(() => {
    if (!singleSubscription) {
      navigate("/subscription");
      return;
    }
  }, [navigate, singleSubscription]);

  return (
    <div className={styles.container}>
      <div className={styles.container_header}>
        <h1>Subscription</h1>
        {/* <select>
          <option>Mar 2023</option>
          <option>Mar 2024</option>
          <option>Mar 2025</option>
        </select> */}
      </div>
      <div className={styles.container_intro}>
        <div className={styles.container_intro_left_side}>
          <div>
            <p>Client name</p>
            <span>{singleSubscription?.user?.name ?? "--"}</span>
          </div>
          <div>
            <p>Status</p>
            <span style={{ color: "#6EC4CF" }}>Active</span>
          </div>
          <div>
            <p>Subscription Plan</p>
            <span>{singleSubscription?.name ?? "--"}</span>
          </div>
          <div>
            <p>Billing Cycle</p>
            <span>By Card</span>
          </div>
          <div>
            <p>Price</p>
            <span>${singleSubscription?.price ?? "--"}</span>
          </div>
          {/* <div>
            <p>Payment Due</p>
            <span>Valid</span>
          </div> */}
        </div>
        <div className={styles.container_intro_right_side}>
          <input type="text" placeholder="Search by Name" />
          <img src={search} alt="search" />
        </div>
      </div>
      <div className={styles.container_billing_info}>
        <h1>Plan and billing</h1>
        <p>Payment method</p>
      </div>
      <div className={styles.container_billing_card}>
        <div className={styles.container_billing_card_intro}>
          <img
            src={billingCard}
            alt="billingCard"
            className={styles.container_billing_card_intro_first_image}
          />
          {/* <img
            src={downArrow}
            alt="downArrow"
            className={styles.container_billing_card_intro_second_image}
          /> */}
        </div>
        <div className={styles.container_billing_card_input}>
          <input
            type="text"
            placeholder={`**** **** **** ${
              singleSubscription?.paymentMethod?.last4 ?? "****"
            }`}
            disabled
          />
        </div>
      </div>
      <div className={styles.container_billing_card_horizontal_line}>
        <img src={horizontalLine} alt="horizontalLine" />
      </div>
      <div className={styles.container_billing_card_email_info}>
        <p>Billing email</p>
        <input
          type="text"
          placeholder={singleSubscription?.user?.email ?? "--"}
          disabled
        />
      </div>
      <div className={styles.container_billing_card_horizontal_line}>
        <img src={horizontalLine} alt="horizontalLine" />
      </div>
      <div className={styles.container_billing_card_table_heading}>
        <h1>Billing history</h1>
      </div>
      <div className={styles.container_billing_card_table}>
        <div className={styles.overflow}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Paid</th>
                <th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {singleSubscription?.user?.transactionHistory
                ? singleSubscription?.user?.transactionHistory?.map(
                    (transaction, ind) => (
                      <tr key={ind}>
                        <td>
                          {transaction?.date
                            ? formatDate(transaction?.date ?? Date.now())
                            : "--"}
                        </td>
                        <td>
                          $
                          {transaction?.amount
                            ? transaction?.amount / 100
                            : "--"}
                        </td>
                        <td>{transaction?.invoice ?? "--"}</td>
                      </tr>
                    )
                  )
                : ""}

              {(!singleSubscription?.user?.transactionHistory ||
                singleSubscription?.user?.transactionHistory?.length === 0) && (
                <tr>
                  <td style={{ textAlign: "center" }} colSpan={3}>
                    No history found!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* <div className={styles.container_billing_card_btns}>
        <div className={styles.container_billing_card_btns_btn1}>
          <button>Cancel</button>
        </div>
        <div className={styles.container_billing_card_btns_btn2}>
          <button>Update</button>
        </div>
      </div> */}
    </div>
  );
};

export default SubscriptionUpdate;
