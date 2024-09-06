import React, { useEffect, useState } from "react";
import "./Card.css";
import Image from "next/image";
import { PiHandsPrayingFill } from "react-icons/pi";
import { AnimatedSubscribeButton } from "./magicui/animated-subscribe-button";
import { MdEdit } from "react-icons/md";
import { FaHands } from "react-icons/fa";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "@/app/firebase/config"; // Make sure to import your Firestore instance
import { MdDelete } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";

type Prayer = {
  uid: string;
  time?: Timestamp; // You can define a more specific type if needed
};

type CardProps = {
  userImage?: string;
  userName?: string;
  userHandle?: string;
  prayerDate?: string;
  prayerRequest?: string;
  prayersCount?: string;
  type?: string;
  prayers?: (Prayer | string)[]; // prayers is an array of strings
  isUser?: boolean;
  docId?: string;
  uid?: string; // uid is a string
};

const Card = ({
  userImage = "",
  userName = "",
  userHandle = "",
  prayerDate = "",
  prayerRequest = "",
  prayersCount = "",
  type = "",
  prayers = [], // Array of strings
  isUser = false,
  uid = "", // String uid
  docId = "", // Document ID for Firebase
}: CardProps) => {
  const [subscribe, setSubscribe] = useState(false);
  const collectionName = type === "requests" ? "requests" : "testimonies"; // Collection based on type
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    const docRef = doc(db, collectionName, docId); // Get document reference

    try {
      await deleteDoc(docRef); // Delete the document from Firestore
      console.log("Document deleted successfully");
      setShowConfirm(false); // Hide confirmation overlay
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("There was an error deleting the document. Please try again.");
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false); // Hide confirmation overlay
  };

  // Assuming it's an array of objects and strings

  useEffect(() => {
    const isSubscribed = prayers.some((prayer) => {
      // Check if prayer is an object with a uid property
      return typeof prayer === "object" && "uid" in prayer
        ? prayer.uid === uid
        : prayer === uid;
    });

    setSubscribe(isSubscribed); // Set subscribe to true if uid is found in prayers
  }, [prayers, uid]);

  // Handle Subscribe (Add uid to prayers array)
  const handleSubscribe = async () => {
    const docRef = doc(db, collectionName, docId); // Get document reference

    try {
      // First, create the object with serverTimestamp
      const timestamp = Timestamp.now();

      // First, set the serverTimestamp directly in Firestore
      await updateDoc(docRef, {
        prayers: arrayUnion({
          uid: uid,
          time: timestamp, // store it as a reference first
        }),
      });

      setSubscribe(true); // Update state locally
    } catch (error) {
      console.error("Error subscribing:", error);
    }
  };

  // Handle Unsubscribe (Remove uid from prayers array)
  const handleUnsubscribe = async () => {
    const docRef = doc(db, collectionName, docId); // Get document reference


    try {
      // Retrieve the document to get the prayers array
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const updatedPrayers = data.prayers.filter(
          (prayer: any) => prayer.uid !== uid
        );

        // Update Firestore with the filtered array
        await updateDoc(docRef, {
          prayers: updatedPrayers,
        });
        setSubscribe(false); // Update local state
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

  return (
    <div
      className={`bg-white rounded-2xl border-solid border-2 border-blk1 flex flex-col p-4 ${
        type === "requests" ? "card" : "card-testimony"
      }`}
    >
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-2xl z-10"
            {...animations}
          >
            <div className="p-8 px-2 bg-gray-100 border-solid border-2 border-blk1  rounded-2xl text-center">
              <p className="text-base font-semibold text-blk1 mb-4">
                Would you like to delete this{" "}
                {type === "requests" ? "Request" : "Testimony"}?
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

      <div className="relative">
        <div className="flex items-center mb-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden">
            <Image
              src={userImage}
              alt="User DP"
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
          </div>
          <div className="ml-4">
            <h2 className="text-sm lg:text-lg font-semibold text-blk1">{userName}</h2>
            <p className="text-xs lg:text-lg text-gray-500">{userHandle}</p>
            <p className="text-[10px] text-gray-300">{prayerDate}</p>
          </div>
          {isUser && (
            <button className="ml-auto self-start" onClick={handleDeleteClick}>
              <MdDelete className="text-gray-300 size-6 mr-2 mt-2 ml-auto self-start hover:text-red-500" />
            </button>
          )}
        </div>

        <div className="flex-grow mb-4 overflow-hidden">
          <p className="text-gray-700 text-xs lg:text-base text-balance">{prayerRequest}</p>
        </div>

        <div>
          <div className="border-t border-gray-300"></div>
          <div className="flex justify-between items-center pt-4">
            <span className="text-blk1 font-semibold text-xs lg:text-base">
              {type === "requests"
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
                    {type === "requests" ? <PiHandsPrayingFill /> : <FaHands />}
                    {type === "requests" ? "Pray" : "Praise"}
                  </span>
                }
                changeText={
                  <span className="group flex items-center justify-center gap-2 text-xs lg:text-base">
                    {type === "requests" ? <PiHandsPrayingFill /> : <FaHands />}
                    {type === "requests" ? "Prayed!" : "Praised!"}
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
