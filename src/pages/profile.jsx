/* eslint-disable  */

import { Helmet } from "react-helmet-async";

import { ProfileView } from "../sections/profile";

// ----------------------------------------------------------------------

export default function ProfilePage() {
  return (
    <>
      <Helmet>
        <title> TruckMatch | Admin Profile </title>
      </Helmet>

      <ProfileView />
    </>
  );
}
