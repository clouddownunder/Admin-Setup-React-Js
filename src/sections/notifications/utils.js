export const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: "1px",
  height: "1px",
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
  clip: "rect(0 0 0 0)",
};

export function emptyRows(page, rowsPerPage, arrayLength) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

function descendingComparator(a, b, orderBy) {
  if (a[orderBy] === null) {
    return 1;
  }
  if (b[orderBy] === null) {
    return -1;
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
export function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function applyFilter({ inputData = [], filterName }) {
  if (!Array.isArray(inputData)) return [];

  if (!filterName) return inputData;

  const lowerCaseSearch = filterName.toLowerCase();

  return inputData.filter((item) => {
    const userName = item?.user?.fullName?.toLowerCase() || "";

    const email = item?.user?.email?.toLowerCase() || "";

    const text = item?.text?.toLowerCase() || "";

    const title = item?.title?.toLowerCase() || "";

    const type = item?.notificationType?.toLowerCase() || "";

    return (
      userName.includes(lowerCaseSearch) ||
      email.includes(lowerCaseSearch) ||
      text.includes(lowerCaseSearch) ||
      title.includes(lowerCaseSearch) ||
      type.includes(lowerCaseSearch)
    );
  });
}
