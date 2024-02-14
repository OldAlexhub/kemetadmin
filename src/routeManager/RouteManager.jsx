import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import Login from "../routes/Login";
import AddDrivers from "../routes/AddDrivers";
import Home from "../routes/Home";
import ProtectedRoute from "../components/ProtectedRoute";
import AddUser from "../routes/AddUser";
import BookARide from "../routes/BookARide";
import CCPayment from "../routes/CCPayment";
import TripRequests from "../routes/TripRequests";
import Drivers from "../routes/Drivers";
import AdminList from "../routes/AdminList";
import AssginedTrips from "../routes/AssginedTrips";
import DriverApplicant from "../routes/DriverApplicant";
import Companies from "../routes/Companies";
import Communications from "../routes/Communications";
import Completed from "../routes/Completed";
import Financials from "../routes/Financials";
import PayOut from "../routes/PayOut";
import ShowPayments from "../routes/ShowPayments";
import SightseeingRequests from "../routes/SightseeingRequests";
import CustomerList from "../routes/CustomerList";

const RouteManager = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="add-driver" element={<AddDrivers />} />
          <Route path="add-user" element={<AddUser />} />
          <Route path="book" element={<BookARide />} />
          <Route path="ccpayment" element={<CCPayment />} />
          <Route path="triprequests" element={<TripRequests />} />
          <Route path="drivers" element={<Drivers />} />
          <Route path="adminlist" element={<AdminList />} />
          <Route path="assigned" element={<AssginedTrips />} />
          <Route path="driverapply" element={<DriverApplicant />} />
          <Route path="companies" element={<Companies />} />
          <Route path="communications" element={<Communications />} />
          <Route path="completed" element={<Completed />} />
          <Route path="financials" element={<Financials />} />
          <Route path="payout" element={<PayOut />} />
          <Route path="showpayments" element={<ShowPayments />} />
          <Route path="sightseeingrequests" element={<SightseeingRequests />} />
          <Route path="customerlist" element={<CustomerList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RouteManager;
