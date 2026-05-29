/* eslint-disable */

import PropTypes from "prop-types";

// ----------------------------------------------------------------------

export default function Main({ children }) {
  return (
    <div className="page-content">
      <div className="page-content-wrap-inn">{children}</div>
    </div>
  );
}

Main.propTypes = {
  children: PropTypes.node,
};
