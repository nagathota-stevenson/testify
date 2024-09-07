"use client";
import React from "react";
import LoginCard from "../components/LoginCard";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ProfileCard from "../components/ProfileCard";
import NavBar from "../components/NavBar";

const ProfilePage = () => {
  const { user, userDetails } = useContext(AuthContext);

  if (!user) {
    return (
      <>
        <NavBar />

        <section className="bg-blk1 w-screen h-screen flex items-center justify-center pt-24 pb-24">
          <LoginCard />
        </section>
      </>
    );
  }
  return (
    <>
      <NavBar />

      <section className="bg-blk1 w-screen h-screen flex items-start justify-center pt-24 pb-24">
        <ProfileCard />
      </section>
    </>
  );
};

export default ProfilePage;
