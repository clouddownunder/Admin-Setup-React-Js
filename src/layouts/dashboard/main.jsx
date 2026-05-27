/* eslint-disable */

import PropTypes from "prop-types";
import Header from "./header";

// ----------------------------------------------------------------------

export default function Main({ children, sx, setOpenNav, ...other }) {
  return (
    <div className="page" component="main" {...other}>
      <Header onOpenNav={() => setOpenNav(true)} />
      {children}
    </div>
  );
}

Main.propTypes = {
  children: PropTypes.node,
  sx: PropTypes.object,
};
