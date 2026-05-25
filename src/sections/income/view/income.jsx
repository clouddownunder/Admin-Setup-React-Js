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
import CallTableRow from "../income-table-row";
import CallTableHead from "../income-table-head";
import TableEmptyRows from "../table-empty-rows";
import CallTableToolbar from "../income-table-toolbar";
import { emptyRows, applyFilter, getComparator } from "../utils";

// ----------------------------------------------------------------------

export default function IncomePage() {
  // const Navigate = useNavigate();
  const [page, setPage] = useState(
    () => Number(localStorage.getItem("incomePage")) || 0
  );
  const [rowsPerPage, setRowsPerPage] = useState(
    () => Number(localStorage.getItem("incomeRowsPerPage")) || 5
  );
  const [filterType, setFilterType] = useState(
    () => localStorage.getItem("incomeFilterType") || "all"
  );
  const [filterName, setFilterName] = useState(
    () => localStorage.getItem("incomeSearchText") || ""
  );
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("dateTime");
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const fetchUsers = async () => {
    try {
      const params = {};
      if (filterType !== "") params.filter = filterType;

      const response = await axios.get(
        `${
          import.meta.env.VITE_API_BASEURL
        }/admin/subscription/getSubscriptionHistory`,
        {
          headers: { Authorization: `${token}` },
          params,
        }
      );

      const formatted = response.data.data.map((row) => ({
        id: row._id,
        dateTime: row.dateTime,
        amount: row.amount,
        entry_type: row.entry_type,
        plan_id: row.plan_id,
        plan_amount: row.plan_id?.amount || 0,
      }));

      setUsers(formatted);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    localStorage.setItem("incomePage", page);
    localStorage.setItem("incomeRowsPerPage", rowsPerPage);
    localStorage.setItem("incomeFilterType", filterType);
    localStorage.setItem("incomeSearchText", filterName);
  }, [page, rowsPerPage, filterType, filterName]);

  useEffect(() => {
    fetchUsers();
  }, [token, filterType]);

  const handleSort = (event, id) => {
    const sortableFields = ["dateTime", "amount", "mobile"];
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
  else if (filterType === "Subscription") queryText = "Subscription";
  else if (filterType === "Commission") queryText = "Commission";
  else queryText = "Subscription & Commission";
  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={4}
      >
        <Typography variant="h4">Subscription & Commission</Typography>
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
              <MenuItem value="Subscription">Subscription</MenuItem>
              <MenuItem value="Commission">Commission</MenuItem>
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
                { id: "dateTime", label: "Date" },
                { id: "entry_type", label: "Type" },
                { id: "amount", label: "Rate($)" },
                // { id: "is_single_call", label: "Call Type" },
                // { id: "platform", label: "Platform" },
                // { id: "date", label: "Date" },
                // { id: "call_duration", label: "Call Duration" },
                // // { id: "call_cost", label: "Call Cost" },
                // // { id: "office_rate", label: "O. R." },
                // // { id: "outside_office_rate", label: "O. O. R." },
                // { id: "pdf_url", label: "Invoice" },
              ]}
            />
            <TableBody>
              {dataFiltered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <CallTableRow
                    key={row.id}
                    date={row.dateTime}
                    amount={row.amount}
                    type={row.entry_type}
                    // countryCode={row.country_code}
                    // avatarUrl={row.avatar}
                    // callType={row.call_type}
                    // platform={row.platform}
                    // callDuration={row.call_duration}
                    // // callCost={row.call_cost}
                    // // officeRate={row.office_rate}
                    // // outsideOfficeRate={row.outside_office_rate}
                    // pdfUrl={row.pdf_url}
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
          rowsPerPageOptions={[5, 10]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
