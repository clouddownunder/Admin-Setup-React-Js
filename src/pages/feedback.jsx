/* eslint-disable  */

import { Helmet } from "react-helmet-async";

import { Feedback } from "../sections/feedBack/view";

// ----------------------------------------------------------------------

export default function FeedbackPage() {
  return (
    <>
      <Helmet>
        <title> TruckMatch | Feedbacks </title>
      </Helmet>

      <Feedback />
    </>
  );
}
