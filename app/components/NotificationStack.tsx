import React, { useContext, useEffect, useState } from "react";
import NotificationCard from "./NotificationCard";
import { motion } from "framer-motion";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  doc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase/config";
import { RiArrowLeftDownLine } from "react-icons/ri";
import { useNotifications } from "@/app/context/NotificationContext"; // Import the context hook

interface Notification {
  docId: string;
  uid: string;
  notificationTimestamp: Timestamp;
  type: string;
}

type Prayer = {
  id: any;
  uid: string;
  time?: Timestamp;
};

const todayStart = new Date();
todayStart.setHours(0, 0, 0, 0);
const todayStartTimestamp = Timestamp.fromDate(todayStart);

const yesterdayStart = new Date();
yesterdayStart.setDate(yesterdayStart.getDate() - 1);
yesterdayStart.setHours(0, 0, 0, 0);
const yesterdayStartTimestamp = Timestamp.fromDate(yesterdayStart);

const categorizeNotifications = (notifications: Notification[]) => {
  const today: Notification[] = [];
  const yesterday: Notification[] = [];
  const others: Notification[] = [];

  notifications.forEach((notification) => {
    const { notificationTimestamp } = notification;

    if (notificationTimestamp && notificationTimestamp.toMillis) {
      const timestampMillis = notificationTimestamp.toMillis();

      if (timestampMillis >= todayStartTimestamp.toMillis()) {
        today.push(notification);
      } else if (timestampMillis >= yesterdayStartTimestamp.toMillis()) {
        yesterday.push(notification);
      } else {
        others.push(notification);
      }
    } else {
      console.warn("Invalid notificationTimestamp:", notification);
    }
  });

  today.sort(
    (a, b) =>
      b.notificationTimestamp.toMillis() - a.notificationTimestamp.toMillis()
  );
  yesterday.sort(
    (a, b) =>
      b.notificationTimestamp.toMillis() - a.notificationTimestamp.toMillis()
  );
  others.sort(
    (a, b) =>
      b.notificationTimestamp.toMillis() - a.notificationTimestamp.toMillis()
  );

  return { today, yesterday, others };
};

const NotificationStack = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        try {
          
          const requestsQuery = query(
            collection(db, "requests"),
            where("uid", "==", user.uid)
          );

          const [requestsSnapshot] = await Promise.all([
            getDocs(requestsQuery),
          ]);

          const initialRequests = requestsSnapshot.docs.map((doc) => ({
            docId: doc.id,
            prayers: doc.data().prayers as Prayer[], // Ensure this is an array of maps
            type: "requests",
          }));

          // Combine all notifications
          const initialNotifications = [
            ...initialRequests.flatMap((request) =>
              request.prayers.map((prayer) => ({
                docId: request.docId,
                uid: prayer.uid,
                notificationTimestamp: prayer.time as Timestamp,
                type: "requests",
              }))
            ),
          ];

          setNotifications(initialNotifications);
        
          // Update isViewed to true for all prayers
          const batch = writeBatch(db);

          initialRequests.forEach((request) => {
            if (Array.isArray(request.prayers)) {
              // Ensure prayers is an array
              const updatedPrayers = request.prayers.map(
                (p) => ({ ...p, isViewed: true }) // Update isViewed field
              );
              const requestRef = doc(db, "requests", request.docId);
              batch.update(requestRef, { prayers: updatedPrayers });
            } else {
              console.warn(
                `Expected prayers to be an array, got: ${typeof request.prayers}`
              );
            }
          });

          await batch.commit();
        } catch (error) {
          console.error("Error fetching notifications:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchNotifications();
  }, [user]);

  const { today, yesterday, others } = categorizeNotifications(notifications);

  return (
    <div className="flex flex-col">
      {today.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-2 mt-4">
            <h2 className="text-left text-white text-xs lg:text-base font-semibold">
              Today
            </h2>
            <h2 className="text-right text-white text-xs lg:text-base font-semibold">
              Prayers Received{" "}
              <span>
                <RiArrowLeftDownLine className="text-white inline-block mr-1 size-5" />
              </span>
              <span className="text-purp">({today.length})</span>
            </h2>
          </div>
          {today.map((notification) => (
            <motion.div
              key={
                notification.uid + notification.notificationTimestamp.toMillis()
              }
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                originY: 0,
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 40 }}
            >
              <NotificationCard
                uid={notification.uid}
                type={notification.type}
                notificationTimestamp={notification.notificationTimestamp}
                docId={notification.docId}
              />
            </motion.div>
          ))}
        </>
      )}
      {yesterday.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-2 mt-4">
            <h2 className="text-left text-white text-xs lg:text-base font-semibold">
              Yesterday
            </h2>
            <h2 className="text-right text-white text-xs lg:text-base font-semibold">
              Prayers Received{" "}
              <span>
                <RiArrowLeftDownLine className="text-white inline-block mr-1 size-5" />
              </span>
              <span className="text-purp">({yesterday.length})</span>
            </h2>
          </div>
          {yesterday.map((notification) => (
            <motion.div
              key={
                notification.uid + notification.notificationTimestamp.toMillis()
              }
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                originY: 0,
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 40 }}
            >
              <NotificationCard
                uid={notification.uid}
                type={notification.type}
                notificationTimestamp={notification.notificationTimestamp}
                docId={notification.docId}
              />
            </motion.div>
          ))}
        </>
      )}
      {others.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-2 mt-4">
            <h2 className="text-left text-white text-xs lg:text-base font-semibold">
              Older
            </h2>
            <h2 className="text-right text-white text-xs lg:text-base font-semibold">
              Prayers Received{" "}
              <span>
                <RiArrowLeftDownLine className="text-white inline-block mr-1 size-5" />
              </span>
              <span className="text-purp">({others.length})</span>
            </h2>
          </div>
          {others.map((notification) => (
            <motion.div
              key={
                notification.uid + notification.notificationTimestamp.toMillis()
              }
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                originY: 0,
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 40 }}
            >
              <NotificationCard
                uid={notification.uid}
                type={notification.type}
                notificationTimestamp={notification.notificationTimestamp}
                docId={notification.docId}
              />
            </motion.div>
          ))}
        </>
      )}
    </div>
  );
};

export default NotificationStack;
