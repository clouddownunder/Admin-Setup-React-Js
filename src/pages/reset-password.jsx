/* eslint-disable  */

import { Helmet } from "react-helmet-async";

import { ResetPasswordView } from "../sections/resetPassword";

// ----------------------------------------------------------------------

export default function ResetPasswordPage() {
  return (
    <>
      <Helmet>
        <title> TruckMatch | Reset Password </title>
      </Helmet>

      <ResetPasswordView />
    </>
  );
}
