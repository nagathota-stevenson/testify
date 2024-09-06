import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  collection,
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  getDocs,
  query,
  QuerySnapshot,
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

const ProfileCard: React.FC<{ setActiveButton: (button: string) => void }> = ({
  setActiveButton,
}) => {
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
          // Fetch documents from requests and testimonies
          const requestsSnapshot = await getDocs(requestsRef);
          const testimoniesSnapshot = await getDocs(testimoniesRef);
  
          let userPrayersCount = 0;
          let othersPrayersCount = 0;
          let userPraisedCount = 0;
          let othersPraisedCount = 0;
  
          // Function to count documents with userId in prayers array
          const countUserPrayers = (snapshot: QuerySnapshot<DocumentData>) => {
            let count = 0;
            snapshot.forEach((doc: DocumentSnapshot<DocumentData>) => {
              const prayers = doc.data()?.prayers || [];
              const hasUserPrayed = prayers.some((prayer: { uid: string }) => prayer.uid === userId);
              if (hasUserPrayed) count++;
            });
            return count;
          };
  
          // Function to count documents with other users' uid in prayers array
          const countOthersPrayers = (snapshot: QuerySnapshot<DocumentData>) => {
            let count = 0;
            snapshot.forEach((doc: DocumentSnapshot<DocumentData>) => {
              const prayers = doc.data()?.prayers || [];
              const hasOtherPrayed = prayers.some((prayer: { uid: string }) => prayer.uid !== userId);
              if (hasOtherPrayed) count++;
            });
            return count;
          };
  
          // Count user prayers and praised counts
          userPrayersCount += countUserPrayers(requestsSnapshot);
          userPrayersCount += countUserPrayers(testimoniesSnapshot);
  
          // Count others' prayers
          othersPrayersCount += countOthersPrayers(requestsSnapshot);
          othersPrayersCount += countOthersPrayers(testimoniesSnapshot);
  
          // Similar counting logic for praised if applicable
          const countUserPraised = (snapshot: QuerySnapshot<DocumentData>) => {
            let count = 0;
            snapshot.forEach((doc: DocumentSnapshot<DocumentData>) => {
              const praises = doc.data()?.praises || [];
              const hasUserPraised = praises.some((praise: { uid: string }) => praise.uid === userId);
              if (hasUserPraised) count++;
            });
            return count;
          };
  
          userPraisedCount += countUserPraised(requestsSnapshot);
          userPraisedCount += countUserPraised(testimoniesSnapshot);
  
          // Count others' praised counts if needed
          othersPraisedCount += countUserPraised(requestsSnapshot);
          othersPraisedCount += countUserPraised(testimoniesSnapshot);
  
          setUserPrayersCount(userPrayersCount);
          setOthersPrayersCount(othersPrayersCount);
          setUserPraisedCount(userPraisedCount);
          setOthersPraisedCount(othersPraisedCount);
  
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
    return <SetupUser setActiveButton={setActiveButton} />;
  }

  return (
    <motion.div
      className="profile-card w-screen rounded-2xl border-2 justify-center items-center border-blk1 flex flex-col p-8"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, originY: 0 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 40 }}
    >
      <div className="relative size-24 lg:size-40 rounded-full overflow-hidden">
        <Image
          src={userData?.img || "/dp.png"}
          alt="User DP"
          layout="fill" // Fills the container
          objectFit="cover" // Ensures the image covers the container
          className="rounded-full"
        />
      </div>
      <h2 className="text-center text-white text-xl lg:text-4xl font-semibold mb-2 mt-4">
        {userData.displayName || "User"}
      </h2>
      <p className="text-center text-gray-300 text-sm lg:text-base font-semibold mb-4">
        @{userData.userID}
      </p>
      <p className="text-center text-purp text-xs lg:text-base font-semibold mb-4">
      {othersPrayersCount} Prayers Received
        <RiArrowLeftDownLine className="inline-block ml-1 " /> |{" "}
        {userPrayersCount} Prayers Sent
        <MdArrowOutward className="inline-block ml-1" />{" "}
      </p>

      {/* <p className="text-center text-coral text-sm font-semibold mb-4">
        {userPraisedCount} Praised | {othersPraisedCount} You Praised
      </p> */}

      <div className="flex items-center text-xs lg:text-base gap-8">
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

      {profileActiveButton === "Requests" ? (
        <CardBento collectionName="requests" filterByCurrentUser={true} />
      ) : (
        <CardBento collectionName="testimonies" filterByCurrentUser={true} />
      )}
    </motion.div>
  );
};

export default ProfileCard;
