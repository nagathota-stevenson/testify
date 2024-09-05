import React from "react";
import LoginCard from "../components/LoginCard";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ProfileCard from "../components/ProfileCard";

const ProfilePage: React.FC<{ setActiveButton: (button: string) => void }> = ({ setActiveButton }) => {
  const { user } = useContext(AuthContext);

  console.log(user);

  if (!user) {
    return (
      <section className="bg-blk1 w-screen h-screen flex items-center justify-center pt-24 pb-24">
        <LoginCard />
      </section>
    );
  }
  return (
    <section className="bg-blk1 w-screen h-screen flex items-start justify-center pt-24 pb-24">
      <ProfileCard setActiveButton={setActiveButton}/>
    </section>
  );
};

export default ProfilePage;
