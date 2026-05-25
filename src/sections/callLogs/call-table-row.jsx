/* eslint-disable */
import PropTypes from "prop-types";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Iconify from "src/components/iconify";
export default function CallTableRow({
  selected,
  name,
  avatarUrl,
  email,
  mobile,
  userId,
  platform,
  date,
  callDuration,
  callCost,
  pdfUrl,
  officeRate,
  outsideOfficeRate,
  countryCode,
  key,
  callType,
}) {
  const formatMobileNumber = (code, number) => {
    if (!number) return code;
    const digits = number.replace(/\D/g, "");
    const formatted = digits.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
    return `${code} ${formatted}`;
  };

  const downloadPDF = async (pdfUrl, filename = "invoice.pdf") => {
    try {
      const token = localStorage.getItem("token"); // if your URL requires auth
      const response = await fetch(
        `${import.meta.env.VITE_API_BASEURL}${pdfUrl}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // remove if not required
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch PDF");

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <>
      {/* Table Row */}
      <TableRow
        key={key}
        hover
        tabIndex={-1}
        role="checkbox"
        selected={selected}
      >
        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              alt={name}
              src={`${import.meta.env.VITE_API_BASEURL}${avatarUrl}`}
            />
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{email}</TableCell>
        <TableCell>{formatMobileNumber(countryCode, mobile)}</TableCell>
        <TableCell>{callType === 1 ? "Single Call" : "Team Call"}</TableCell>
        <TableCell>{platform}</TableCell>
        <TableCell>
          {new Date(date)
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(",", "")}
        </TableCell>
        <TableCell>{callDuration} Min</TableCell>
        {/* <TableCell>{callCost}</TableCell>
        <TableCell>{officeRate}</TableCell>
        <TableCell>{outsideOfficeRate}</TableCell> */}
        <TableCell align="left">
          <IconButton
            onClick={() => downloadPDF(pdfUrl, `invoice_${userId}.pdf`)}
          >
            <Iconify icon="mdi:file-pdf-box-outline" width={24} />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  );
}

CallTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  name: PropTypes.any,
  email: PropTypes.any,
  mobile: PropTypes.string,
  userId: PropTypes.string,
  selected: PropTypes.bool,
};
