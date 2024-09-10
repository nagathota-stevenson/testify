"use client";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import NavBar from "../components/NavBar";
import { useRouter } from "next/navigation";
import LoginCard from "../components/LoginCard";

const LoginPage = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  // Redirect if user is authenticated
  if (user) {
    router.push("/profile/" + user.uid); // Redirect to the profile page if the user is logged in
    return null;
  }

  return (
    <>
      <NavBar />
      <section className="bg-blk1 w-screen h-screen flex items-center justify-center pt-24 pb-24">
        <div className="flex flex-col items-center">
          <LoginCard />
        </div>
      </section>
    </>
  );
};

export default LoginPage;
