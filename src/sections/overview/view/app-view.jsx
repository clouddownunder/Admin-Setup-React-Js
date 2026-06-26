/* eslint-disable */
import { getCookie } from "../../../utils/format-user";
import { useEffect, useState } from "react";
import axios from "axios";
import { MenuItem, TextField } from "@mui/material";

// import { DatePicker } from "@mui/x-date-pickers";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
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

  const [userData, setUserData] = useState({});
  useEffect(() => {
    try {
      const user = getCookie("UserData");

      if (user) {
        setUserData(JSON.parse(decodeURIComponent(user)));
      }
    } catch (error) {
      console.error("User data parse error:", error);
    }
  }, []);

  const CustomSwitchIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
    >
      <path
        transform="translate(0,1)"
        d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
        fill="currentColor"
      ></path>
    </svg>
  );

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
      <div className="page-header">
        <h1 className="page-title mb-0">Dashboard</h1>
        <span className="d-inline-block title-sub-text">
          Welcome back,{" "}
          <span className="fw-600">{userData?.fullName || "Admin"}</span>
        </span>
      </div>

      <div className="page-content dashboard-main pt-3">
        <div className="panel">
          <div className="custom-section-class pt-0">
            {/* ===== TOP FILTER ===== */}
            <div className="section-header">
              <div className="statistics-dropdown">
                <div className="row gy-3 gx-3">
                  <div className="col-md-4 col-xxl-3">
                    {/* LEFT SIDE FILTERS */}
                    <div className="filter-dropdown-wrap floating-label group-field">
                      <label htmlFor="filter" className="mb-2 main-label">
                        Select Time Range
                      </label>

                      <TextField
                        select
                        className="filter-dropdown input-field"
                        InputProps={{
                          inputProps: {
                            className: "form-control border",
                          },
                        }}
                        SelectProps={{
                          IconComponent: () => (
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
                          ),
                          MenuProps: {
                            PaperProps: {
                              className: "filter-menu-list",
                            },
                          },
                        }}
                        // label="Filter"
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
                            setStartDate(
                              dayjs().subtract(3, "month").startOf("day"),
                            );
                            setEndDate(dayjs());
                          } else if (selectedFilter === "total") {
                            setStartDate(null);
                            setEndDate(null);
                            setCustomStartDate(dayjs().startOf("day"));
                            setCustomEndDate(dayjs().endOf("day"));
                            setToDateEndDate(dayjs());
                          }
                        }}
                      >
                        {filterOptions.map((option) => (
                          <MenuItem
                            className="filter-menu-item"
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                  </div>

                  {/* Date picker */}
                  {filter === "todate" && (
                    <div className="col-md-4 col-xxl-3">
                      <div className="group-field main-datepicker">
                        <div className="floating-label ">
                          <label htmlFor="todate" className="mb-2 main-label">
                            End Date
                          </label>
                        </div>
                        <DesktopDatePicker
                          className="input-field"
                          value={toDateEndDate}
                          maxDate={dayjs()}
                          minDate={dayjs("2025-01-01T00:00:00Z")}
                          onChange={(newValue) => setToDateEndDate(newValue)}
                          inputFormat="DD MMM YYYY"
                          PopperProps={{
                            className: "date-cal-wrapper",
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              inputProps={{
                                ...params.inputProps,
                                className: "form-control border",
                                readOnly: true,
                              }}
                              InputProps={{
                                ...params.InputProps,
                                className: "datepicker-wrapper",
                              }}
                            />
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {filter === "custom" && (
                    <>
                      <div className="col-md-4 col-xxl-3">
                        <div className="group-field main-datepicker">
                          <div className="floating-label ">
                            <label htmlFor="custom" className="mb-2 main-label">
                              Start Date
                            </label>
                          </div>
                          <DesktopDatePicker
                            className="input-field"
                            // label=""
                            value={customStartDate}
                            maxDate={customEndDate || dayjs()}
                            onChange={(newValue) => setCustomStartDate(newValue)}
                            inputFormat="DD MMM YYYY"
                            PopperProps={{
                              className: "date-cal-wrapper",
                            }}
                            
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                inputProps={{
                                  ...params.inputProps,
                                  className: "form-control border",
                                  readOnly: true,
                                }}
                                InputProps={{
                                  ...params.InputProps,
                                  className: "datepicker-wrapper",
                                }}
                              />
                            )}
                            
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-xxl-3">
                        <div className="group-field main-datepicker">
                          <div className="floating-label ">
                            <label htmlFor="custom" className="mb-2 main-label">
                              End Date
                            </label>
                          </div>
                          <DesktopDatePicker
                            className="input-field"
                            // label=""
                            value={customEndDate}
                            minDate={customStartDate}
                            maxDate={dayjs()}
                            onChange={(newValue) => setCustomEndDate(newValue)}
                            inputFormat="DD MMM YYYY"
                            PopperProps={{
                              className: "date-cal-wrapper",
                            }}
                            
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                inputProps={{
                                  ...params.inputProps,
                                  className: "form-control border",
                                  readOnly: true,
                                }}
                                InputProps={{
                                  ...params.InputProps,
                                  className: "datepicker-wrapper",
                                }}
                              />
                            )}
                            
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* ===== CARDS ===== */}
            <div className="row gx-3 gx-xxl-4">
              {/* card 1 */}
              <div className="col-sm-6 col-xl-4 col-xxl-3">
                <div className="card card-block">
                  <div className="counter-main">
                    <div className="stat-icon blue-box">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <div className="counter counter-lg">
                      <span className="counter-number user-counter">
                        {summary.totalUsers || 0}
                      </span>
                      <div className="counter-label text-uppercase">
                        Total Companies
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* card 2 */}
              <div className="col-sm-6 col-xl-4 col-xxl-3">
                <div className="card card-block">
                  <div className="counter-main">
                    <div className="stat-icon success-box">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <div className="counter counter-lg">
                      <span className="counter-number user-counter">
                        {summary.activeSubscriptions || 0}
                      </span>
                      <div className="counter-label text-uppercase">
                        Active Subscriptions
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* card 3 */}
              <div className="col-sm-6 col-xl-4 col-xxl-3">
                <div className="card card-block">
                  <div className="counter-main">
                    <div className="stat-icon warning-box">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <div className="counter counter-lg">
                      <span className="counter-number user-counter">
                        {summary.inactiveSubscriptions || 0}
                      </span>
                      <div className="counter-label text-uppercase">
                        Inactive Subscriptions
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* card 4 */}
              <div className="col-sm-6 col-xl-4 col-xxl-3">
                <div className="card card-block">
                  <div className="counter-main">
                    <div className="stat-icon blue-box">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <div className="counter counter-lg">
                      <span className="counter-number user-counter">
                        {summary.totalRevenue || 0}
                      </span>
                      <div className="counter-label text-uppercase">
                        Total Revenue
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </LocalizationProvider>
  );
}
