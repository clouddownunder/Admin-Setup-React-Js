/* eslint-disable  */

import { Helmet } from "react-helmet-async";

import { Income } from "../sections/income/view";

// ----------------------------------------------------------------------

export default function ViewPage() {
  return (
    <>
      <Helmet>
        <title> TruckMatch | Subscription & Commission </title>
      </Helmet>

      <Income />
    </>
  );
}
