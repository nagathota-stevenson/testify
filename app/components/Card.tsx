"use client";
import React, { useEffect, useState } from "react";
import "./Card.css";
import Image from "next/image";
import { PiHandsPrayingFill } from "react-icons/pi";
import { AnimatedSubscribeButton } from "./magicui/animated-subscribe-button";
import { MdDelete } from "react-icons/md";
import { FaHands, FaUserSecret } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { LiaUserSecretSolid } from "react-icons/lia";

import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { PROFILE_IMG } from "../constants";

type Prayer = {
  uid: string;
  time?: Timestamp;
  isViewed: boolean;
};

type CardProps = {
  userImage?: string;
  userName?: string;
  userHandle?: string;
  prayerDate?: string;
  prayerRequest?: string;
  prayersCount?: string;
  type?: "req" | "tes";
  prayers?: Prayer[];
  isUser?: boolean | undefined;
  docId?: string;
  uid?: string;
  ownerId?: string;
  isHomePage?: boolean | undefined;
  isAnonymous?: boolean | undefined;
  onDelete?: (docId: string) => void;
};

const Card = ({
  userImage = "",
  userName = "",
  userHandle = "",
  prayerDate = "",
  prayerRequest = "",
  prayersCount = "",
  type = "req",
  prayers = [],
  isUser = false,
  uid = "",
  docId = "",
  ownerId = "",
  isAnonymous = false,
  isHomePage,
  onDelete,
}: CardProps) => {
  const [subscribe, setSubscribe] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    const docRef = doc(db, "requests", docId);
    try {
      await deleteDoc(docRef);
      setShowConfirm(false);
      if (onDelete) onDelete(docId);
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("There was an error deleting the document. Please try again.");
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  useEffect(() => {
    // Ensure prayers is an array before calling .some
    if (Array.isArray(prayers)) {
      const isSubscribed = prayers.some((prayer) =>
        typeof prayer === "object" && "uid" in prayer
          ? prayer.uid === uid
          : prayer === uid
      );
      setSubscribe(isSubscribed);
    }
  }, [prayers, uid]);

  const handleSubscribe = async () => {
    const docRef = doc(db, "requests", docId);
    try {
      const timestamp = Timestamp.now();
      await updateDoc(docRef, {
        prayers: arrayUnion({ uid: uid, time: timestamp, isViewed: false }),
      });
      setSubscribe(true);
    } catch (error) {
      console.error("Error subscribing:", error);
    }
  };

  const handleUnsubscribe = async () => {
    const docRef = doc(db, "requests", docId);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const updatedPrayers = data.prayers.filter(
          (prayer: any) => prayer.uid !== uid
        );
        await updateDoc(docRef, { prayers: updatedPrayers });
        setSubscribe(false);
      }
    } catch (error) {
      console.error("Error unsubscribing:", error);
    }
  };

  const animations = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: "spring", stiffness: 350, damping: 40 },
  };

  if(isAnonymous && !isHomePage && !isUser){
    return null;
  }

  return (
    <div
      className={`bg-white rounded-2xl border-solid border-2 border-blk1 flex flex-col p-4   
          ${type === "req" ? "card" : "card-testimony"}`}
    >
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="absolute inset-0 flex items-center z-50 justify-center bg-white bg-opacity-75 rounded-2xl"
            {...animations}
          >
            <div className="p-8 px-2 bg-gray-100 border-solid border-2 border-blk1 rounded-2xl text-center">
              <p className="text-base font-normal text-blk1 mb-4">
                Would you like to delete this{" "}
                {type === "req" ? "Request" : "Testimony"}?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleCancelDelete}
                  className="text-blk1 bg-gray-100 px-4 py-2 rounded-lg hover:text-purp hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="bg-blk1 text-white px-4 py-2 rounded-lg hover:bg-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col h-full">
        <div className="flex items-center mb-4">
        
          <div className="relative w-16 h-16 rounded-full overflow-hidden">
            {isAnonymous ? (
              // Show anonymous icon
              <div className="flex items-center justify-center w-full h-full bg-gray-200">
                <LiaUserSecretSolid className="text-gray-500 w-10 h-10" />
              </div>
            ) : (
              <Image
                src={userImage ? userImage : PROFILE_IMG}
                alt="User DP"
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            )}
          </div>

          {/* User Info */}
          <div className="ml-4">
            <h2 className="text-sm lg:text-lg font-normal text-blk1">
              {isAnonymous ? "Anonymous" : userName}
            </h2>
            <p
              className={`text-xs lg:text-base text-gray-500 ${
                type === "req" ? "hover:text-purp" : "hover:text-coral"
              } ${isAnonymous ? "cursor-not-allowed" : "cursor-pointer"}`}
              onClick={() =>
                !isAnonymous && router.push(`/profile/${ownerId}/`)
              }
            >
              {isAnonymous ? "Anonymous User" : userHandle}
            </p>
            <p className="text-[10px] text-gray-300">{prayerDate}</p>
          </div>

          {isUser &&  (
            <button className="ml-auto self-start" onClick={handleDeleteClick}>
              <MdDelete className="text-gray-300 size-6 mr-2 mt-2 ml-auto self-start hover:text-red-500" />
            </button>
          )}
        </div>
        <div className="relative flex-grow mb-4 overflow-hidden">
          <div className="relative h-full overflow-auto pr-4 pb-16">
            <p className="text-gray-700 text-xs lg:text-base text-balance">
              {prayerRequest}
            </p>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
        </div>
        <div className="border-t border-gray-300 pt-4 mt-auto">
          <div className="flex justify-between items-center">
            <span className="text-blk1 font-normal text-xs lg:text-base">
              {type === "req"
                ? `${prayersCount} Prayed`
                : `${prayersCount} Praised`}
            </span>

            {uid && (
              <AnimatedSubscribeButton
                buttonColor="var(--blk1)"
                buttonTextColor="#ffffff"
                subscribeStatus={subscribe}
                initialText={
                  <span className="group flex items-center justify-center gap-2 text-xs lg:text-base">
                    {type === "req" ? <PiHandsPrayingFill /> : <FaHands />}
                    {type === "req" ? "Pray" : "Praise"}
                  </span>
                }
                changeText={
                  <span className="group flex items-center justify-center gap-2 text-xs lg:text-base">
                    {type === "req" ? <PiHandsPrayingFill /> : <FaHands />}
                    {type === "req" ? "Prayed!" : "Praised!"}
                  </span>
                }
                onClick={subscribe ? handleUnsubscribe : handleSubscribe}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
