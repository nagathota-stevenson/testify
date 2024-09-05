import React from "react";
import "./RequestsPage.css";
import CardBento from "./CardsBento";

const RequestsPage = () => {
  return <CardBento collectionName="requests" homePage={true} />;
};

export default RequestsPage;
