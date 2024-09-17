import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { Timestamp, doc, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { formatTimeDifference } from "../constants";
import { AuthContext } from "../context/AuthContext";

// Define the types for the props
interface NotificationCardProps {
  uid: string;
  type: string; // Adjust 'other' if you have different types
  notificationTimestamp: Timestamp;
  docId: string;
}

// Define the structure of user details
interface UserDetails {
  img?: string;
  displayName?: string;
}

// Define the structure of request details
interface RequestDetails {
  req: string;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  uid,
  type,
  notificationTimestamp,
  docId,
}) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [requestText, setRequestText] = useState<string>("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDocRef = doc(db, "users", uid);
        const docSnapshot = await getDoc(userDocRef);

        if (docSnapshot.exists()) {
          setUserDetails(docSnapshot.data() as UserDetails);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [uid]);

  useEffect(() => {
    const fetchRequestDetails = async () => {
      if (type === "requests" && docId) {
        try {
          const requestDocRef = doc(db, "requests", docId);
          const docSnapshot = await getDoc(requestDocRef);

          if (docSnapshot.exists()) {
            const data = docSnapshot.data() as RequestDetails;
            setRequestText(data.req);
          } else {
            console.error("No such document!");
          }
        } catch (error) {
          console.error("Error fetching request details:", error);
        }
      }

      if (type === "testimonies" && docId) {
        try {
          const requestDocRef = doc(db, "testimonies", docId);
          const docSnapshot = await getDoc(requestDocRef);

          if (docSnapshot.exists()) {
            const data = docSnapshot.data() as RequestDetails;
            setRequestText(data.req);
          } else {
            console.error("No such document!");
          }
        } catch (error) {
          console.error("Error fetching request details:", error);
        }
      }
    };

    fetchRequestDetails();
  }, [type, docId]);

  const now = Timestamp.now();
  const cardShadow =
    type === "requests" ? "shadow-custom-purple" : "shadow-custom-coral";

  const textColor = type === "requests" ? "text-purp" : "text-coral";

  return (
    <div
      className={`bg-white w-[400px] md:w-[400px] lg:w-[600px] p-4 border-2 border-blk1 rounded-2xl flex items-center ${cardShadow} mb-8 hover:scale-[1.05] duration-300 transition-transform:ease`}
    >
      {userDetails?.img ? (
        <Image
          src={userDetails.img}
          width={64}
          height={64}
          className="rounded-full aspect-square object-cover"
          alt="User Image"
        />
      ) : (
        <div className="rounded-full w-28 flex items-center justify-center">
          <span className="text-gray-200 text-sm">#</span>
        </div>
      )}

      <div className="flex flex-col">
        <h3 className="text-blk1 text-wrap text-xs lg:text-base line-clamp-2 ml-2 mr-2">
          <span className={`${textColor}`}>
            {userDetails?.displayName || "Unknown"} {/* Placeholder for name */}
          </span>
          {type === "requests"
            ? " has prayed for you."
            : " has praised God for you."}
        </h3>
        <h5 className="text-gray-400 text-[10px] lg:text-xs text-wrap line-clamp-2 ml-2 mr-2">
          {requestText || "No additional text available."}{" "}
          {/* Placeholder for requestText */}
        </h5>
      </div>

      <h4 className="text-gray-400 text-xs lg:text-base ml-auto mr-2">
        {notificationTimestamp
          ? formatTimeDifference(notificationTimestamp, now)
          : "Unknown Time"}{" "}
        {/* Placeholder for time */}
      </h4>
    </div>
  );
};

export default NotificationCard;
