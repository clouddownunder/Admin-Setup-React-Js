/* eslint-disable */

import { useState, useEffect } from "react";
import axios from "axios";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Skeleton, TableRow, TableCell } from "@mui/material";

import { Icon } from "@iconify/react";

import TableNoData from "../table-no-data";
import UserTableHead from "../operator-table-head";
import TableEmptyRows from "../table-empty-rows";
import UserTableToolbar from "../operator-table-toolbar";
import { emptyRows, applyFilter } from "../utils";

import AddUserDialog from "../../userView/add-user";
import OperatorCompanyRow from "../operator-table-row";

export default function ConstructionView() {
    const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);

    const [page, setPage] = useState(
        () => Number(localStorage.getItem("operatorPage")) || 0
    );

    const [rowsPerPage, setRowsPerPage] = useState(25);

    const [filterName, setFilterName] = useState("");

    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(true);
    const [companies, setCompanies] = useState([]);
    const [totalCompanies, setTotalCompanies] = useState(0);
    const token = localStorage.getItem("token");

    const fetchConstructionAdmins = async () => {
        setLoading(true);

        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASEURL}/auth/getAllUsers`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        filter: "truck_operator_admin",
                        page: page + 1,
                        limit: rowsPerPage,
                        search: filterName,
                    },
                }
            );


            const payload = response?.data?.data;


            setCompanies(
                (payload?.data || []).map((company) => ({
                    ...company,
                    name: company.fullName || "",
                }))
            );


            setTotalCompanies(payload?.total || 0);


        } catch (error) {
            console.error(
                "Error fetching truck operators:",
                error
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        localStorage.setItem("operatorPage", page);
    }, [page]);

    useEffect(() => {
        fetchConstructionAdmins();
    }, [
        page,
        rowsPerPage,
        filterName
    ]);

    const TableSkeletonRows = ({ rows = 5 }) =>
        [...Array(rows)].map((_, index) => (
            <TableRow key={index}>
                {[1, 2, 3, 4, 5, 6, 7].map((cell) => (
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

    const dataFiltered = companies;

    const handleCompanyUpdated = (updatedId, newIsBlocked) => {
        setCompanies((prev) =>
            prev.map((c) =>
                String(c._id) === String(updatedId)
                    ? { ...c, isBlocked: newIsBlocked ? "Blocked" : "Unblocked" }
                    : c
            )
        );
    };
    const notFound = !dataFiltered.length;
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
                className="page-header"
                style={{
                    direction: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 4,
                }}>
                <h1 className="page-title mb-0">
                    Truck Operator Companies
                </h1>

                <button
                    variant="contained"
                    onClick={() => setAddUserDialogOpen(true)}
                    className="btn btn-primary"
                >
                    Add Truck Operator Company
                </button>
            </div>

            <AddUserDialog
                open={addUserDialogOpen}
                onClose={() => setAddUserDialogOpen(false)}
                onSuccess={fetchConstructionAdmins}
                fixedRole="truck_operator_admin"  // ✅ pass this
            />

            <div className="page-content notification-page cm-page-panel pt-3">
                <Card sx={{ p: 0 }} className="panel">
                    <div className="panel-heading">
                        <h3 className="panel-title">All Truck Operator Companies</h3>
                    </div>
                    <Box className="panel-body parent-table">
                        {/* Top row: rows-per-page + search */}
                        <div className="row customrow mb-3 gy-2" style={{ padding: "0 16px", paddingTop: "16px" }}>
                            <div className="col1">
                                <div className="show-page-row">
                                    <TablePagination
                                        className="custom-pagination remove-buttons"
                                        page={page}
                                        component="div"
                                        count={totalCompanies}
                                        rowsPerPage={rowsPerPage}
                                        onPageChange={handleChangePage}
                                        rowsPerPageOptions={[10, 25, 50, 100]}
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

                        <TableContainer className="table">
                            <Table sx={{ minWidth: 800 }}>
                                <UserTableHead
                                    rowCount={companies.length}
                                    numSelected={selected.length}
                                    onSelectAllClick={handleSelectAllClick}
                                    headLabel={[
                                        { id: "name", label: "Name" },
                                        { id: "email", label: "Email" },
                                        { id: "mobile", label: "Mobile" },
                                        { id: "createdAt", label: "Created Date" },
                                        { id: "profileSetup", label: "Profile Setup" },
                                        { id: "status", label: "Block Status" },
                                        { id: "actions", label: "Actions" },
                                    ]}
                                />

                                <TableBody>
                                    {loading && <TableSkeletonRows rows={rowsPerPage} />}

                                    {!loading &&
                                        dataFiltered.map((row) => (
                                            <OperatorCompanyRow
                                                key={row._id}
                                                name={row.fullName}
                                                email={row.email}
                                                mobile={row.mobile}
                                                profileImage={row.profileImage}
                                                isProfileSetUp={row.isProfileSetUp}
                                                createdBy={row?.createdBy?.fullName}
                                                isBlocked={row.isBlocked === "Blocked"}
                                                createdAt={row?.createdAt}
                                                userId={row._id}
                                                company={row}
                                                onCompanyDeleted={fetchConstructionAdmins}
                                                onCompanyUpdated={handleCompanyUpdated}
                                            />
                                        ))}

                                    {!loading && notFound && (
                                        <TableNoData query={filterName || "Truck Operator Admin"} />
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Bottom pagination — buttons only */}
                        <TablePagination
                            className="custom-pagination pagination-buttons"
                            component="div"
                            count={totalCompanies}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[]}
                            labelRowsPerPage=""
                            labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
                        />
                    </Box>
                </Card>
            </div>
        </div >
    );
}