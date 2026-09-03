/* eslint-disable */

import { useState, useEffect } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
// import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import { MenuItem, Select, FormControl, InputLabel, Box } from "@mui/material";
import TableNoData from "../table-no-data";
import CallTableRow from "../call-table-row";
import CallTableHead from "../call-table-head";
import TableEmptyRows from "../table-empty-rows";
import CallTableToolbar from "../call-table-toolbar";
import { emptyRows, applyFilter, getComparator } from "../utils";

// ----------------------------------------------------------------------

export default function CallLogsPage() {
  // const Navigate = useNavigate();
  const [page, setPage] = useState(
    () => Number(localStorage.getItem("callLogsPage")) || 0
  );
  const [rowsPerPage, setRowsPerPage] = useState(
    () => Number(localStorage.getItem("callLogsRowsPerPage")) || 5
  );
  const [filterType, setFilterType] = useState(
    () => localStorage.getItem("callLogsFilterType") || "all"
  );
  const [filterName, setFilterName] = useState(
    () => localStorage.getItem("callLogsSearchText") || ""
  );
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const fetchUsers = async () => {
    try {
      const params = {};
      if (filterType !== "") params.filter = filterType;

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASEURL}/admin/user/getAllCallLogs`,
        {
          headers: { Authorization: `${token}` },
          params,
        }
      );

      const formatted = response.data.data.map((row) => ({
        id: row._id,
        name: `${row.client.first_name || ""} ${row.client.last_name || ""}`,
        email: row.client.email || "",
        mobile: row.client.mobile || "",
        country_code: row.client.country_code || "",
        avatar: row.client.profile_pic || "",
        call_type: row.is_single_call,
        platform: row.platform,
        date: row.date,
        call_duration: row.call_duration,
        call_cost: row.call_cost,
        pdf_url: row.pdf_url,

        // extra fields
        office_rate: row.client.office_rate,
        outside_office_rate: row.client.outside_office_rate,
        client: row.client,
      }));

      setUsers(formatted);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    localStorage.setItem("callLogsPage", page);
    localStorage.setItem("callLogsRowsPerPage", rowsPerPage);
    localStorage.setItem("callLogsFilterType", filterType);
    localStorage.setItem("callLogsSearchText", filterName);
  }, [page, rowsPerPage, filterType, filterName]);

  useEffect(() => {
    fetchUsers();
  }, [token, filterType]);

  const handleSort = (event, id) => {
    const sortableFields = ["name", "email", "mobile"];
    if (!sortableFields.includes(id)) return;

    const isAsc = orderBy === id && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(id);
  };

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
  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length;

  let queryText = "";

  if (filterName) queryText = filterName;
  else if (filterType === "1") queryText = "Single Call";
  else if (filterType === "2") queryText = "Team Call";
  else queryText = "Call Logs";
  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={4}
      >
        <Typography variant="h4">Calls & Invoices</Typography>
        {/* <Button
          variant="contained"
          startIcon={<Icon icon="mdi:download" />}
          onClick={handleExportCSV}
        >
          Export CSV
        </Button> */}
      </Stack>

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
          <CallTableToolbar
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
              <MenuItem value="1">Single Call</MenuItem>
              <MenuItem value="2">Team Call</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* <Scrollbar> */}
        <TableContainer sx={{ px: 2 }}>
          <Table
            sx={{
              minWidth: 800,
              borderCollapse: "separate",
              // borderSpacing: "0 10px", // space between rows
            }}
          >
            <CallTableHead
              order={order}
              orderBy={orderBy}
              rowCount={users.length}
              numSelected={selected.length}
              onRequestSort={handleSort}
              onSelectAllClick={handleSelectAllClick}
              headLabel={[
                { id: "name", label: "Client Name" },
                { id: "email", label: "Email" },
                { id: "mobile", label: "Mobile" },
                { id: "is_single_call", label: "Call Type" },
                { id: "platform", label: "Platform" },
                { id: "date", label: "Date" },
                { id: "call_duration", label: "Call Duration" },
                // { id: "call_cost", label: "Call Cost" },
                // { id: "office_rate", label: "O. R." },
                // { id: "outside_office_rate", label: "O. O. R." },
                { id: "pdf_url", label: "Invoice" },
              ]}
            />
            <TableBody>
              {dataFiltered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <CallTableRow
                    key={row.id}
                    name={row.name}
                    email={row.email}
                    mobile={row.mobile}
                    countryCode={row.country_code}
                    avatarUrl={row.avatar}
                    callType={row.call_type}
                    platform={row.platform}
                    date={row.date}
                    callDuration={row.call_duration}
                    // callCost={row.call_cost}
                    // officeRate={row.office_rate}
                    // outsideOfficeRate={row.outside_office_rate}
                    pdfUrl={row.pdf_url}
                    userId={row.id}
                  />
                ))}

              <TableEmptyRows
                height={77}
                emptyRows={emptyRows(page, rowsPerPage, dataFiltered.length)}
              />

              {notFound && <TableNoData query={queryText} />}
            </TableBody>
          </Table>
        </TableContainer>
        {/* </Scrollbar> */}

        <TablePagination
          page={page}
          component="div"
          count={dataFiltered.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
