"use client";
import React from "react";
import LoginCard from "../components/LoginCard";
import EditCard from "../components/EditCard";
import NavBar from "../components/NavBar";

const PostPage = () => {
  return (
    <>
      <NavBar />

      <section className="bg-blk1 w-screen h-screen flex items-center justify-center pt-24 pb-24">
        <EditCard docId={""} type={"req"} />
      </section>
    </>
  );
};

export default PostPage;
