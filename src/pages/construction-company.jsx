/* eslint-disable  */

import { Helmet } from "react-helmet-async";

import { ConstructionCompanyView } from "../sections/constructionCompany/view";

// ----------------------------------------------------------------------

export default function ConstructionCompanyPage() {
    return (
        <>
            <Helmet>
                <title> TruckMatch | Construction Companies </title>
            </Helmet>

            <ConstructionCompanyView />
        </>
    );
}
