import React, { useState } from "react";
import SetupUser from "../../components/SetupUser";
import NavBar from "@/app/components/NavBar";

const EditProfilePage = () => {
  return (
    <>
     

      <section className="bg-blk1 w-screen h-screen flex items-start justify-center pt-24 pb-24">
        <SetupUser />
      </section>
    </>
  );
};

export default EditProfilePage;
