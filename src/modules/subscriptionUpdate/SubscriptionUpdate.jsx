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
      <h1>Subscription</h1>

      <div className={styles.bottom}>
        <div className={styles.topRow}>
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

        <div className={styles.cardInfoContainer}>
          <h2>Card Number</h2>

          <div className={styles.bottom}>
            <img
              src={billingCard}
              alt="billingCard"
              className={styles.container_billing_card_intro_first_image}
            />
            <input
              type="text"
              placeholder={`**** **** **** ${
                singleSubscription?.paymentMethod?.last4 ?? "****"
              }`}
              disabled
            />
          </div>
        </div>

        <div className={styles.email}>
          <h2>Billing email</h2>
          <input
            type="text"
            placeholder={singleSubscription?.user?.email ?? "--"}
            disabled
          />
        </div>

        <div className={styles.tableContainer}>
          <h2>Billing history</h2>
          <div className={styles.table}>
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
                  singleSubscription?.user?.transactionHistory?.length ===
                    0) && (
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
      </div>
    </div>
  );
};

export default SubscriptionUpdate;
