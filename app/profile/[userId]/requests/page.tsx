'use client'
import React, { useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import SetupUser from "../../../components/SetupUser";
import CardBento from "../../../components/CardsBento";
import ProfileLayout from "../../../components/ProfileLayout";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation"; // Import useRouter

type ProfilePageProps = {
  params: any;
};

const ProfilePage = ({ params }: ProfilePageProps) => {
  const { userDetails, user } = useContext(AuthContext);
  const [profileActiveButton, setProfileActiveButton] = useState("Requests");

  const router = useRouter(); 
  

 

  // If the user hasn't set up their profile yet
  if (user && !userDetails?.isUserId) {
    return (
      <section className="bg-blk1 w-screen h-screen flex items-center justify-center pt-24 pb-24">
        <SetupUser />
      </section>
    );
  }

  const handleNavigation = (section: string) => {
    if (section === "Requests") {
      router.push("/profile/" + params.userId + "/requests/");
    } else if (section === "Testimonies") {
      router.push("/profile/" + params.userId + "/testimonies/");
    } else {
      router.push("/profile/" +  params.userId );
    }
  };

  return (
    <ProfileLayout uid={params.userId}>
      <div className="flex items-center text-xs lg:text-base gap-8">
        <button
          className={`text-white p-[12px] border-b-2 ${
            profileActiveButton === "All" ? " border-white" : " border-blk1"
          }`}
          onClick={() => handleNavigation("All")}
        >
          All
        </button>
        <button
          className={`text-white p-[12px] border-b-2 ${
            profileActiveButton === "Requests" ? " border-purp" : "border-blk1"
          }`}
          onClick={() => handleNavigation("Requests")}
        >
          Requests
        </button>
        <button
          className={`text-white p-[12px] border-b-2 ${
            profileActiveButton === "Testimonies"
              ? " border-coral"
              : "border-blk1"
          }`}
          onClick={() => handleNavigation("Testimonies")}
        >
          Testimonies
        </button>
      </div>
      <motion.div
        className="profile-card w-screen rounded-2xl border-2 justify-center items-center border-blk1 flex flex-col p-8"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, originY: 0 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 40 }}
      >
        <CardBento filterByCurrentUser={(params.userId === userDetails?.uid)} filterByUserId={params.userId} filterByType="req" homePage={false}/>
      </motion.div>
    </ProfileLayout>
  );
};

export default ProfilePage;
