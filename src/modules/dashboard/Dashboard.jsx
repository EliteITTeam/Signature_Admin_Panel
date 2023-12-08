import React, { useEffect, useLayoutEffect, useMemo } from "react";
import styles from "./Dashboard.module.scss";
import Grid from "@mui/material/Grid";
import {
  heart,
  business,
  tableSearch,
  chart4,
  chart5,
  tableUserImage,
  graphMenu,
  blueImage,
  grayImage,
  darkBlueImage,
} from "./../../assets";
import {
  Chart as ChartJS,
  Title,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardData } from "../../store/actions/dashboard.actions";
import { useGlobalContext } from "../../Context";

ChartJS.register(
  Tooltip,
  Legend,
  ArcElement,
  Title,
  LineElement,
  Filler,
  CategoryScale,
  LinearScale,
  PointElement
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
};

// export

const Dashboard = () => {
  const dispatch = useDispatch();
  const { usersPieChart, percentages, allUsers, loading, monthlyData } =
    useSelector((s) => s.dashboardReducer);
  const { setIsGlobalLoading } = useGlobalContext();

  const lineGraphLabels = [
    "Jan",
    "Feb",
    "Mar",
    "April",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const listArray = useMemo(
    () => [
      {
        number: usersPieChart.starter ?? 0,
        type: "Starter",
        perc: `${percentages.starter ?? "--"}%`,
        desc: "Starter subscription plan",
      },
      {
        number: usersPieChart.smallBusiness ?? 0,
        type: "Small Business",
        perc: `${percentages.smallBusiness ?? "--"}%`,
        desc: "Small Business",
      },
      {
        number: usersPieChart.professional ?? 0,
        type: "Professional",
        perc: `${percentages.professional ?? "--"}%`,
        desc: "Professional subscription plan",
      },
      {
        number: usersPieChart.company ?? 0,
        type: "Company",
        perc: `${percentages.company ?? "--"}%`,
        desc: "Company Users",
      },
      {
        number: usersPieChart.enterprise ?? 0,
        type: "Enterprise",
        perc: `${percentages.enterprise ?? "--"}%`,
        desc: "Enterprise subscription plan",
      },
    ],
    [usersPieChart, percentages]
  );

  const pieChartData = useMemo(
    () => ({
      labels: [
        "Starter",
        "Professional",
        "Small business",
        "Comapny",
        "Enterprise",
      ],
      datasets: [
        {
          data: [
            usersPieChart?.starter,
            usersPieChart?.professional,
            usersPieChart?.smallBusiness,
            usersPieChart?.company,
            usersPieChart?.enterprise,
          ],
          backgroundColor: [
            "#8A8A8A",
            "#01CAFD",
            "#2B4465",
            "#0884B8",
            "#D5F3FA",
          ],
        },
      ],
    }),
    [usersPieChart]
  );

  const lineData = useMemo(() => {
    if (!monthlyData) return Array(12).fill(0);
    const keys = Object.keys(monthlyData);
    if (keys.length !== 12) return Array(12).fill(0);
    return keys.map((key) => monthlyData[key]);
  }, [monthlyData]);

  useEffect(() => {
    dispatch(getDashboardData());
  }, [dispatch]);

  useLayoutEffect(() => {
    setIsGlobalLoading(loading);
  }, [loading]);

  return (
    <div className={styles.container}>
      <div className={styles.container_header}>
        <h1>Dashboard</h1>
      </div>

      <div className={styles.bottom}>
        <div className={styles.cardsGrid}>
          {listArray.map((data, ind) => {
            return (
              <div key={ind} className={styles.item}>
                {ind % 2 === 0 ? (
                  <img src={heart} alt="Heart" />
                ) : (
                  <img src={business} alt="Business" />
                )}
                <div className={styles.info}>
                  <p>{data.number}</p>
                  <p>{data.type}</p>
                  <p>
                    <span>{data.perc}</span> {data.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.graph}>
          <div className={styles.item}>
            <p>Total users data on monthly basis</p>
            <div className={styles.chart}>
              <Line
                data={{
                  labels: lineGraphLabels,
                  datasets: [
                    {
                      data: lineData,
                      type: "line",
                      order: 2,
                      borderColor: "#01CAFD",
                      backgroundColor: "#01CAFD",
                      pointBackgroundColor: "#2B4465",
                      tension: 0.4,
                      fill: true,
                    },
                  ],
                }}
                options={options}
              ></Line>
            </div>
          </div>
          <div className={styles.item}>
            <p>Registered User</p>
            <div className={styles.chart}>
              <Pie data={pieChartData} options={options}></Pie>
            </div>
            <div className={styles.colors}>
              <div className={styles.colors_item}>
                <img src={grayImage} alt="grayImage" />
                <p>Starter</p>
              </div>
              <div className={styles.colors_item}>
                <img src={blueImage} alt="grayImage" />
                <p>Professional</p>
              </div>
              <div className={styles.colors_item}>
                <img src={darkBlueImage} alt="grayImage" />
                <p>Small Business</p>
              </div>
              <div className={styles.colors_item}>
                <img src={chart4} alt="grayImage" />
                <p>Comapny</p>
              </div>
              <div className={styles.colors_item}>
                <img src={chart5} alt="grayImage" />
                <p>Enterprise</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.container_table}>
          <p>All Registered users</p>
          <div className={styles.content}>
            <table>
              <thead>
                <tr>
                  {/* <th>Tracking no</th> */}
                  <th>User Name</th>
                  <th>Display Packege</th>
                  <th>No of Signature</th>
                  {/* <th>Total Payment</th> */}
                </tr>
              </thead>
              <tbody>
                {allUsers.map((user, ind) => (
                  <tr key={ind}>
                    <td data-label="userName">
                      <img
                        src={user?.photoPath ?? tableUserImage}
                        alt="tableUserImage"
                      />
                      <span>{user?.name ?? "--"}</span>
                    </td>
                    <td data-label="price">{user?.subscription ?? "--"}</td>
                    <td data-label="singantureNo">{user?.signatures ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
