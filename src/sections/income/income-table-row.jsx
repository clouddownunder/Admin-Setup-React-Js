/* eslint-disable */
import PropTypes from "prop-types";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Iconify from "src/components/iconify";
export default function IncomeTableRow({
  selected,
  avatarUrl,
  date,
  amount,
  type,
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
        <TableCell component="th" scope="row" padding="none" sx={{ textAlign: "center" }}>
          <Stack direction="row" alignItems="center" spacing={2} justifyContent="center">
            {/* <Avatar
              alt={name}
              src={`${import.meta.env.VITE_API_BASEURL}${avatarUrl}`}
            /> */}
            <Typography noWrap align="center">
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

        <TableCell align="center">{type}</TableCell>
        <TableCell align="center">$ {amount}</TableCell>
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

IncomeTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  name: PropTypes.any,
  email: PropTypes.any,
  mobile: PropTypes.string,
  userId: PropTypes.string,
  selected: PropTypes.bool,
};
