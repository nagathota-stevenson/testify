import React, { useEffect, useState, useContext } from "react";
import {
  collection,
  getDocs,
  doc as firestoreDoc,
  getDoc,
  query,
  where,
  CollectionReference,
  Query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/app/firebase/config";
import Card from "../components/Card";
import { AuthContext } from "@/app/context/AuthContext";
import "./RequestsPage.css";
import { AnimatedList } from "../components/magicui/animated-list";
import { AnimatePresence, motion } from "framer-motion";

type Request = {
  id: string;
  uid: string;
  req: string;
  time: any; // Use 'firebase.firestore.Timestamp' if using Firestore Timestamp
  prayers: any; // Assuming this is an array of prayer IDs or similar
};

type User = {
  displayName: string;
  img: string;
  userID: string;
};

type CardBentoProps = {
  collectionName: "requests" | "testimonies";
  filterByCurrentUser?: boolean;
  homePage?: boolean;
};

const CardBento: React.FC<CardBentoProps> = ({
  collectionName,
  filterByCurrentUser,
  homePage,
}) => {
  const [items, setItems] = useState<(Request & User)[]>([]);
  const { user, userDetails } = useContext(AuthContext);
  const animations = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, originY: 0 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: "spring", stiffness: 350, damping: 40 },
  };

  useEffect(() => {
    // Build base query
    const baseCollectionRef = collection(
      db,
      collectionName
    ) as CollectionReference<Request>;
    let collectionQuery: Query<Request> = baseCollectionRef;

    if (filterByCurrentUser) {
      collectionQuery = query(collectionQuery, where("uid", "==", user.uid));
    }

    collectionQuery = query(collectionQuery, orderBy("time", "desc"));

    // Set up a real-time listener
    const unsubscribe = onSnapshot(collectionQuery, async (snapshot) => {
      console.log("Snapshot received:", snapshot); // Debugging line
      const itemsList: (Request & User)[] = await Promise.all(
        snapshot.docs.map(async (itemDocument) => {
          const itemData = itemDocument.data() as Request;
          const userDocRef = firestoreDoc(db, "users", itemData.uid);
          const userDoc = await getDoc(userDocRef);

          let userData: User = {
            displayName: "Unknown User",
            img: "/default-user.png",
            userID: "",
          };

          if (userDoc.exists()) {
            userData = userDoc.data() as User;
          }

          return {
            ...itemData,
            ...userData,
            id: itemDocument.id,
          };
        })
      );

      console.log("Items list:", itemsList); // Debugging line
      setItems(itemsList);
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, [collectionName, filterByCurrentUser, user]);

  return (
    <section
      className={`bg-blk1 w-screen h-screen flex items-start pb-24 p-4 justify-center ${
        homePage ? "pt-24" : "pt-4"
      }`}
    >
      <AnimatePresence>
        <div className="lg:columns-3 sm:columns-2 row-auto gap-8 p-4">
          {items.map((item) => (
            <motion.div className="mb-8" key={item.id} {...animations}>
              <Card
                userImage={item.img || "/default-user.png"}
                userName={item.displayName}
                userHandle={`@${item.userID}`}
                prayerDate={new Date(item.time.seconds * 1000).toLocaleString(
                  "en-US"
                )}
                prayerRequest={item.req}
                prayersCount={`${item.prayers.length}`}
                prayers={item.prayers}
                type={collectionName}
                docId={item.id}
                isUser={filterByCurrentUser}
                uid={userDetails?.uid}
              />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </section>
  );
};

export default CardBento;
