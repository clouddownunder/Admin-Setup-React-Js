/* eslint-disable */

import { useState } from "react";
import PropTypes from "prop-types";

import Header from "./header";
import Nav from "./nav";

// ----------------------------------------------------------------------

export default function DashboardLayout({ children }) {
  const [openNav, setOpenNav] = useState(false);

  return (
    <>
      <div className="sidebar-show-hide-bck"></div>
      <div className="page-wrapper">
        {/* Header */}
        <div className="header-height"></div>
        <Header onOpenNav={() => setOpenNav(true)} />

        {/* Sidebar + Page Content */}
        <div className="content-wrapper-main">
          {/* Sidebar */}
          <Nav openNav={openNav} onCloseNav={() => setOpenNav(false)} />

          {/* Main Content */}
          <div className="page">{children}</div>
        </div>
      </div>
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
