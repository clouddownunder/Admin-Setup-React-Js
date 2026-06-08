import PropTypes from "prop-types";

import Tooltip from "@mui/material/Tooltip";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import Iconify from "src/components/iconify";

// ----------------------------------------------------------------------

export default function FeedbackTableToolbar({
  numSelected,
  filterName,
  onFilterName,
}) {
  return (
    <Toolbar className="dt-search">
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <div className="search-field input-field position-relative w-100">
          <span className="search-icon">
            <Iconify icon="eva:search-fill" width={18} height={18} />
          </span>

          <input
            type="text"
            className="form-control border"
            placeholder="Search here..."
            value={filterName}
            onChange={onFilterName}
          />
        </div>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <span className="d-inline-block" />
        </Tooltip>
      )}
    </Toolbar>
  );
}

FeedbackTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};
