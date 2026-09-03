/* eslint-disable */

import { useEffect } from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";

import { usePathname } from "src/routes/hooks";
import { RouterLink } from "src/routes/components";

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
    <div className="sidebar-menu">
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
    <div className="sidebar sidebar-menu-main">{renderMenu}</div>
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

  const active =
    item.path === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.path);

  const handleNavClick = () => {
    if (window.innerWidth < 992) {
      document.body.classList.remove("sidebar-show-hide");
    }
  };

  return (
    <ListItemButton
      component={RouterLink}
      href={item.path}
      onClick={handleNavClick}
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
