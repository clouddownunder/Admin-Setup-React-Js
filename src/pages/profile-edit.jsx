/* eslint-disable  */

import { Helmet } from "react-helmet-async";

import { ProfileEditView } from "../sections/profile";

// ----------------------------------------------------------------------

export default function ProfileEditPage() {
  return (
    <>
      <Helmet>
        <title> TruckMatch | Edit Admin Profile </title>
      </Helmet>

      <ProfileEditView />
    </>
  );
}
