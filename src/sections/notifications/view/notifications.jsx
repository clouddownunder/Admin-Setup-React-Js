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
import Swal from "sweetalert2";

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
  const [selectedRows, setSelectedRows] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [totalNotifications, setTotalNotifications] = useState(0);

  const token = localStorage.getItem("token");
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASEURL}/auth/getAllNotifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: page + 1,
            limit: rowsPerPage,
            search: filterName,
          },
        },
      );

      const payload = response.data.message;

      setUsers(payload?.data || []);
      setTotalNotifications(payload?.total || 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setUsers([]);
      setTotalNotifications(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem("notificationsbackPage", page);
    localStorage.setItem("notificationsRowsPerPage", rowsPerPage);
    localStorage.setItem("notificationsFilterType", filterType);
    localStorage.setItem("notificationsSearchText", filterName);
  }, [page, rowsPerPage, filterType, filterName]);

  useEffect(() => {
    fetchUsers();
  }, [token, page, rowsPerPage, filterName]);

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
  const handleSelectAllClickBox = (event) => {
    if (event.target.checked) {
      console.log("checked", users);
      const allIds = users.map((row) => row.id);
      console.log("allIds", allIds);

      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
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
    Navigate(`/view/${userId}`);
  };

  const dataFiltered = users;

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

  const handleDeselectAll = () => {
    setSelectedRows([]);
  };
  const handleDeleteSelected = async () => {
    console.log("Selected IDs:", selectedRows);

    // Call your delete API here

    // Example:
    // await axios.post(
    //   `${import.meta.env.VITE_API_BASEURL}/auth/deleteNotifications`,
    //   { ids: selectedRows },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }
    // );

    fetchUsers();
    // setSelectedRows([]);
  };

  const handleDeleteConfirmation = async (userId, userName) => {
    const result = await Swal.fire({
      title: "Confirm Delete",
      html: `Are you sure you want to delete <strong>${userName}</strong>?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "No",
      reverseButtons: true,
      customClass: {
        container: "logout-swal-container", // parent wrapper
        popup: "logout-swal-popup", // main modal
        title: "logout-swal-title",
        htmlContainer: "logout-swal-text",
        icon: "logout-swal-icon",
        confirmButton: "logout-swal-confirm btn btn-primary",
        cancelButton: "logout-swal-cancel btn btn-lighter-grey",
      },
    });

    // if (result.isConfirmed) {
    //   handleDeleteUserConfirm(userId);
    // }
  };
  // const handleCloseMenu = () => {
  //   setOpen(null);
  // };
  return (
    <>
      <div className="page-header">
        <h1 className="page-title mb-0">Notifications</h1>
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
            <div className="d-flex align-items-center">
              {selectedRows.length > 0 && (
                <>
                  <button
                    type="button"
                    className="btn btn-danger delete-selected-notifications"
                    onClick={() => {
                      // handleCloseMenu();
                      handleDeleteConfirmation();
                    }}
                  >
                    Delete Notifications
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary deselect-all-notifications ms-2"
                    onClick={handleDeselectAll}
                  >
                    Deselect All
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="panel-body parent-table">
            <div className="row customrow mb-3 gy-2">
              <div className="col1">
                <div className="show-page-row">
                  <TablePagination
                    className="custom-pagination remove-buttons"
                    page={page}
                    component="div"
                    count={totalNotifications}
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
                    {
                      id: "select",
                      label: (
                        <input
                          type="checkbox"
                          id="select-all-notifications"
                          className="form-check-input ms-2 me-3"
                          checked={
                            users.length > 0 &&
                            selectedRows.length === users.length
                          }
                          onChange={handleSelectAllClickBox}
                        />
                      ),
                      className: "checkbox-col",
                    },
                    {
                      id: "notificationType",
                      label: "Notification Type",
                    },
                    { id: "text", label: "Message" },
                    { id: "fullName", label: "Send To" },
                    // { id: "createdAt", label: "Added On" },
                    // { id: "status", label: "Status" },
                    // { id: "suspended", label: "Suspend" },
                    {
                      id: "date",
                      label: "Sent On",
                    },
                    { id: "action", label: "Actions" },
                  ]}
                />
                <TableBody>
                  {loading && (
                    <div className="custom-loader">
                      <div className="loader"></div>
                    </div>
                  )}

                  {!loading &&
                    dataFiltered.map((row) => (
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
                        date={row.date}
                        onViewUser={() => handleViewUser(row._id)}
                        onUserDeleted={() => fetchUsers()}
                        onSuspendedUser={() => fetchUsers()}
                        onUserStatusUpdated={() => fetchUsers()}
                        isChecked={selectedRows.includes(row.id)}
                        onCheckboxChange={(checked) => {
                          if (checked) {
                            setSelectedRows((prev) => [...prev, row.id]);
                          } else {
                            setSelectedRows((prev) =>
                              prev.filter((id) => id !== row.id),
                            );
                          }
                        }}
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
              count={totalNotifications}
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

            <NotificationDialog
              open={faqDialogOpen}
              onClose={() => setFaqDialogOpen(false)}
              onSuccess={() => {
                fetchUsers();
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
