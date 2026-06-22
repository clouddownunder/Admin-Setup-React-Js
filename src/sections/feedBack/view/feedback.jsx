/* eslint-disable */

import { useState, useEffect } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import { useNavigate } from "react-router-dom";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import { MenuItem, Select } from "@mui/material";
import TableNoData from "../table-no-data";
import FeedbackTableRow from "../feedback-table-row";
import FeedbackTableHead from "../feedback-table-head";
import TableEmptyRows from "../table-empty-rows";
import FeedbackTableToolbar from "../feedback-table-toolbar";
import { emptyRows, applyFilter } from "../utils";
import dayjs from "dayjs";
import { Skeleton, TableRow, TableCell } from "@mui/material";

// ----------------------------------------------------------------------

export default function FeedbackPage() {
  const Navigate = useNavigate();
  const [page, setPage] = useState(
    () => Number(localStorage.getItem("feedbackPage")) || 0,
  );
  const [rowsPerPage, setRowsPerPage] = useState(
    () => Number(localStorage.getItem("feedbackRowsPerPage")) || 5,
  );
  const [filterType, setFilterType] = useState(
    () => localStorage.getItem("feedbackFilterType") || "all",
  );
  const [filterName, setFilterName] = useState(
    () => localStorage.getItem("feedbackSearchText") || "",
  );
  const [order, setOrder] = useState("desc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const [totalUsers, setTotalUsers] = useState(0);
  const fetchUsers = async () => {

    try {

      setLoading(true);


      const response = await axios.get(
        `${import.meta.env.VITE_API_BASEURL}/auth/getFeedback`,
        {

          headers: {
            Authorization: `Bearer ${token}`
          },


          params: {

            filter: filterType,

            page: page + 1,

            limit: rowsPerPage,

            search: filterName

          }

        }
      );


      setUsers(response.data.data.data);

      setTotalUsers(response.data.data.total);


    }
    catch (error) {

      console.log(error);

    }
    finally {

      setLoading(false);

    }

  };

  const TableSkeletonRows = ({ rows = 5 }) => {
    return [...Array(rows)].map((_, index) => (
      <TableRow key={index}>
        {[1, 2, 3, 4, 5, 6].map((cell) => (
          <TableCell key={cell}>
            <Skeleton animation="wave" height={26} />
          </TableCell>
        ))}
      </TableRow>
    ));
  };
  useEffect(() => {
    localStorage.setItem("feedbackPage", page);
    localStorage.setItem("feedbackRowsPerPage", rowsPerPage);
    localStorage.setItem("feedbackFilterType", filterType);
    localStorage.setItem("feedbackSearchText", filterName);
  }, [page, rowsPerPage, filterType, filterName]);

  useEffect(() => {

    fetchUsers();

  }, [
    page,
    rowsPerPage,
    filterType,
    filterName
  ]);
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
  // const handleExportUsersCSV = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${import.meta.env.VITE_API_BASEURL}/user/export/csv`,
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
  const handleViewUser = (userId) => {
    Navigate(`/view/${userId}`);
  };

  const dataFiltered = users;
  const notFound = !dataFiltered.length;

  let queryText = "";

  if (filterName) queryText = filterName;
  else if (filterType === "all") queryText = "Feedbacks";
  // else if (filterType === "construction_company_admin")
  //   queryText = "Construction Company Admin Feedbacks";
  // else if (filterType === "truck_operator_admin")
  //   queryText = "Truck Operator Admin Feedbacks";
  else if (filterType === "driver") queryText = "Driver Feedbacks";
  else if (filterType === "job_accepter") queryText = "Job Accepter Feedbacks";
  else if (filterType === "job_poster") queryText = "Job Poster Feedbacks";
  else queryText = "Feedbacks";

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
        <h1 className="page-title mb-0">Feedbacks</h1>
      </div>

      <div className="page-content feedback-page cm-page-panel pt-3">
        <div className="panel">
          <div className="panel-heading">
            <h3 className="panel-title">All Feedbacks</h3>
          </div>

          <div className="panel-body parent-table">
            <div className="row customrow mb-3">
              <div className="col1">
                <div className="show-page-row">
                  <TablePagination
                    className="custom-pagination remove-buttons"
                    page={page}
                    component="div"
                    count={totalUsers}
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
                  <div className="table-filter-wrap">
                    <label htmlFor="filter" className="mb-1 main-label">
                      Filter
                    </label>

                    <div className="input-field">
                      <Select
                        value={filterType}
                        // label="Filter"
                        IconComponent={CustomSelectIcon}
                        onChange={handleFilterChange}
                        className="table-filter"
                        inputProps={{
                          className: "form-control border",
                        }}
                        MenuProps={{
                          PaperProps: {
                            className: "filter-menu-list",
                          },
                          MenuListProps: {
                            className: "filter-menu-ul",
                          },
                        }}
                      >
                        <MenuItem value="all" className="filter-menu-item">
                          All
                        </MenuItem>
                        <MenuItem value="driver" className="filter-menu-item">
                          Driver
                        </MenuItem>
                        <MenuItem
                          value="job_accepter"
                          className="filter-menu-item"
                        >
                          Job Accepter
                        </MenuItem>
                        <MenuItem
                          value="job_poster"
                          className="filter-menu-item"
                        >
                          Job Poster
                        </MenuItem>
                      </Select>
                    </div>
                  </div>
                  <FeedbackTableToolbar
                    numSelected={selected.length}
                    filterName={filterName}
                    onFilterName={handleFilterByName}
                  />
                </div>
              </div>
            </div>

            {/* <Scrollbar> */}
            <div className="table-responsive">
              <TableContainer className="table">
                <Table>
                  <FeedbackTableHead
                    // order={order}
                    // orderBy={orderBy}
                    rowCount={users.length}
                    numSelected={selected.length}
                    // onRequestSort={handleSort}
                    onSelectAllClick={handleSelectAllClick}
                    headLabel={[
                      { id: "name", label: "Name" },
                      { id: "email", label: "Email" },
                      { id: "createdAt", label: "Added On" },
                      { id: "feedback", label: "Total Feedbacks" },
                      { id: "actions", label: "Actions" },
                    ]}
                  />
                  <TableBody>
                    {loading && <TableSkeletonRows rows={rowsPerPage} />}

                    {!loading &&
                      dataFiltered
                        .map((user) => (
                          <FeedbackTableRow
                            key={user.userId}
                            name={`${user.firstName} ${user.lastName}`}
                            email={user.email}
                            feedbackCount={user.totalFeedbacks}
                            addedOn={
                              user.feedbacks?.length
                                ? user.feedbacks[0].dateTime
                                : null
                            }
                            profilePicture={user.profilePicture}
                            userId={user.userId}
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
            </div>

            <TablePagination
              className="custom-pagination pagination-buttons"
              component="div"
              count={totalUsers}
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
          </div>
        </div>
      </div>

      {/* <Button
          variant="contained"
          startIcon={<Icon icon="mdi:download" />}
          onClick={handleExportUsersCSV}
        >
          Export Users
        </Button> */}
    </>
  );
}
