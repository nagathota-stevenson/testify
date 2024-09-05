import React, { useState } from "react";
import SetupUser from "../components/SetupUser";

const EditProfilePage: React.FC<{ setActiveButton: (button: string) => void }> = ({ setActiveButton }) => {

  return (
    <section className="bg-blk1 w-screen h-screen flex items-center justify-center pt-24 pb-24">
      <SetupUser setActiveButton={setActiveButton} />
    </section>
  );
};

export default EditProfilePage;
   