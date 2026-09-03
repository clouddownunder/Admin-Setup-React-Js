/* eslint-disable  */

import { Helmet } from "react-helmet-async";

import ConstructionCompanyDetailView from "../sections/constructionCompany/construction-detail-page"

// ----------------------------------------------------------------------

export default function ConstructionCompanyDetailPage() {
    return (
        <>
            <Helmet>
                <title> TruckMatch | Construction Companies </title>
            </Helmet>

            <ConstructionCompanyDetailView />
        </>
    );
}