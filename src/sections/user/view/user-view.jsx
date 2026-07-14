/* eslint-disable */

import { useState, useEffect } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import { useNavigate } from "react-router-dom";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Card,
} from "@mui/material";
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

export default function ConstructionView() {
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [page, setPage] = useState(
    () => Number(localStorage.getItem("constructionPage")) || 0,
  );

  const [rowsPerPage, setRowsPerPage] = useState(
    () => Number(localStorage.getItem("constructionRowsPerPage")) || 5,
  );

  const [filterName, setFilterName] = useState(
    () => localStorage.getItem("constructionSearchText") || "",
  );

  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  const fetchConstructionAdmins = async () => {
    setLoading(true);
    setUsers([]);
      try {
        const params = {};

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASEURL}/auth/getAllUsers`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params,
          },
        );
        setUsers(
          response.data.data.data.map((user) => ({
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

  useEffect(() => {
    localStorage.setItem("constructionPage", page);
    localStorage.setItem("constructionRowsPerPage", rowsPerPage);
    localStorage.setItem("constructionSearchText", filterName);
  }, [page, rowsPerPage, filterName]);

  useEffect(() => {
    fetchConstructionAdmins();
  }, [page, rowsPerPage, filterName]);


  // For Table Tabs
  const [activeTab, setActiveTab] = useState("all");
  const companyTabs = [
    { label: "All Companies", value: "all" },
    { label: "Active Companies", value: "active" },
    { label: "Inactive Companies", value: "inactive" },
  ];

  const TableSkeletonRows = ({ rows = 5 }) =>
    [...Array(rows)].map((_, index) => (
      <TableRow key={index}>
        {[1, 2, 3, 4, 5, 6].map((cell) => (
          <TableCell key={cell}>
            <Skeleton animation="wave" height={38} />
          </TableCell>
        ))}
      </TableRow>
    ));

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = companies.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }

    setSelected([]);
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
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
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        // mb={4}
        className="page-header"
      >
        <h1 className="page-title mb-0">Construction Companies</h1>

        <button
          variant="contained"
          // starticon={<Icon icon="mdi:plus" />}
          onClick={() => setAddUserDialogOpen(true)}
          className="btn btn-primary"
        >
          Add Construction Company
        </button>
      </div>

      <AddUserDialog
        open={addUserDialogOpen}
        onClose={() => setAddUserDialogOpen(false)}
        onSuccess={fetchConstructionAdmins}
        fixedRole="construction_admin"
      />
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
            {/* Top row: rows-per-page + search */}
            <div
              className="row customrow mb-3 gy-2 p-0"
              style={{ padding: "0 16px", paddingTop: "16px" }}
            >
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
                    labelRowsPerPage="Show:"
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
                  <span className="ms-2 customtext">entries</span>
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

            <TableContainer className="table">
              <Table>
                <UserTableHead
                  rowCount={users.length}
                  numSelected={selected.length}
                  onSelectAllClick={handleSelectAllClick}
                  headLabel={[
                    { id: "name", label: "Name" },
                    { id: "email", label: "Email" },
                    { id: "createdBy", label: "Created By" },
                    { id: "mobile", label: "Phone Number" },
                    { id: "profileSetup", label: "Profile Setup" },
                    { id: "createdAt", label: "Created Date" },
                    { id: "actions", label: "Actions" },
                  ]}
                />

                <TableBody>
                  {loading && (
                    <div className="custom-loader">
                      <div className="loader"></div>
                    </div>
                  )}

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

                  {!loading && notFound && (
                    <TableNoData query={filterName || "Construction Admin"} />
                  )}
                  {!loading && (
                    <TableEmptyRows
                      height={77}
                      emptyRows={emptyRows(
                        page,
                        rowsPerPage,
                        tabFilteredData.length,
                      )}
                    />
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Bottom pagination — buttons only, no rows-per-page */}
            <TablePagination
              className="custom-pagination pagination-buttons"
              component="div"
              count={tabFilteredData.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[]}
              labelRowsPerPage=""
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} of ${count}`
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
