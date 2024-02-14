import { Outlet, Link, useNavigate } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Remove items from local storage
      localStorage.removeItem("name");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      localStorage.removeItem("phone");
      // Use setTimeout to give the browser time to remove the items from local storage
      setTimeout(() => {
        if (
          localStorage.getItem("name") === null &&
          localStorage.getItem("token") === null &&
          localStorage.getItem("userId") === null &&
          localStorage.getItem("email") === null &&
          localStorage.getItem("role") === null &&
          localStorage.getItem("phone") === null
        ) {
          navigate("/login");
        } else {
          console.error("Failed to remove items from localStorage");
        }
      }, 0);
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Kemet Transportation
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              {/* Add Dropdown */}

              <li className="nav-item">
                <Link className="nav-link" to="/book">
                  Book A Ride
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/triprequests">
                  Trip Requests
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/sightseeingrequests">
                  Sightseeing Requests
                </Link>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdownMenuLink"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Add
                </a>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  <li>
                    <Link className="dropdown-item" to="/add-driver">
                      Add Drivers
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/add-user">
                      Add Users
                    </Link>
                  </li>
                </ul>
              </li>
              {/* Lists Dropdown */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdownMenuLink2"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Lists
                </a>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="navbarDropdownMenuLink2"
                >
                  <li>
                    <Link className="dropdown-item" to="/drivers">
                      Drivers List
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/adminlist">
                      Admin List
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/customerlist">
                      Customer List
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdownMenuLink2"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Reports
                </a>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="navbarDropdownMenuLink2"
                >
                  <li>
                    <Link className="dropdown-item" to="/assigned">
                      Assigned Trips
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/completed">
                      Completed Trips
                    </Link>
                  </li>

                  <li>
                    <Link className="dropdown-item" to="/payout">
                      Payout
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/showpayments">
                      Payments
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/financials">
                      Financials
                    </Link>
                  </li>
                </ul>
              </li>
              {/* Applicants Dropdown */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdownMenuLink3"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Applicants
                </a>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="navbarDropdownMenuLink3"
                >
                  <li>
                    <Link className="dropdown-item" to="/driverapply">
                      Driver Applicants
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/companies">
                      Companies
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/communications">
                  Communications
                </Link>
              </li>
            </ul>

            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to="#" className="nav-link" onClick={handleLogout}>
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default Layout;
