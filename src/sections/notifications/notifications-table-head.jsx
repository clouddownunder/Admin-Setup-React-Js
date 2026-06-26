import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import TableRow from "@mui/material/TableRow";
// import Checkbox from '@mui/material/Checkbox';
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";

import { visuallyHidden } from "./utils";

// ----------------------------------------------------------------------

export default function FaqTableHead({
  order,
  orderBy,
  headLabel,
  numSelected,
  onRequestSort,
  onSelectAllClick,
}) {
  const onSort = (property) => (event) => {
    if (typeof onRequestSort === "function") {
      onRequestSort(event, property);
    }
  };

  return (
    <TableHead>
      <TableRow>
        {headLabel.map((headCell, index) => (
          <TableCell
            className={index === 0 ? "checkbox-col" : ""}
            classes={{
              root: "dt-column-ordering",
            }}
            key={headCell.id}
            align={headCell.align || "left"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{
              width: headCell.width,
              minWidth: headCell.minWidth,
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            <TableSortLabel
              hideSortIcon
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={onSort(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box sx={{ ...visuallyHidden }}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

FaqTableHead.propTypes = {
  order: PropTypes.oneOf(["asc", "desc"]),
  orderBy: PropTypes.string,
  headLabel: PropTypes.array,
  numSelected: PropTypes.number,
  onRequestSort: PropTypes.func,
  onSelectAllClick: PropTypes.func,
};
