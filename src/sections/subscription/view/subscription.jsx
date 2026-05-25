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
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Button,
  TextField,
} from "@mui/material";
import TableNoData from "../table-no-data";
import CallTableRow from "../subscription-table-row";
import CallTableHead from "../subscription-table-head";
import TableEmptyRows from "../table-empty-rows";
import CallTableToolbar from "../subscription-table-toolbar";
import { emptyRows, applyFilter, getComparator } from "../utils";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// ----------------------------------------------------------------------

export default function SubscriptionPage() {
  // const Navigate = useNavigate();
  const [page, setPage] = useState(
    () => Number(localStorage.getItem("subscriptionPage")) || 0,
  );
  const [rowsPerPage, setRowsPerPage] = useState(
    () => Number(localStorage.getItem("subscriptionRowsPerPage")) || 5,
  );
  const [filterType, setFilterType] = useState(
    () => localStorage.getItem("subscriptionFilterType") || "all",
  );
  const [filterName, setFilterName] = useState(
    () => localStorage.getItem("subscriptionSearchText") || "",
  );
  const [order, setOrder] = useState("desc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("dateTime");
  const [users, setUsers] = useState([]);
  const [planList, setPlanList] = useState([]);
  const [planId, setPlanId] = useState("");
  const [amount, setAmount] = useState("");
  const [commissionRate, setCommissionRate] = useState("");
  const token = localStorage.getItem("token");
  const MySwal = withReactContent(Swal);
  const fetchPlans = async () => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_API_BASEURL
        }/admin/subscription/getAllSubscriptionList`,
        { headers: { Authorization: token } },
      );
      setPlanList(res.data.data);
    } catch (err) {
      console.error("Error fetching plans", err);
    }
  };
  const fetchUsers = async () => {
    try {
      const params = {};
      if (filterType !== "") params.filter = filterType;

      const response = await axios.get(
        `${
          import.meta.env.VITE_API_BASEURL
        }/admin/subscription/getAllSubscriptionTrackerList`,
        {
          headers: { Authorization: `${token}` },
          params,
        },
      );

      const formatted = response.data.data.map((row) => ({
        id: row._id,
        dateTime: row.createdAt,
        field: row.field_name, // "amount" or "commission_rate"
        oldValue: row.old_value,
        newValue: row.new_value,
        planName: row.plan_id?.name || "",
        planAmount: row.plan_id?.amount || 0, // updated plan amount
      }));

      setUsers(formatted);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    localStorage.setItem("subscriptionPage", page);
    localStorage.setItem("subscriptionRowsPerPage", rowsPerPage);
    localStorage.setItem("subscriptionFilterType", filterType);
    localStorage.setItem("subscriptionSearchText", filterName);
  }, [page, rowsPerPage, filterType, filterName]);

  useEffect(() => {
    fetchUsers();
    fetchPlans();
  }, [token, filterType]);

  const handleSort = (event, id) => {
    const sortableFields = ["dateTime", "oldValue", "newValue"];

    if (!sortableFields.includes(id)) return;

    const isAsc = orderBy === id && order === "desc";
    setOrder(isAsc ? "asc" : "desc");
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

  const showSuccessPopup = (message) => {
    MySwal.fire({
      icon: "success",
      title: "Success",
      text: message,
      background: "#0F172A", // dark background
      color: "#FFFFFF",
      confirmButtonText: "OK",
      confirmButtonColor: "#D74315",
      didOpen: () => {
        document.querySelector(".swal2-container").style.zIndex = 9999;
      },
    });
  };

  const showErrorPopup = (message) => {
    MySwal.fire({
      icon: "error",
      title: "Error",
      text: message,
      background: "#0F172A", // dark background
      color: "#FFFFFF",
      confirmButtonText: "OK",
      confirmButtonColor: "#D74315",
      didOpen: () => {
        document.querySelector(".swal2-container").style.zIndex = 9999;
      },
    });
  };

  const notFound = !dataFiltered.length;

  let queryText = "";

  if (filterName) queryText = filterName;
  else if (filterType === "amount") queryText = "Subscription";
  else if (filterType === "commission_rate") queryText = "Commission";
  else queryText = "Subscriptions or Commissions";
  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={4}
      >
        <Typography variant="h4">Plans & Fees</Typography>
        {/* <Button
          variant="contained"
          startIcon={<Icon icon="mdi:download" />}
          onClick={handleExportCSV}
        >
          Export CSV
        </Button> */}
      </Stack>
      <Card sx={{ p: 3, boxShadow: 3, mb: 3, paddingLeft: "2.5rem" }}>
        <Typography variant="h6" mb={2}>
          Update Subscription Plan
        </Typography>

        <Box
          component="form"
          onSubmit={async (e) => {
            e.preventDefault();

            if (!planId) {
              showErrorPopup("Please select a subscription plan.");
              return;
            }

            if (!amount && !commissionRate) {
              showErrorPopup("Enter at least one field.");
              return;
            }

            try {
              const response = await axios.put(
                `${
                  import.meta.env.VITE_API_BASEURL
                }/admin/subscription/updateSubscription/${planId}`,
                {
                  amount: amount || undefined,
                  commission_rate: commissionRate || undefined,
                },
                { headers: { Authorization: token } },
              );

              if (response.data.status === 1) {
                showSuccessPopup("Subscription plan updated successfully.");
                setPlanId("");
                setAmount("");
                setCommissionRate("");
                fetchUsers();
                fetchPlans();
              } else {
                showErrorPopup(response.data.message);
              }
            } catch (err) {
              console.error(err);
              showErrorPopup(err.message);
            }
          }}
          sx={{ display: "flex", flexWrap: "wrap", gap: 3, mt: 2 }}
        >
          {/* Plan Dropdown */}
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Select Plan</InputLabel>
            <Select
              label="Select Plan"
              value={planId}
              onChange={(e) => setPlanId(e.target.value)}
              required
            >
              {planList
                .filter((p) => p.name === "Monthly" || p.name === "Yearly")
                .map((p) => (
                  <MenuItem key={p._id} value={p._id}>
                    {p.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          {/* Amount Input */}
          <Box>
            {/* <InputLabel>Subscription Amount</InputLabel> */}
            <TextField
              label="Subscription Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              sx={{ minWidth: 240 }}
              size="medium"
            />
          </Box>

          {/* Commission Input */}
          <Box>
            <TextField
              label="Commission (%)"
              type="number"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              placeholder="Enter commission"
              sx={{ minWidth: 240 }}
              size="medium"
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            sx={{
              height: "55px",
              paddingInline: 4,
              textTransform: "none",
              fontSize: "16px",
            }}
          >
            Update
          </Button>
        </Box>
      </Card>

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
              <MenuItem value="amount">Subscription</MenuItem>
              <MenuItem value="commission_rate">Commission</MenuItem>
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
                { id: "field", label: "Category Type" },
                { id: "planName", label: "Plan Type" },
                { id: "dateTime", label: "Updated On" },
                { id: "oldValue", label: "Old Value" },
                { id: "newValue", label: "New Value" },
              ]}
            />
            <TableBody>
              {dataFiltered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <CallTableRow
                    key={row.id}
                    date={row.dateTime}
                    oldValue={row.oldValue}
                    planName={row.planName}
                    newValue={row.newValue}
                    type={row.field}
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
