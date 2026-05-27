/*eslint-disable */
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";

import Iconify from "src/components/iconify";

// import Searchbar from './common/searchbar';
import AccountPopover from "./common/account-popover";
import LanguagePopover from "./common/language-popover";

// ----------------------------------------------------------------------

export default function Header({ onOpenNav }) {
  const renderContent = (
    <>
      <IconButton onClick={onOpenNav} className="mobile-menu-btn">
        <Iconify icon="eva:menu-2-fill" />
      </IconButton>

      <div className="header-right">
        <div className="navbar-avtar">
          <LanguagePopover />
          <AccountPopover />
        </div>
      </div>
    </>
  );

  return (
    <div className="main-header">
      <div className="fixed-right">
        <div className="navbar p-0">{renderContent}</div>
      </div>
    </div>
  );
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
};
