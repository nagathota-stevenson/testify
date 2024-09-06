import React, { useContext, useEffect, useState } from "react";
import NotificationCard from "./NotificationCard";
import { motion } from "framer-motion";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase/config";

interface Notification {
  docId: string;
  uid: string;
  notificationTimestamp: Timestamp;
  type: string;
}

type Prayer = {
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

  // Sort notifications by timestamp within each category
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

const NotificationStack = ({}) => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newNotificationIds, setNewNotificationIds] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(true);

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

      const fetchNotifications = async () => {
        try {
          const [requestsSnapshot, testimoniesSnapshot] = await Promise.all([
            getDocs(requestsQuery),
            getDocs(testimoniesQuery),
          ]);

          const initialRequests = requestsSnapshot.docs.map((doc) => ({
            docId: doc.id,
            prayers: doc.data().prayers as Prayer[],
            type: "requests",
          }));

          const initialTestimonies = testimoniesSnapshot.docs.map((doc) => ({
            docId: doc.id,
            prayers: doc.data().prayers as Prayer[],
            type: "testimonies",
          }));

          const initialNotifications = [
            ...initialRequests.flatMap((request) =>
              request.prayers.map((prayer) => ({
                docId: request.docId,
                uid: prayer.uid,
                notificationTimestamp: prayer.time as Timestamp,
                type: "requests",
              }))
            ),
            ...initialTestimonies.flatMap((testimony) =>
              testimony.prayers.map((prayer) => ({
                docId: testimony.docId,
                uid: prayer.uid,
                notificationTimestamp: prayer.time as Timestamp,
                type: "testimonies",
              }))
            ),
          ];

          setNotifications(initialNotifications);
          setNewNotificationIds(
            new Set(initialNotifications.map((n) => n.docId))
          );

          const unsubscribeRequests = onSnapshot(requestsQuery, (snapshot) => {
            const requestNotifications = snapshot.docs.flatMap((doc) => {
              const request = {
                docId: doc.id,
                prayers: doc.data().prayers as Prayer[],
                type: "requests",
              };

              return request.prayers.map((prayer) => ({
                docId: request.docId,
                uid: prayer.uid,
                notificationTimestamp: prayer.time as Timestamp,
                type: "requests",
              }));
            });

            setNotifications((prev) => {
              const newNotifications = [
                ...prev.filter((n) => n.type !== "requests"),
                ...requestNotifications,
              ];
              setNewNotificationIds(
                new Set(requestNotifications.map((n) => n.docId))
              );
              return newNotifications;
            });
          });

          const unsubscribeTestimonies = onSnapshot(
            testimoniesQuery,
            (snapshot) => {
              const testimonyNotifications = snapshot.docs.flatMap((doc) => {
                const testimony = {
                  docId: doc.id,
                  prayers: doc.data().prayers as Prayer[],
                  type: "testimonies",
                };

                return testimony.prayers.map((prayer) => ({
                  docId: testimony.docId,
                  uid: prayer.uid,
                  notificationTimestamp: prayer.time as Timestamp,
                  type: "testimonies",
                }));
              });

              setNotifications((prev) => {
                const newNotifications = [
                  ...prev.filter((n) => n.type !== "testimonies"),
                  ...testimonyNotifications,
                ];
                setNewNotificationIds(
                  new Set(testimonyNotifications.map((n) => n.docId))
                );

                return newNotifications;
              });
            }
          );

          return () => {
            unsubscribeRequests();
            unsubscribeTestimonies();
          };
        } catch (error) {
          console.error("Error fetching notifications:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchNotifications();
    }
  }, [user]);

  const { today, yesterday, others } = categorizeNotifications(notifications);

  return (
    <div className="flex flex-col">
      {today.length > 0 && (
        <>
          <h2 className="text-left text-white text-xs lg:text-base font-semibold mb-2 mt-4">
            Today
          </h2>
          {today.map((notification) => (
            <motion.div
              key={
                notification.uid + notification.notificationTimestamp.toMillis()
              }
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                opacity: newNotificationIds.has(notification.docId) ? 1 : 1,
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
          <h2 className="text-left text-white text-xs lg:text-base font-semibold mb-2 mt-4">
            Yesterday
          </h2>
          {yesterday.map((notification) => (
            <motion.div
              key={
                notification.uid + notification.notificationTimestamp.toMillis()
              }
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                opacity: newNotificationIds.has(notification.docId) ? 1 : 1,
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
          <h2 className="text-left text-white text-xs lg:text-base font-semibold mb-2 mt-4">
            Others
          </h2>
          {others.map((notification) => (
            <motion.div
              key={
                notification.uid + notification.notificationTimestamp.toMillis()
              }
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                opacity: newNotificationIds.has(notification.docId) ? 1 : 1,
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
