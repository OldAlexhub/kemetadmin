import React from "react";

const Footer = () => {
  return (
    <footer className="footer mt-auto py-3 bg-light">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <p className="text-muted mb-0">
              &copy; {new Date().getFullYear()} Kemet Transportation
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
