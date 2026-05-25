/* eslint-disable  */

import { Helmet } from "react-helmet-async";

import NotificationsManagement from "../sections/notifications/view/notifications";

// ----------------------------------------------------------------------

export default function NotificationsManagementPage() {
  return (
    <>
      <Helmet>
        <title> TruckMatch | Notification </title>
      </Helmet>

      <NotificationsManagement />
    </>
  );
}
