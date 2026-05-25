/* eslint-disable  */

import { Helmet } from "react-helmet-async";

import { CallLogs } from "../sections/callLogs/view";

// ----------------------------------------------------------------------

export default function ViewPage() {
  return (
    <>
      <Helmet>
        <title> TruckMatch | Calls & Invoices </title>
      </Helmet>

      <CallLogs />
    </>
  );
}
