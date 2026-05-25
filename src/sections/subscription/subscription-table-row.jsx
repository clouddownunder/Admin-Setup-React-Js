/* eslint-disable */
import PropTypes from "prop-types";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Iconify from "src/components/iconify";
export default function SubscriptionTableRow({
  selected,
  avatarUrl,
  date,
  type,
  oldValue,
  newValue,
  planName,
  key,
}) {
  const formatMobileNumber = (code, number) => {
    if (!number) return code;
    const digits = number.replace(/\D/g, "");
    const formatted = digits.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
    return `${code} ${formatted}`;
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
        <TableCell>
          {type === "commission_rate" ? "Commission" : "Subscription"}
        </TableCell>
        <TableCell>{planName}</TableCell>
        <TableCell component="th" scope="row" padding="normal" align="left">
          <Stack direction="row" spacing={2}>
            {/* <Avatar
              alt={name}
              src={`${import.meta.env.VITE_API_BASEURL}${avatarUrl}`}
            /> */}
            <Typography noWrap>
              {new Date(date)
                .toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
                .replace(",", "")}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>$ {oldValue}</TableCell>
        <TableCell>$ {newValue}</TableCell>
        {/* <TableCell>{formatMobileNumber(countryCode, mobile)}</TableCell> */}
        {/* <TableCell>{platform}</TableCell>
        <TableCell>
          {new Date(date)
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(",", "")}
        </TableCell> */}
        {/* <TableCell>{callDuration} Min</TableCell> */}
        {/* <TableCell>{callCost}</TableCell>
        <TableCell>{officeRate}</TableCell>
        <TableCell>{outsideOfficeRate}</TableCell> */}
        {/* <TableCell align="left">
          <IconButton
            onClick={() => downloadPDF(pdfUrl, `invoice_${userId}.pdf`)}
          >
            <Iconify icon="mdi:file-pdf-box-outline" width={24} />
          </IconButton>
        </TableCell> */}
      </TableRow>
    </>
  );
}

SubscriptionTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  name: PropTypes.any,
  email: PropTypes.any,
  mobile: PropTypes.string,
  userId: PropTypes.string,
  selected: PropTypes.bool,
};
