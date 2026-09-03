/*eslint-disable */
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";

import Iconify from "src/components/iconify";
import Logo from "src/components/logo";
// import Favicon from "/public/favicon/favicon-32x32.png";
// import Searchbar from './common/searchbar';
import AccountPopover from "./common/account-popover";
import LanguagePopover from "./common/language-popover";
import { useNavigate } from "react-router-dom";
// ----------------------------------------------------------------------

export default function Header({ onOpenNav }) {
  const navigate = useNavigate()
  // Menu toogle - open/close sidebar
  const handleSidebarToggle = () => {
    document.body.classList.toggle("sidebar-show-hide");

    if (onOpenNav) {
      onOpenNav();
    }
  };

  const handleLogoClick = () => {
    navigate("/dashboard")
  }
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
      <div className="headera-logo-wrap sidebar-top-toggle">
        <div className="headera-mlogo" onClick={handleLogoClick}>
          <svg
            width="30"
            height="30"
            viewBox="0 4.8 32 29.4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M25.3333 10.1666H22.5333C22.2239 8.6618 21.4051 7.30971 20.215 6.33821C19.0249 5.36671 17.5363 4.83519 16 4.83325H6.66667C4.89921 4.83537 3.20474 5.53843 1.95496 6.78821C0.705176 8.038 0.00211714 9.73246 0 11.4999L0 23.4999C0.00335174 24.6941 0.407384 25.8526 1.14738 26.7899C1.88738 27.7271 2.92052 28.3889 4.08133 28.6693C3.95568 29.3365 3.97716 30.0232 4.14425 30.6813C4.31135 31.3394 4.62005 31.9531 5.0488 32.4796C5.47755 33.0061 6.01602 33.4327 6.62665 33.7296C7.23728 34.0266 7.90534 34.1867 8.58423 34.1988C9.26311 34.2109 9.93646 34.0747 10.5573 33.7997C11.1781 33.5247 11.7314 33.1176 12.1787 32.6067C12.6259 32.0958 12.9563 31.4935 13.1467 30.8418C13.3372 30.19 13.3831 29.5046 13.2813 28.8333H18.724C18.6897 29.0539 18.6714 29.2767 18.6693 29.4999C18.6693 30.7376 19.161 31.9246 20.0362 32.7998C20.9113 33.6749 22.0983 34.1666 23.336 34.1666C24.5737 34.1666 25.7607 33.6749 26.6358 32.7998C27.511 31.9246 28.0027 30.7376 28.0027 29.4999C28.0012 29.2211 27.9739 28.9431 27.9213 28.6693C29.0816 28.3884 30.1142 27.7264 30.8537 26.7892C31.5931 25.852 31.9968 24.6937 32 23.4999V16.8333C31.9979 15.0658 31.2948 13.3713 30.045 12.1215C28.7953 10.8718 27.1008 10.1687 25.3333 10.1666ZM29.3333 16.8333V18.1666H22.6667V12.8333H25.3333C26.3942 12.8333 27.4116 13.2547 28.1618 14.0048C28.9119 14.755 29.3333 15.7724 29.3333 16.8333ZM2.66667 23.4999V11.4999C2.66667 10.4391 3.08809 9.42164 3.83824 8.67149C4.58839 7.92135 5.6058 7.49992 6.66667 7.49992H16C17.0609 7.49992 18.0783 7.92135 18.8284 8.67149C19.5786 9.42164 20 10.4391 20 11.4999V26.1666H5.33333C4.62609 26.1666 3.94781 25.8856 3.44772 25.3855C2.94762 24.8854 2.66667 24.2072 2.66667 23.4999ZM10.6667 29.4999C10.6667 30.0304 10.456 30.5391 10.0809 30.9141C9.70581 31.2892 9.1971 31.4999 8.66667 31.4999C8.13623 31.4999 7.62753 31.2892 7.25245 30.9141C6.87738 30.5391 6.66667 30.0304 6.66667 29.4999C6.66749 29.272 6.70949 29.0462 6.79067 28.8333H10.5427C10.6238 29.0462 10.6658 29.272 10.6667 29.4999ZM23.3333 31.4999C22.8029 31.4999 22.2942 31.2892 21.9191 30.9141C21.544 30.5391 21.3333 30.0304 21.3333 29.4999C21.3339 29.272 21.3759 29.0461 21.4573 28.8333H25.2093C25.2907 29.0461 25.3328 29.272 25.3333 29.4999C25.3333 30.0304 25.1226 30.5391 24.7475 30.9141C24.3725 31.2892 23.8638 31.4999 23.3333 31.4999ZM26.6667 26.1666H22.6667V20.8333H29.3333V23.4999C29.3333 24.2072 29.0524 24.8854 28.5523 25.3855C28.0522 25.8856 27.3739 26.1666 26.6667 26.1666Z"
              fill="#D74315"
            />
          </svg>
          {/* <img src={Favicon} alt="icon" className="header-favicon" /> */}
        </div>

        <div className="headera-logo" onClick={handleLogoClick}>
          <Logo className="logo" />
        </div>

        <IconButton
          onClick={handleSidebarToggle}
          className="sidebar-icon sidebar-toggle"
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
