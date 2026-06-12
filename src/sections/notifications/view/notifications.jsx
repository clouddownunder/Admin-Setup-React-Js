/* eslint-disable */

import { useState, useEffect } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import { useNavigate } from "react-router-dom";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import Button from "@mui/material/Button";
import { MenuItem, Select, FormControl, InputLabel, Box } from "@mui/material";
import TableNoData from "../table-no-data";
import FaqTableRow from "../notifications-table-row";
import FaqTableHead from "../notifications-table-head";
import TableEmptyRows from "../table-empty-rows";
import FaqTableToolbar from "../notifications-table-toolbar";
import { emptyRows, applyFilter } from "../utils";
import dayjs from "dayjs";
import NotificationDialog from "../../notificationView/NotificationDialog";
import { Skeleton, TableRow, TableCell } from "@mui/material";

// ----------------------------------------------------------------------

export default function NotificationsManagement() {
  const Navigate = useNavigate();
  const [faqDialogOpen, setFaqDialogOpen] = useState(false);

  const [page, setPage] = useState(
    () => Number(localStorage.getItem("notificationsbackPage")) || 0,
  );
  const [rowsPerPage, setRowsPerPage] = useState(
    () => Number(localStorage.getItem("notificationsRowsPerPage")) || 5,
  );
  const [filterType, setFilterType] = useState(
    () => localStorage.getItem("notificationsFilterType") || "all",
  );
  const [filterName, setFilterName] = useState(
    () => localStorage.getItem("notificationsSearchText") || "",
  );
  const [order, setOrder] = useState("desc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const token = localStorage.getItem("token");
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setUsers([]);

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASEURL}/auth/getAllNotifications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = response.data.message || []; // <-- fix here

      setUsers(Array.isArray(data) ? data : []);
      setPage(0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const TableSkeletonRows = ({ rows = 5 }) => {
    return [...Array(rows)].map((_, index) => (
      <TableRow key={index}>
        {[1, 2, 3].map((cell) => (
          <TableCell key={cell}>
            <Skeleton animation="wave" height={22} />
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  useEffect(() => {
    localStorage.setItem("notificationsbackPage", page);
    localStorage.setItem("notificationsRowsPerPage", rowsPerPage);
    localStorage.setItem("notificationsFilterType", filterType);
    localStorage.setItem("notificationsSearchText", filterName);
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
  //   const handleExportUsersCSV = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${import.meta.env.VITE_API_BASEURL}/user/export/csv`,
  //         {
  //           headers: { Authorization: `${token}` },
  //           responseType: "blob",
  //         }
  //       );

  //       const dateStr = getCurrentDateString();
  //       const filename = `Users-${dateStr}.csv`;
  //       const blob = new Blob([response.data], { type: "text/csv" });
  //       const url = window.URL.createObjectURL(blob);
  //       const link = document.createElement("a");
  //       link.href = url;
  //       link.setAttribute("download", filename);
  //       document.body.appendChild(link);
  //       link.click();
  //       link.remove();
  //     } catch (error) {
  //       console.error("CSV export failed", error);
  //     }
  //   };
  const handleViewUser = (userId) => {
    Navigate(`/dashboard/view/${userId}`);
  };

  const dataFiltered = applyFilter({
    inputData: users,
    // comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length;

  let queryText = "";

  if (filterName) queryText = filterName;
  else if (filterType === "all") queryText = "Notifications";
  //   else if (filterType === "new") queryText = "New Users";
  //   else if (filterType === "reviewed") queryText = "Reviewed Users";
  //   else if (filterType === "closed") queryText = "Closed Users";
  else queryText = "Notifications";

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
        <h1 className="page-title mb-0">Send Notification</h1>
        <button
          className="btn btn-primary"
          onClick={() => setFaqDialogOpen(true)}
        >
          Send Notification
        </button>
      </div>
      <div className="page-content notification-page cm-page-panel pt-3">
        <div className="panel">
          <div className="panel-heading">
            <h3 className="panel-title">All Notifications</h3>
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
                    rowsPerPageOptions={[5, 10]}
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
                  <FaqTableToolbar
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
                <FaqTableHead
                  // order={order}
                  // orderBy={orderBy}
                  rowCount={users.length}
                  numSelected={selected.length}
                  // onRequestSort={handleSort}
                  onSelectAllClick={handleSelectAllClick}
                  headLabel={[
                    { id: "fullName", label: "Send To" },
                    {
                      id: "notificationType",
                      label: "Notification Type",
                    },
                    { id: "text", label: "Notification Text" },
                    // { id: "createdAt", label: "Added On" },
                    // { id: "status", label: "Status" },
                    // { id: "suspended", label: "Suspend" },
                    // { id: "feedback", label: "Feedback" },
                  ]}
                />
                <TableBody>
                  {loading && <TableSkeletonRows rows={rowsPerPage} />}

                  {!loading &&
                    dataFiltered
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage,
                      )
                      .map((row) => (
                        <FaqTableRow
                          key={row.id}
                          name={
                            row?.userId?.firstName + " " + row?.userId?.lastName
                          }
                          notificationType={row?.notificationType}
                          text={row?.text}
                          fullName={row?.user?.fullName}
                          email={row?.user?.email}
                          status={row?.status}
                          countryCode={row?.user?.countryCode}
                          mobile={row?.user?.phone}
                          feedback={row?.feedback}
                          addedOn={row?.date}
                          userId={row._id}
                          avatarUrl={row?.user?.profilePicture}
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
                      height={77}
                      emptyRows={emptyRows(
                        page,
                        rowsPerPage,
                        dataFiltered.length,
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

            {faqDialogOpen && (
              <>
                <NotificationDialog
                  open={faqDialogOpen}
                  onClose={() => setFaqDialogOpen(false)}
                  onSuccess={() => {
                    setFaqDialogOpen(false);
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
