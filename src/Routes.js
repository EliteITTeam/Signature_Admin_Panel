import React from "react";
import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import {
  Login,
  Dashboard,
  SupportRequest,
  Subscription,
  ManageEmployee,
  Settings,
  InviteEmployee,
  ChangePassword,
  SubscriptionUpdate,
} from "./modules";
import { LayoutElement } from "./components/common";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { NotFound } from "./components";
import Loader from "./components/Loader/Loader";

const Routess = () => {
  const { user } = useSelector((s) => s.authReducer);

  return (
    <>
      <BrowserRouter>
        <Toaster
          toastOptions={{
            style: {
              fontSize: "18px",
            },
          }}
        />

        <Loader />

        <Routes>
          {!user?.email ? (
            <Route path="/" element={<Login />} />
          ) : user?.role === "admin" ? (
            <Route element={<LayoutElement />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/supportRequest" element={<SupportRequest />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/manageEmployee" element={<ManageEmployee />} />
              {/* <Route path="/inviteEmployee" element={<InviteEmployee />} /> */}
              <Route path="/changePassword" element={<ChangePassword />} />
              <Route
                path="/subscriptionUpdate"
                element={<SubscriptionUpdate />}
              />
              <Route path="/settings" element={<Settings />} />
            </Route>
          ) : user?.role === "Support Manager" ? (
            <Route element={<LayoutElement />}>
              <Route path="/supportRequest" element={<SupportRequest />} />
              <Route path="/changePassword" element={<ChangePassword />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          ) : user?.role === "Account Manager" ? (
            <Route element={<LayoutElement />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/changePassword" element={<ChangePassword />} />
              <Route
                path="/subscriptionUpdate"
                element={<SubscriptionUpdate />}
              />
              <Route path="/settings" element={<Settings />} />
            </Route>
          ) : null}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};
export default Routess;
