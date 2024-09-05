import React, { useContext, useEffect, useState } from "react";
import PullToRefresh from "react-pull-to-refresh";
import NotificationCard from "./NotificationCard";
import { AnimatedList } from "./magicui/animated-list";
import {
  collection,
  getDocs,
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
  type: "requests" | "testimonies";
}

type Prayer = {
  uid: string;
  time?: Timestamp;
};

const now = Date.now();
const fifteenMinutesAgo = now - 15 * 60 * 1000;
const randomTimestamp = Timestamp.fromMillis(fifteenMinutesAgo);

const todayStart = new Date();
todayStart.setHours(0, 0, 0, 0);
const todayStartTimestamp = Timestamp.fromDate(todayStart);

const yesterdayStart = new Date();
yesterdayStart.setDate(yesterdayStart.getDate() - 1);
yesterdayStart.setHours(0, 0, 0, 0);
const yesterdayStartTimestamp = Timestamp.fromDate(yesterdayStart);

const convertToNotifications = (
  data: any[],
  currentUserId: string
): Notification[] => {
  const notifications: Notification[] = [];

  data.forEach((item) => {
    const { docId, prayers, type } = item;

    prayers.forEach((prayer: any) => {
      if (typeof prayer === "object" && prayer.uid && prayer.time) {
        const notification: Notification = {
          docId,
          uid: prayer.uid,
          notificationTimestamp: new Timestamp(
            prayer.time.seconds,
            prayer.time.nanoseconds
          ),
          type,
        };
        notifications.push(notification);
      }
    });
  });

  return notifications
    .filter((notification) => notification.uid !== currentUserId)
    .sort(
      (a, b) =>
        b.notificationTimestamp.toMillis() - a.notificationTimestamp.toMillis()
    );
};

const categorizeNotifications = (notifications: Notification[]) => {
  const today: Notification[] = [];
  const yesterday: Notification[] = [];
  const others: Notification[] = [];

  notifications.forEach((notification) => {
    const { notificationTimestamp } = notification;
    const timestampMillis = notificationTimestamp.toMillis();

    if (timestampMillis >= todayStartTimestamp.toMillis()) {
      today.push(notification);
    } else if (timestampMillis >= yesterdayStartTimestamp.toMillis()) {
      yesterday.push(notification);
    } else {
      others.push(notification);
    }
  });

  return { today, yesterday, others };
};

const NotificationStack = () => {
  const { user, userDetails } = useContext(AuthContext);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        try {
          const requestsQuery = query(
            collection(db, "requests"),
            where("uid", "==", user.uid)
          );
          const testimoniesQuery = query(
            collection(db, "testimonies"),
            where("uid", "==", user.uid)
          );

          const [requestsSnapshot, testimoniesSnapshot] = await Promise.all([
            getDocs(requestsQuery),
            getDocs(testimoniesQuery),
          ]);

          const requests = requestsSnapshot.docs.map((doc) => ({
            docId: doc.id,
            prayers: doc.data().prayers as Prayer[],
            type: "requests",
          })) as [];

          const testimonies = testimoniesSnapshot.docs.map((doc) => ({
            docId: doc.id,
            prayers: doc.data().prayers as Prayer[],
            type: "testimonies",
          })) as [];

          const allNotifications = [...requests, ...testimonies];

          setNotifications(allNotifications);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchNotifications();
    }
  }, [user]);

  const convertedNotifications = convertToNotifications(
    notifications,
    userDetails.uid
  );

  const { today, yesterday, others } = categorizeNotifications(convertedNotifications);

  return (
    <AnimatedList className="flex flex-col">
      {today.length > 0 && (
        <>
          <h2 className="text-left text-white text-base font-semibold mb-2 mt-4">
            Today
          </h2>
          {today.map((notification) => (
            <NotificationCard
              key={notification.uid + notification.notificationTimestamp.toMillis()}
              uid={notification.uid}
              type={notification.type}
              notificationTimestamp={notification.notificationTimestamp}
              docId={notification.docId}
            />
          ))}
        </>
      )}
      {yesterday.length > 0 && (
        <>
          <h2 className="text-left text-white text-base font-semibold mb-2 mt-4">
            Yesterday
          </h2>
          {yesterday.map((notification) => (
            <NotificationCard
              key={notification.uid + notification.notificationTimestamp.toMillis()}
              uid={notification.uid}
              type={notification.type}
              notificationTimestamp={notification.notificationTimestamp}
              docId={notification.docId}
            />
          ))}
        </>
      )}
      {others.length > 0 && (
        <>
          <h2 className="text-left text-white text-base font-semibold mb-2 mt-4">
            Others
          </h2>
          {others.map((notification) => (
            <NotificationCard
              key={notification.uid + notification.notificationTimestamp.toMillis()}
              uid={notification.uid}
              type={notification.type}
              notificationTimestamp={notification.notificationTimestamp}
              docId={notification.docId}
            />
          ))}
        </>
      )}
    </AnimatedList>
  );
};

export default NotificationStack;
