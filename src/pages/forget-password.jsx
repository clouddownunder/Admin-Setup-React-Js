/* eslint-disable  */

import { Helmet } from "react-helmet-async";

import { ForgotPasswordView } from "../sections/forgetPassword";

// ----------------------------------------------------------------------

export default function ForgotPasswordPage() {
  return (
    <>
      <Helmet>
        <title> TruckMatch | Forgot Password </title>
      </Helmet>

      <ForgotPasswordView />
    </>
  );
}
