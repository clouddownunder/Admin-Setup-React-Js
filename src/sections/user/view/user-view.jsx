/* eslint-disable */

import { useState, useEffect } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import { useNavigate } from "react-router-dom";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import { Icon } from "@iconify/react";
import { MenuItem, Select, FormControl, InputLabel, Box } from "@mui/material";
import { Tabs, Tab } from "@mui/material";
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

  // For Table Tabs
  const [activeTab, setActiveTab] = useState("all");
  const companyTabs = [
    { label: "All Companies", value: "all" },
    { label: "Active Companies", value: "active" },
    { label: "Inactive Companies", value: "inactive" },
  ];

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
    Navigate(`/view/${userId}`);
  };

  const handleAddUser = () => {
    setOpen(true);
  };

  const dataFiltered = applyFilter({
    inputData: users,
    // comparator: getComparator(order, orderBy),
    filterName,
  });

  // const notFound = !dataFiltered.length;
  const tabFilteredData = dataFiltered.filter((item) => {
    switch (activeTab) {
      case "active":
        return item.status === true || item.status === 1;

      case "inactive":
        return item.status === false || item.status === 0;

      default:
        return true;
    }
  });
  const notFound = !tabFilteredData.length;

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

  // Select svg icon
  const CustomSelectIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      className="custom-select-arrow"
    >
      <path
        d="M19.061 7.854a1.5 1.5 0 0 0-2.122 0l-4.586 4.585a.5.5 0 0 1-.707 0L7.061 7.854a1.5 1.5 0 0 0-2.122 2.121l4.586 4.586a3.5 3.5 0 0 0 4.95 0l4.586-4.586a1.5 1.5 0 0 0 0-2.121Z"
        fill="currentColor"
      />
    </svg>
  );

  const CustomRedArrowIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      className="custom-select-arrow red"
    >
      <path
        d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
        fill="currentColor"
      ></path>
    </svg>
  );

  return (
    <>
      <div className="page-header">
        <h1 className="page-title mb-0">Company Management</h1>
        <button
          className="btn btn-primary"
          onClick={() => setAddUserDialogOpen(true)}
        >
          Add Company
        </button>
      </div>
      <div className="page-content notification-page cm-page-panel pt-3">
        <div className="panel">
          {/* <div className="panel-heading">
            <h3 className="panel-title">Company Management List</h3>
          </div> */}

          {/* Table Tabs */}
          <div className="table-tabs-wrap">
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => {
                setActiveTab(newValue);
                setPage(0);
              }}
              className="table-tabs company-table-tabs"
            >
              {companyTabs.map((tab) => (
                <Tab
                  key={tab.value}
                  label={tab.label}
                  value={tab.value}
                  className="tab-pane-btn"
                />
              ))}
            </Tabs>
          </div>

          <div className="panel-body parent-table">
            <div className="row customrow mb-3 gy-2">
              <div className="col1">
                <div className="show-page-row">
                  <TablePagination
                    className="custom-pagination remove-buttons"
                    page={page}
                    component="div"
                    count={dataFiltered.length}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    SelectProps={{
                      IconComponent: CustomRedArrowIcon,
                      MenuProps: {
                        PaperProps: {
                          className: "rows-per-page-menu",
                        },
                        MenuListProps: {
                          className: "rows-per-page-menu-list",
                        },
                      },
                    }}
                  />
                </div>
              </div>
              <div className="col1">
                <div className="rows-serach-wrap d-flex align-items-end justify-content-md-end">
                  <UserTableToolbar
                    numSelected={selected.length}
                    filterName={filterName}
                    onFilterName={handleFilterByName}
                  />
                </div>
              </div>
            </div>

            {/* <Scrollbar> */}
            <TableContainer className="table">
              <Table>
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
                    tabFilteredData
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage,
                      )
                      .map((row) => (
                        <UserTableRow
                          key={row._id}
                          name={
                            !row?.fullName ? "N/A" : `${row.fullName}`.trim()
                          }
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

                  {/* {!loading && (
                    <TableEmptyRows
                      height={0}
                      emptyRows={emptyRows(
                        page,
                        rowsPerPage,
                        tabFilteredData.length,
                      )}
                    />
                  )} */}
                </TableBody>
              </Table>
            </TableContainer>
            {/* </Scrollbar> */}

            <TablePagination
              className="custom-pagination pagination-buttons"
              component="div"
              count={tabFilteredData.length}
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

            {addUserDialogOpen && (
              <>
                <AddUserDialog
                  open={addUserDialogOpen}
                  onClose={() => setAddUserDialogOpen(false)}
                  onSuccess={() => {
                    setAddUserDialogOpen(false);
                    fetchUsers();
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
