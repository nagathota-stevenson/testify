import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "@/app/firebase/config"; // Adjust the import path as needed
import SetupUser from "./SetupUser";
import Image from "next/image";
import RequestsPage from "../pages/RequestsPage";
import CardBento from "../pages/CardsBento";
import { MdArrowOutward } from "react-icons/md";
import { RiArrowLeftDownLine } from "react-icons/ri";
import { motion } from "framer-motion";

interface UserData {
  displayName: string;
  userID: string;
  img: string;
  isUserId: boolean;
}

const ProfileCard : React.FC<{ setActiveButton: (button: string) => void }> = ({ setActiveButton }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileActiveButton, setProfileActiveButton] = useState("Requests");
  const [userPrayersCount, setUserPrayersCount] = useState(0);
  const [othersPrayersCount, setOthersPrayersCount] = useState(0);
  const [userPraisedCount, setUserPraisedCount] = useState(0);
  const [othersPraisedCount, setOthersPraisedCount] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid; // Get the current user's UID
        const userDocRef = doc(db, "users", userId); // Reference to the user's document
        try {
          const docSnapshot = await getDoc(userDocRef);
          if (docSnapshot.exists()) {
            setUserData(docSnapshot.data() as UserData); // Set the user data
          } else {
            console.log("No such document!");
          }
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          }
        } finally {
          setLoading(false);
        }
      } else {
        setError("No user is signed in.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const calculateCounts = async () => {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        const requestsRef = collection(db, "requests");
        const testimoniesRef = collection(db, "testimonies");

        try {
          // Count how many documents in requests and testimonies have the current user's UID in their prayers field
          const userPrayersQueryRequests = query(
            requestsRef,
            where("prayers", "array-contains", userId)
          );
          const userPrayersQueryTestimonies = query(
            testimoniesRef,
            where("prayers", "array-contains", userId)
          );

          const [userPrayersSnapshotRequests, userPrayersSnapshotTestimonies] =
            await Promise.all([
              getDocs(userPrayersQueryRequests),
              getDocs(userPrayersQueryTestimonies),
            ]);

          setUserPrayersCount(
            userPrayersSnapshotRequests.size +
              userPrayersSnapshotTestimonies.size
          );

          // Count how many documents in requests have other users' UID in their prayers field
          const othersPrayersQuery = query(
            requestsRef,
            where("prayers", "array-contains", userId)
          );
          const othersPrayersSnapshot = await getDocs(othersPrayersQuery);
          setOthersPrayersCount(othersPrayersSnapshot.size);

          // Count how many documents in requests and testimonies have the current user's UID in their praises field
          const userPraisedQueryRequests = query(
            requestsRef,
            where("prayers", "array-contains", userId)
          );
          const userPraisedQueryTestimonies = query(
            testimoniesRef,
            where("prayers", "array-contains", userId)
          );

          const [userPraisedSnapshotRequests, userPraisedSnapshotTestimonies] =
            await Promise.all([
              getDocs(userPraisedQueryRequests),
              getDocs(userPraisedQueryTestimonies),
            ]);

          setUserPraisedCount(
            userPraisedSnapshotRequests.size +
              userPraisedSnapshotTestimonies.size
          );

          // Count how many documents in requests have other users' UID in their praises field
          const othersPraisedQuery = query(
            requestsRef,
            where("prayers", "array-contains", userId)
          );
          const othersPraisedSnapshot = await getDocs(othersPraisedQuery);
          setOthersPraisedCount(othersPraisedSnapshot.size);
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          }
        } finally {
          setLoading(false);
        }
      }
    };

    calculateCounts();
  }, []);

  // Show loading indicator while fetching data
  if (loading) {
    return <p>Loading...</p>;
  }

  // Handle errors (optional)
  if (error) {
    return <p>Error: {error}</p>;
  }

  // If the user data hasn't been fetched yet, don't render the SetupUser component prematurely
  if (!userData) {
    return <p>Loading...</p>;
  }

  if (!userData.isUserId) {
    return (
      <SetupUser
        setActiveButton={setActiveButton}
      />
    );
  }

  return (
    <motion.div
      className="profile-card w-screen rounded-2xl border-2 justify-center items-center border-blk1 flex flex-col p-8"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, originY: 0 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 40 }}
    >
      <div className="relative w-44 h-44 rounded-full overflow-hidden">
        <Image
          src={userData?.img || "/dp.png"}
          alt="User DP"
          layout="fill" // Fills the container
          objectFit="cover" // Ensures the image covers the container
          className="rounded-full"
        />
      </div>
      <h2 className="text-center text-white text-4xl font-semibold mb-2 mt-4">
        {userData.displayName || "User"}
      </h2>
      <p className="text-center text-gray-300 text-base font-semibold mb-4">
        @{userData.userID}
      </p>
      <p className="text-center text-purp text-sm font-semibold mb-4">
        {userPrayersCount} Prayers Received
        <RiArrowLeftDownLine className="inline-block ml-1 " /> |{" "}
        {othersPrayersCount} Prayers Sent
        <MdArrowOutward className="inline-block ml-1" />{" "}
      </p>

      {/* <p className="text-center text-coral text-sm font-semibold mb-4">
        {userPraisedCount} Praised | {othersPraisedCount} You Praised
      </p> */}

      <div className="flex items-center gap-8">
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
            profileActiveButton === "Testimonies" ? "border-b-2 border-coral" : ""
          }`}
          onClick={() => setProfileActiveButton("Testimonies")}
        >
          Testimonies
        </button>
      </div>

      {profileActiveButton === "Requests" ? (
        <CardBento collectionName="requests" filterByCurrentUser={true} />
      ) : (
        <CardBento collectionName="testimonies" filterByCurrentUser={true} />
      )}
    </motion.div>
  );
};

export default ProfileCard;
