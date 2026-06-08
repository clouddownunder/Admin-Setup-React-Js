import { Helmet } from "react-helmet-async";

import { DetailView } from "../sections/detail/view";

// ----------------------------------------------------------------------

export default function DetailPage() {
  return (
    <>
      <Helmet>
        <title> TruckMatch | Detail Page </title>
      </Helmet>

      <DetailView />
    </>
  );
}
