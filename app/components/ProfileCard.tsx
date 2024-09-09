import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import SetupUser from "./SetupUser";
import CardBento from "./CardsBento";
import { motion } from "framer-motion";
import ProfileDetails from "./ProfileDetails";

const ProfileCard = () => {
  const { userDetails, user } = useContext(AuthContext);

  const [profileActiveButton, setProfileActiveButton] = useState("Requests");

  if (!user) {
    return <p>Loading...</p>;
  }

  if (!userDetails?.isUserId) {
    return <SetupUser />;
  }

  return (
    <motion.div
      className="profile-card w-screen rounded-2xl border-2 justify-center items-center border-blk1 flex flex-col p-8"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, originY: 0 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 40 }}
    >
      <ProfileDetails />

      <div className="flex items-center text-xs lg:text-base gap-8">
        <button
          className={`text-white p-[12px] ${
            profileActiveButton === "Requests" ? "border-b-2 border-white" : ""
          }`}
          onClick={() => setProfileActiveButton("Requests")}
        >
          All
        </button>
        <button
          className={`text-white p-[12px] ${
            profileActiveButton === "Requests" ? "border-b-2 border-purp" : ""
          }`}
          onClick={() => setProfileActiveButton("Requests")}
        >
          Requests
        </button>
        <button
          className={`text-white p-[12px] ${
            profileActiveButton === "Testimonies"
              ? "border-b-2 border-coral"
              : ""
          }`}
          onClick={() => setProfileActiveButton("Testimonies")}
        >
          Testimonies
        </button>
      </div>

      <CardBento filterByCurrentUser={true} filterByType="all" />
    </motion.div>
  );
};

export default ProfileCard;
