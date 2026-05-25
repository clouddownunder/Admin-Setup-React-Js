/* eslint-disable  */

import { Helmet } from "react-helmet-async";

import { Subscription } from "../sections/subscription/view";

// ----------------------------------------------------------------------

export default function ViewPage() {
  return (
    <>
      <Helmet>
        <title> TruckMatch | Plans & Fees </title>
      </Helmet>

      <Subscription />
    </>
  );
}
