"use client";

import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import {
  onSnapshot,
  collection,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/config"; // Adjust the path to your Firebase config
import { AuthContext } from "../context/AuthContext"; // Import AuthContext for user information

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [newNotificationsCount, setNewNotificationsCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const { user } = useContext(AuthContext);
  const audioRef = useRef(null);

  useEffect(() => {
    if (user) {
      const requestsQuery = query(
        collection(db, "requests"),
        where("uid", "==", user.uid)
      );
      const testimoniesQuery = query(
        collection(db, "testimonies"),
        where("uid", "==", user.uid)
      );

      const unsubscribeRequests = onSnapshot(requestsQuery, (snapshot) => {
        const newRequests = snapshot.docs.map((doc) => ({
          docId: doc.id,
          prayers: doc.data().prayers,
          type: "requests",
        }));

        // Filter out prayers where isViewed is false
        const newNotifications = newRequests.flatMap((request) =>
          request.prayers
            .filter((prayer) => !prayer.isViewed) // Filter out viewed prayers
            .map((prayer) => ({
              docId: request.docId,
              uid: prayer.uid,
              notificationTimestamp: prayer.time,
              type: "requests",
            }))
        );

        if (newNotifications.length > 0) {
          if (audioRef.current) {
            audioRef.current.play();
          }
        }


        setNotifications((prev) => {
          const updatedNotifications = [
            ...prev.filter((n) => n.type !== "requests"),
            ...newNotifications,
          ];
          setNewNotificationsCount(newNotifications.length);
          return updatedNotifications;
        });
      });

      return () => {
        unsubscribeRequests();
      };
    }
  }, [user]);

  return (
    <NotificationsContext.Provider
      value={{ newNotificationsCount, setNewNotificationsCount, notifications }}
    >
      {children}
      <audio ref={audioRef} src="/pop.mp3"  />
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return context;
};
