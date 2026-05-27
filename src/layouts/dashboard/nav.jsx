/* eslint-disable */

import { useEffect } from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";

import { usePathname } from "src/routes/hooks";
import { RouterLink } from "src/routes/components";

import Logo from "src/components/logo";

import { NAV } from "./config-layout";
import navConfig from "./config-navigation";

// ----------------------------------------------------------------------

export default function Nav({ openNav, onCloseNav }) {
  const pathname = usePathname();

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderMenu = (
    <div className="sidebar-menu sidebar-scroll">
      <ul className="sidebar-menu-list">
        {navConfig.map((item) => (
          <li className="sb-nav-item" key={item.title}>
            <NavItem item={item} />
          </li>
        ))}
      </ul>
    </div>
  );

  const renderContent = (
    <div className="sidebar sidebar-menu-main">
      <div className="header-logo-wrap">
        <Logo className="logo img-fluid" sx={{ height: 32, width: "180px" }} />
      </div>

      {renderMenu}
    </div>
  );

  return <aside className="main-sidebar">{renderContent}</aside>;
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

// ----------------------------------------------------------------------
// Sidebar Menu List Items
// ----------------------------------------------------------------------

function NavItem({ item }) {
  const pathname = usePathname();

  const active = item.path === pathname;

  return (
    <ListItemButton
      component={RouterLink}
      href={item.path}
      className={`sb-nav-link ${active ? "active" : ""}`}
    >
      <Box component="span" className="admin-icon-wrap">
        {item.icon}
      </Box>

      <span className="site-menu-title">{item.title}</span>
    </ListItemButton>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
};
