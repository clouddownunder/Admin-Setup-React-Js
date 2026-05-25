/* eslint-disable */
import { useEffect, useState } from "react";
import axios from "axios";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import AppWidgetSummary from "../app-widget-summary";
import {
  Button,
  Stack,
  MenuItem,
  TextField,
  Box,
  Card,
  Switch,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Icon } from "@iconify/react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
// import Chart, { useChart } from "../../../components/chart";
export default function AppView() {

  const [summary, setSummary] = useState({});
  const [filter, setFilter] = useState("total");
  const [startDate, setStartDate] = useState(dayjs().startOf(null));
  const [endDate, setEndDate] = useState(dayjs().endOf(null));
  const [customStartDate, setCustomStartDate] = useState(
    dayjs().startOf("day"),
  );
  const [customEndDate, setCustomEndDate] = useState(dayjs().endOf("day"));
  const [toDateEndDate, setToDateEndDate] = useState(dayjs());
  const token = localStorage.getItem("token");

  const BASE_URL = import.meta.env.VITE_API_BASEURL;

  const fetchFilteredSummary = async () => {
    try {
      const params = { filter };

      if (filter === "todate") {
        params.startDate = dayjs("2025-01-01T00:00:00Z").toISOString();
        params.endDate = toDateEndDate?.toISOString();
      } else if (filter === "custom") {
        params.startDate = customStartDate.toISOString();
        params.endDate = customEndDate.toISOString();
      } else if (filter !== "total") {
        params.startDate = startDate.toISOString();
        params.endDate = endDate.toISOString();
      }

      const res = await axios.get(`${BASE_URL}/auth/adminSummary`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      if (res.data.status === 1) {
        const data = res.data.data;

        setSummary({
          totalUsers: data?.companies?.total ?? 0,

          activeSubscriptions: data?.subscriptions?.active ?? 0,
          inactiveSubscriptions: data?.subscriptions?.inactive ?? 0,
          totalSubscriptions: data?.subscriptions?.total ?? 0,

          totalRevenue: data?.revenue?.total ?? 0,
        });
      }
    } catch (err) {
      console.error("Filtered summary error:", err);
    }
  };

  // 🔥 MOCK DATA (replace with API later)
  // const revenueSeries = [
  //   {
  //     name: "Subscription Revenue",
  //     data: [
  //       1200, 1800, 1600, 2200, 2600, 3100, 3600, 4000, 6000, 4200, 4800, 5300,
  //     ],
  //   },
  //   {
  //     name: "Miscellaneous Revenue",
  //     data: [300, 450, 400, 600, 750, 900, 1200, 1500, 1001, 1700, 2000, 2300],
  //   },
  // ];

  // const revenueChartOptions = useChart({
  //   chart: {
  //     type: "line",
  //     toolbar: { show: false },
  //   },
  //   stroke: {
  //     curve: "smooth",
  //     width: 3,
  //   },
  //   xaxis: {
  //     categories: [
  //       "Jan",
  //       "Feb",
  //       "Mar",
  //       "Apr",
  //       "May",
  //       "Jun",
  //       "Jul",
  //       "Aug",
  //       "Sep",
  //       "Oct",
  //       "Nov",
  //       "Dec",
  //     ],
  //   },
  //   markers: {
  //     size: 5,
  //     hover: { size: 7 },
  //   },
  //   tooltip: {
  //     shared: true,
  //     intersect: false,
  //     y: {
  //       formatter: (value) => `$ ${value.toLocaleString()}`,
  //     },
  //   },
  //   legend: {
  //     position: "top",
  //     horizontalAlign: "right",
  //   },
  // });

  // const getCurrentDateString = () => {
  //   return dayjs().format("DD-MMM-YYYY");
  // };

  // console.log(summary, "Filtered");
  // const handleExportUsersCSV = async () => {
  //   try {
  //     const params = { filter };

  //     if (filter === "todate") {
  //       params.startDate = dayjs("2025-01-01T00:00:00Z").toISOString();
  //       params.endDate = toDateEndDate?.toISOString();
  //     } else if (filter === "custom") {
  //       params.startDate = customStartDate.toISOString();
  //       params.endDate = customEndDate.toISOString();
  //     } else if (filter !== "total") {
  //       params.startDate = startDate?.toISOString();
  //       params.endDate = endDate?.toISOString();
  //     }

  //     const response = await axios.get(
  //       `${import.meta.env.VITE_API_BASEURL}/admin/user/exportCsv`,
  //       {
  //         headers: { Authorization: `${token}` },
  //         params,
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

  // const handleExportCallsCSV = async () => {
  //   try {
  //     const params = { filter };

  //     if (filter === "todate") {
  //       params.startDate = dayjs("2025-01-01T00:00:00Z").toISOString();
  //       params.endDate = toDateEndDate?.toISOString();
  //     } else if (filter === "custom") {
  //       params.startDate = customStartDate.toISOString();
  //       params.endDate = customEndDate.toISOString();
  //     } else if (filter !== "total") {
  //       params.startDate = startDate?.toISOString();
  //       params.endDate = endDate?.toISOString();
  //     }

  //     const response = await axios.get(
  //       `${import.meta.env.VITE_API_BASEURL}/admin/user/exportCallCsv`,
  //       {
  //         headers: { Authorization: `${token}` },
  //         params,
  //         responseType: "blob",
  //       }
  //     );

  //     const dateStr = getCurrentDateString();
  //     const filename = `Calls-${dateStr}.csv`;
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

  useEffect(() => {
    fetchFilteredSummary();
  }, [
    filter,
    startDate,
    endDate,
    customStartDate,
    customEndDate,
    toDateEndDate,
  ]);

  const filterOptions = [
    { value: "total", label: "Total" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "Last 3 Months" },
    { value: "year", label: "This Year" },
    { value: "todate", label: "To Date" },
    { value: "custom", label: "Custom" },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Dashboard
        </Typography>

        {/* ===== TOP FILTER + EXPORT USERS BUTTON ===== */}
        <Stack
          direction="row"
          spacing={2}
          mb={3}
          alignItems="center"
          sx={{ justifyContent: "space-between" }}
        >
          {/* LEFT SIDE FILTERS */}
          <Box gap={2} sx={{ display: "flex", flexWrap: "wrap" }}>
            <TextField
              select
              label="Filter"
              value={filter}
              onChange={(e) => {
                const selectedFilter = e.target.value;
                setFilter(selectedFilter);

                if (selectedFilter === "today") {
                  setStartDate(dayjs().startOf("day"));
                  setEndDate(dayjs().endOf("day"));
                } else if (selectedFilter === "week") {
                  setStartDate(dayjs().startOf("week"));
                  setEndDate(dayjs().endOf("week"));
                } else if (selectedFilter === "month") {
                  setStartDate(dayjs().startOf("month"));
                  setEndDate(dayjs().endOf("month"));
                } else if (selectedFilter === "year") {
                  setStartDate(dayjs().startOf("year").add(1, "day"));
                  setEndDate(dayjs().endOf("year").add(1, "day"));
                } else if (selectedFilter === "quarter") {
                  setStartDate(dayjs().subtract(3, "month").startOf("day"));
                  setEndDate(dayjs());
                } else if (selectedFilter === "total") {
                  setStartDate(null);
                  setEndDate(null);
                  setCustomStartDate(dayjs().startOf("day"));
                  setCustomEndDate(dayjs().endOf("day"));
                  setToDateEndDate(dayjs());
                }
              }}
              size="small"
              sx={{ minWidth: 130 }}
            >
              {filterOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            {filter === "todate" && (
              <DatePicker
                label="End Date"
                value={toDateEndDate}
                maxDate={dayjs()}
                minDate={dayjs("2025-01-01T00:00:00Z")}
                onChange={(newValue) => setToDateEndDate(newValue)}
                renderInput={(params) => <TextField {...params} size="small" />}
                inputFormat="DD MMM YYYY"
              />
            )}

            {filter === "custom" && (
              <>
                <DatePicker
                  label="Start Date"
                  value={customStartDate}
                  maxDate={customEndDate || dayjs()}
                  onChange={(newValue) => setCustomStartDate(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} size="small" />
                  )}
                  inputFormat="DD MMM YYYY"
                />

                <DatePicker
                  label="End Date"
                  value={customEndDate}
                  minDate={customStartDate}
                  maxDate={dayjs()}
                  onChange={(newValue) => setCustomEndDate(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} size="small" />
                  )}
                  inputFormat="DD MMM YYYY"
                />
              </>
            )}
          </Box>

          {/* EXPORT USERS BUTTON (RIGHT) */}
          {/* <Button
            variant="contained"
            startIcon={<Icon icon="mdi:download" />}
            onClick={handleExportUsersCSV}
          >
            Export Users CSV
          </Button> */}
        </Stack>

        {/* ===== USER SUMMARY CARDS ===== */}
        {/* <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
            <AppWidgetSummary
              title="Small Businesses"
              total={summary.totalUsers}
              color="info"
              icon={
                <img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />
              }
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <AppWidgetSummary
              title="Remote Workers"
              total={summary.totalSubscriptions || 0}
              color="success"
              icon={
                <img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />
              }
            />
          </Grid>
        </Grid> */}

        <Card
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          }}
        >
          <Typography variant="h6" fontWeight={600} mb={3}>
            Total Users
          </Typography>

          <Grid container spacing={3}>
            {/* Total Companies */}
            <Grid xs={12} sm={6} md={4}>
              <AppWidgetSummary
                title="Total Companies"
                total={summary.totalUsers || 0}
                color="primary"
                icon={
                  <img
                    alt="companies"
                    src="/assets/icons/glass/ic_glass_users.png"
                  />
                }
              />
            </Grid>

            {/* Active Subscriptions */}
            <Grid xs={12} sm={6} md={4}>
              <AppWidgetSummary
                title="Active Subscriptions"
                total={summary.activeSubscriptions || 0}
                color="success"
                icon={
                  <img
                    alt="active"
                    src="/assets/icons/glass/ic_glass_users.png"
                  />
                }
              />
            </Grid>

            {/* Inactive Subscriptions */}
            <Grid xs={12} sm={6} md={4}>
              <AppWidgetSummary
                title="Inactive Subscriptions"
                total={summary.inactiveSubscriptions || 0}
                color="error"
                icon={
                  <img
                    alt="inactive"
                    src="/assets/icons/glass/ic_glass_users.png"
                  />
                }
              />
            </Grid>
          </Grid>
        </Card>

        <Card
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          }}
        >
          <Typography variant="h6" fontWeight={600} mb={3}>
            Revenue Overview
          </Typography>

          <Grid container spacing={3}>
            <Grid xs={12} md={4}>
              <AppWidgetSummary
                title="Total Revenue"
                total={summary.totalRevenue || 0}
                color="warning"
                icon={
                  <img
                    alt="revenue"
                    src="/assets/icons/glass/ic_glass_message.png"
                  />
                }
              />
            </Grid>

            {/* Chart */}
            {/* <Grid xs={12} md={8}>
              <Chart
                type="line"
                series={revenueSeries}
                options={revenueChartOptions}
                height={280}
              />
            </Grid> */}
          </Grid>
        </Card>

        {/* ======================= CALL LOGS GROUP CARD ======================= */}
        {/* <Card sx={{ p: 3 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={3}
          >
            <Typography variant="h6" fontWeight={600}>
              Total Revenue
            </Typography>
          </Stack>

          🔥 REVENUE LINE CHART
          <Chart
            type="bar"
            series={revenueSeries}
            options={revenueChartOptions}
            height={300}
          />

          EXISTING REVENUE CARDS
          <Grid container spacing={3} mt={3}>
            <Grid item xs={12} sm={6}>
              <AppWidgetSummary
                title="Subscription Revenue"
                total={0}
                color="info"
                icon={
                  <img
                    alt="icon"
                    src="/assets/icons/glass/ic_glass_message.png"
                  />
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <AppWidgetSummary
                title="Other Miscellaneous Revenue"
                total={0}
                color="info"
                icon={
                  <img
                    alt="icon"
                    src="/assets/icons/glass/ic_glass_message.png"
                  />
                }
              />
            </Grid>
          </Grid>
        </Card> */}
      </Container>
    </LocalizationProvider>
  );
}
