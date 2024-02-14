import React from "react";
import DriversGraph from "../graphs/Drivers";
import BookingsGraphs from "../graphs/Bookings";
import SightSeeingsGraphs from "../graphs/SightSeeings";
import ReturnsGraphs from "../graphs/Returns";
import MessagesGraphs from "../graphs/Messages";
import ShowDriverIncomeGraph from "../graphs/ShowIncome";

const Home = () => {
  const name = localStorage.getItem("name");

  return (
    <div className="container-fluid mt-4">
      <h1 className="text-center mb-5">Welcome, {name}</h1>
      <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
        <div className="col">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Driver Stats</h5>
              <DriversGraph />
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Booking Stats</h5>
              <BookingsGraphs />
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Return Trip Stats</h5>
              <ReturnsGraphs />
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Sightseeing Stats</h5>
              <SightSeeingsGraphs />
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Messages</h5>
              <MessagesGraphs />
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Income Stats</h5>
              <ShowDriverIncomeGraph />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
