"use client";
import React from "react";
import NotificationStack from "../components/NotificationStack";
import NavBar from "../components/NavBar";

const NotificationsPage = () => {
  return (
    <>
      <NavBar />
      <section className="bg-blk1 w-screen h-screen flex items-start justify-center pt-24 pb-24">
        <NotificationStack />
      </section>
    </>
  );
};

export default NotificationsPage;
