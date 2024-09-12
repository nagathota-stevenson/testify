import React from "react";
import "./RequestsPage.css";
import CardBento from "../components/CardsBento";
import NavBar from "../components/NavBar";

const RequestsPage = () => {
  return (
    <>
      <section className="bg-blk1 w-screen h-screen flex items-center justify-center pt-24 pb-24">
        <CardBento filterByType="req" filterByUserId="" filterByCurrentUser={false} homePage={true} />
      </section>
    </>
  );
};

export default RequestsPage;
