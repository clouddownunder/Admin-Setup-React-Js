/* eslint-disable */

import { useState } from "react";
import PropTypes from "prop-types";

import Nav from "./nav";
import Main from "./main";
import Header from "./header";

// ----------------------------------------------------------------------

export default function DashboardLayout({ children }) {
  const [openNav, setOpenNav] = useState(false);

  return (
    <>
      <div className="page-wrapper">
        <span className="header-box-shadow"></span>
        <Nav openNav={openNav} onCloseNav={() => setOpenNav(false)} />

        <Main setOpenNav={setOpenNav}>{children}</Main>
      </div>
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
