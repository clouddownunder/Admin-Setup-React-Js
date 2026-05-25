/* eslint-disable  */

import { Helmet } from "react-helmet-async";

import { UserView } from "../sections/userView";

// ----------------------------------------------------------------------

export default function ViewPage() {
  return (
    <>
      <Helmet>
        <title> TruckMatch | View User </title>
      </Helmet>

      <UserView />
    </>
  );
}
