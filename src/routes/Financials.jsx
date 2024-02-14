import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import { saveAs } from "file-saver";
import ReturnFinances from "../components/ReturnFinances";
import SightseeingFinancials from "../components/SightseeingFinancials";

const Financials = () => {
  const [monies, setMonies] = useState([]);
  const [totals, setTotals] = useState({
    grossIncome: 0,
    costToDriver: 0,
    profit: 0,
  });

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(process.env.REACT_APP_TRIP_REQUESTS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const fetchedMonies = response.data.trips;
        setMonies(fetchedMonies);

        const totals = fetchedMonies.reduce(
          (acc, cash) => {
            const grossIncome = cash.fare;
            const costToDriver = cash.fare * 0.4;
            const profit = cash.fare * 0.6;

            acc.grossIncome += grossIncome;
            acc.costToDriver += costToDriver;
            acc.profit += profit;

            return acc;
          },
          { grossIncome: 0, costToDriver: 0, profit: 0 }
        );

        setTotals({
          grossIncome: totals.grossIncome.toFixed(2),
          costToDriver: totals.costToDriver.toFixed(2),
          profit: totals.profit.toFixed(2),
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchTrips();
  }, []);

  const downloadCSV = () => {
    const csvRows = [
      "Booking ID,Gross Income,Cost/ Paid to Driver,Profit",
      ...monies.map((cash) =>
        [
          cash.bookingId,
          cash.fare.toFixed(2),
          (cash.fare * 0.4).toFixed(2),
          (cash.fare * 0.6).toFixed(2),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvRows], { type: "text/csv" });
    saveAs(blob, "financials.csv");
  };

  const chartData = {
    labels: ["Cost/ Paid to Driver", "Profit"],
    datasets: [
      {
        label: "Financial Overview",
        data: [totals.costToDriver, totals.profit],
        backgroundColor: ["rgba(255, 206, 86, 0.2)", "rgba(75, 192, 192, 0.2)"],
        borderColor: ["rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mt-4">
      <h2 style={{ textAlign: "center" }}>Financial Statement</h2>
      <div className="row">
        <div className="col-md-6">
          <div style={{ width: "400px", height: "400px" }}>
            <Pie data={chartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <button className="btn btn-primary mb-3" onClick={downloadCSV}>
            Download CSV
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="table-responsive">
            <table className="table table-bordered mt-3">
              <thead className="thead-light">
                <tr>
                  <th>Booking ID</th>
                  <th>Gross Income</th>
                  <th>Cost/ Paid to Driver</th>
                  <th>Profit</th>
                </tr>
              </thead>
              <tbody>
                {monies.map((cash) => (
                  <tr key={cash._id}>
                    <td>{cash.bookingId}</td>
                    <td>${cash.fare.toFixed(2)}</td>
                    <td>${(cash.fare * 0.4).toFixed(2)}</td>
                    <td>${(cash.fare * 0.6).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>
                    <strong>Total</strong>
                  </td>
                  <td>
                    <strong>${totals.grossIncome}</strong>
                  </td>
                  <td>
                    <strong>${totals.costToDriver}</strong>
                  </td>
                  <td>
                    <strong>${totals.profit}</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <ReturnFinances />
          <SightseeingFinancials />
        </div>
      </div>
    </div>
  );
};

export default Financials;
