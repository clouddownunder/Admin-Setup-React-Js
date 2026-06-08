/* eslint-disable */

import { useState, useEffect } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import Button from "@mui/material/Button";
import { Icon } from "@iconify/react";
import { MenuItem, Select, FormControl, InputLabel, Box } from "@mui/material";
import Scrollbar from "src/components/scrollbar";
import TableNoData from "../table-no-data";
import UserTableRow from "../user-table-row";
import UserTableHead from "../user-table-head";
import TableEmptyRows from "../table-empty-rows";
import UserTableToolbar from "../user-table-toolbar";
import { emptyRows, applyFilter } from "../utils";
import dayjs from "dayjs";
import { Skeleton, TableRow, TableCell } from "@mui/material";
import AddUserDialog from "../../userView/add-user";

// ----------------------------------------------------------------------

export default function UserPage() {
  const Navigate = useNavigate();
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [page, setPage] = useState(
    () => Number(localStorage.getItem("userPage")) || 0,
  );
  const [rowsPerPage, setRowsPerPage] = useState(
    () => Number(localStorage.getItem("userRowsPerPage")) || 5,
  );
  const [filterType, setFilterType] = useState(
    () => localStorage.getItem("userFilterType") || "all",
  );
  const [filterName, setFilterName] = useState(
    () => localStorage.getItem("userSearchText") || "",
  );
  const [order, setOrder] = useState("desc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const fetchUsers = async () => {
    setLoading(true);
    setUsers([]);

    try {
      const params = {};

      if (filterType !== "all") {
        params.filter = filterType;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASEURL}/auth/getAllUsers`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params, // ✅ use the dynamic params object
        },
      );

      setUsers(
        response.data.data.map((user) => ({
          ...user,
          name: user.fullName || "",
        })),
      );
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };
  const TableSkeletonRows = ({ rows = 5 }) => {
    return [...Array(rows)].map((_, index) => (
      <TableRow key={index}>
        {[1, 2, 3, 4, 5, 6].map((cell) => (
          <TableCell key={cell}>
            <Skeleton animation="wave" height={38} />
          </TableCell>
        ))}
      </TableRow>
    ));
  };
  useEffect(() => {
    localStorage.setItem("userPage", page);
    localStorage.setItem("userRowsPerPage", rowsPerPage);
    localStorage.setItem("userFilterType", filterType);
    localStorage.setItem("userSearchText", filterName);
  }, [page, rowsPerPage, filterType, filterName]);

  useEffect(() => {
    fetchUsers();
  }, [token, filterType]);

  // const handleSort = (event, id) => {
  //   const sortableFields = ["name", "email", "mobile"];
  //   if (!sortableFields.includes(id)) return;

  //   const isAsc = orderBy === id && order === "asc";
  //   setOrder(isAsc ? "desc" : "asc");
  //   setOrderBy(id);
  // };

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilterType(value);
    setPage(0);
    // fetchUsers(value);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };
  // const getCurrentDateString = () => {
  //   const today = new Date();
  //   const yyyy = today.getFullYear();
  //   const mm = String(today.getMonth() + 1).padStart(2, "0");
  //   const dd = String(today.getDate()).padStart(2, "0");
  //   return `${yyyy}-${mm}-${dd}`;
  // };

  // const handleExportCSV = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${import.meta.env.VITE_API_BASEURL}/admin/user/exportCSV`,
  //       {
  //         headers: { Authorization: `${token}` },
  //         responseType: "blob",
  //       }
  //     );
  //     const dateStr = getCurrentDateString();
  //     const filename = `Users-${dateStr}.csv`;
  //     const blob = new Blob([response.data], { type: "text/csv" });
  //     const url = window.URL.createObjectURL(blob);
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", filename);
  //     document.body.appendChild(link);
  //     link.click();
  //     link.remove();
  //   } catch (error) {
  //     console.error("CSV export failed", error);
  //   }
  // };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };
  const getCurrentDateString = () => {
    return dayjs().format("DD-MMM-YYYY");
  };
  const handleExportUsersCSV = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASEURL}/user/export/csv`,
        {
          headers: { Authorization: `${token}` },
          responseType: "blob",
        },
      );

      const dateStr = getCurrentDateString();
      const filename = `Users-${dateStr}.csv`;
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("CSV export failed", error);
    }
  };
  const handleViewUser = (userId) => {
    Navigate(`/dashboard/view/${userId}`);
  };

  const handleAddUser = () => {
    setOpen(true);
  };

  const dataFiltered = applyFilter({
    inputData: users,
    // comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length;

  let queryText = "";

  if (filterName) queryText = filterName;
  else if (filterType === "construction_admin")
    queryText = "Construction Admin";
  else if (filterType === "truck_operator_admin")
    queryText = "Truck Operator Admin";
  else if (filterType === "job_poster") queryText = "Job Poster";
  else if (filterType === "job_accepter") queryText = "Job Accepter";
  else if (filterType === "driver") queryText = "Truck Driver";
  else queryText = "Users";

  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={4}
      >
        <Typography variant="h4">Company Management</Typography>
        <Button
          variant="contained"
          startIcon={<Icon icon="mdi:plus" />}
          onClick={() => setAddUserDialogOpen(true)}
        >
          Add Company
        </Button>
      </Stack>

      <AddUserDialog
        open={addUserDialogOpen}
        onClose={() => setAddUserDialogOpen(false)}
        onSuccess={fetchUsers}
      />

      <Card sx={{ p: 2, boxShadow: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingLeft: "24px",
            paddingRight: "24px",
          }}
        >
          <UserTableToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />
          <FormControl
            sx={{
              minWidth: 150,
            }}
          >
            <InputLabel shrink>Filter</InputLabel>
            <Select
              value={filterType}
              label="Filter"
              onChange={handleFilterChange}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="construction_admin">Construction Admin</MenuItem>
              <MenuItem value="truck_operator_admin">
                Truck Operator Admin
              </MenuItem>
              <MenuItem value="job_poster">Job Poster</MenuItem>
              <MenuItem value="job_accepter">Job Accepter</MenuItem>
              <MenuItem value="driver">Truck Driver</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* <Scrollbar> */}
        <TableContainer sx={{ px: 2 }}>
          <TablePagination
            className="custom-pagination1"
            page={page}
            component="div"
            count={dataFiltered.length}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <Table
            sx={{
              minWidth: 800,
              borderCollapse: "separate",
              // borderSpacing: "0 10px", // space between rows
            }}
          >
            <UserTableHead
              // order={order}
              // orderBy={orderBy}
              rowCount={users.length}
              numSelected={selected.length}
              // onRequestSort={handleSort}
              onSelectAllClick={handleSelectAllClick}
              headLabel={[
                { id: "name", label: "Name" },
                { id: "email", label: "Email" },
                { id: "createdBy", label: "Created By" },
                { id: "mobile", label: "Mobile" },
                { id: "userType", label: "User Type" },
                { id: "profileSetup", label: "Profile Setup" },
                // { id: "isActive", label: "Status" },
                // { id: "suspended", label: "Suspend" },
                // { id: "isBlocked", label: "Block" },
                { id: "actions", label: "Actions" },
              ]}
            />
            <TableBody>
              {loading && <TableSkeletonRows rows={rowsPerPage} />}

              {!loading &&
                dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row._id}
                      name={!row?.fullName ? "N/A" : `${row.fullName}`.trim()}
                      email={row?.email}
                      isActive={row?.status}
                      countryCode={row?.countryCode}
                      createdBy={row?.createdBy?.fullName}
                      profileSetup={row?.isProfileSetUp}
                      mobile={row?.mobile}
                      userId={row._id}
                      avatarUrl={row?.profileImage}
                      userType={row.userType}
                      suspended={row.suspended}
                      block={row.isBlocked}
                      handleClick={(event) => handleClick(event, row.name)}
                      onViewUser={() => handleViewUser(row._id)}
                      onUserDeleted={() => fetchUsers()}
                      onSuspendedUser={() => fetchUsers()}
                      onUserStatusUpdated={() => fetchUsers()}
                    />
                  ))}
              {!loading && notFound && <TableNoData query={queryText} />}

              {!loading && (
                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, dataFiltered.length)}
                />
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* </Scrollbar> */}

        <TablePagination
          className="custom-pagination2"
          component="div"
          count={dataFiltered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          // Hide rows per page dropdown
          rowsPerPageOptions={[]}
          labelRowsPerPage=""
          // Custom page text
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} of ${count}`
          }
        />
      </Card>
    </Container>
  );
}
