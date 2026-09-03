/* eslint-disable  */

import { Helmet } from "react-helmet-async";

import TruckOperatorCompanyDetailView from "../sections/truckOperatorCompany/truck-operator-detail-page"

// ----------------------------------------------------------------------

export default function TruckOperatorCompanyDetailPage() {
    return (
        <>
            <Helmet>
                <title> TruckMatch | Truck Operator Companies </title>
            </Helmet>

            <TruckOperatorCompanyDetailView />
        </>
    );
}