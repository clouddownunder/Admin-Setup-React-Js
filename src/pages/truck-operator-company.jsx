/* eslint-disable  */

import { Helmet } from "react-helmet-async";

import { TruckOperatorView } from "../sections/truckOperatorCompany/view";

// ----------------------------------------------------------------------

export default function TruckOperatorCompanyPage() {
    return (
        <>
            <Helmet>
                <title> TruckMatch | Truck Operator Companies </title>
            </Helmet>

            <TruckOperatorView />
        </>
    );
}
