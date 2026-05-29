/*eslint-disable */
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";

import Iconify from "src/components/iconify";
import Logo from "src/components/logo";
// import Searchbar from './common/searchbar';
import AccountPopover from "./common/account-popover";
import LanguagePopover from "./common/language-popover";

// ----------------------------------------------------------------------

export default function Header({ onOpenNav }) {
  const renderContent = (
    <>
      <div className="header-right">
        <div className="navbar-avtar">
          <LanguagePopover />
          <AccountPopover />
        </div>
      </div>
    </>
  );

  return (
    <div className="main-header fixed-top navbar">
      <div className="headera-logo-wrap sidebar-top-toggle d-block">
        <Logo className="logo img-fluid" sx={{ height: 32, width: "180px" }} />

        <IconButton
          onClick={onOpenNav}
          className="sidebar-icon sidebar-toggle sidebar-toggle-desk"
        >
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
      </div>
      <div className="main-header-right">{renderContent}</div>
    </div>
  );
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
};
