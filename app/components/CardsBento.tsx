'use client';
import React, { useState, useEffect, useContext, useCallback, useMemo, memo } from "react";
import { db } from "@/app/firebase/config";
import {
  doc,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  collection,
  getDocs,
} from "firebase/firestore";
import { AuthContext } from "@/app/context/AuthContext";
import Card from "../components/Card";
import { AnimatePresence, motion } from "framer-motion";
import { Masonry } from "react-plock"

const GridCard: React.FC<{
  data: Request & User;
  onDelete: (docId: string) => void;
  isUser: boolean;
  uid?: string;
  ownerId?: string;
  isHomePage?: boolean;
  isAnonymous?: boolean;
// eslint-disable-next-line react/display-name
}> = memo(({ data, onDelete, isUser, uid, ownerId, isAnonymous, isHomePage }) => (
  <motion.div
    key={data.id}
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1, originY: 0 }}
    exit={{ scale: 0, opacity: 0 }}
    transition={{ type: "spring", stiffness: 350, damping: 40 }}
    className="p-[4px]"
  >
    <Card
      userImage={data.img || "/default-user.png"}
      userName={data.displayName}
      userHandle={`@${data.userID}`}
      prayerDate={new Date(data.time.seconds * 1000).toLocaleString("en-US")}
      prayerRequest={data.req}
      prayersCount={`${data.prayers.length}`}
      prayers={data.prayers}
      type={data.type}
      docId={data.id}
      isUser={isUser}
      isHomePage={isHomePage}
      uid={uid}
      isAnonymous={isAnonymous}
      ownerId={ownerId}
      onDelete={onDelete}
    />
  </motion.div>
));

type Request = {
  id: string;
  uid: string;
  type: "req" | "tes";
  req: string;
  isAnonymous: boolean;
  time: any; // Firestore Timestamp
  prayers: any[]; // Array of prayer data
};

type User = {
  displayName: string;
  img: string;
  userID: string;
};

type CardBentoProps = {
  filterByType?: "req" | "tes" | "all";
  filterByCurrentUser: boolean;
  filterByUserId?: string;
  homePage?: boolean;
};

const CardBento: React.FC<CardBentoProps> = ({
  filterByType,
  filterByCurrentUser,
  filterByUserId,
  homePage,
}) => {
  const [items, setItems] = useState<(Request & User)[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { user, userDetails } = useContext(AuthContext);

  const fetchItems = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      let collectionQuery = query(
        collection(db, "requests"),
        orderBy("time", "desc"),
        limit(9)
      );

      if (filterByType && filterByType !== "all") {
        collectionQuery = query(
          collectionQuery,
          where("type", "==", filterByType)
        );
      }

      if (filterByCurrentUser && user?.uid) {
        collectionQuery = query(collectionQuery, where("uid", "==", user.uid));
      }

      if (filterByUserId) {
        collectionQuery = query(
          collectionQuery,
          where("uid", "==", filterByUserId)
        );
      }

      if (page > 1) {
        const lastVisibleDoc =
          items.length > 0 ? items[items.length - 1].id : null;
        if (lastVisibleDoc) {
          const lastVisibleSnapshot = await getDoc(
            doc(db, "requests", lastVisibleDoc)
          );
          collectionQuery = query(
            collectionQuery,
            startAfter(lastVisibleSnapshot)
          );
        }
      }

      const snapshot = await getDocs(collectionQuery);

      if (snapshot.empty) {
        setHasMore(false);
        return;
      }

      const newItems: (Request & User)[] = await Promise.all(
        snapshot.docs.map(async (itemDocument) => {
          const itemData = itemDocument.data() as Request;
          const userDoc = await getDoc(doc(db, "users", itemData.uid));
          return {
            ...itemData,
            ...(userDoc.exists()
              ? (userDoc.data() as User)
              : {
                  displayName: "Unknown User",
                  img: "/default-user.png",
                  userID: "",
                }),
            id: itemDocument.id,
          };
        })
      );



      setItems((prevItems) => {
        const existingIds = new Set(prevItems.map((item) => item.id));
        const filteredNewItems = newItems.filter(
          (item) => !existingIds.has(item.id)
        );
        return [...prevItems, ...filteredNewItems];
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    loading,
    filterByType,
    filterByCurrentUser,
    user?.uid,
    filterByUserId,
    page,
  ]);

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage > 0 && (hasMore || newPage > page)) {
      setPage(newPage);
    }
  }, [hasMore, page]);

  const handleDelete = useCallback((docId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== docId));
  }, []);

  const filteredItems = useMemo(() => 
    items.filter(item => !(item.isAnonymous && !homePage && !filterByCurrentUser)),
    [items, homePage, filterByCurrentUser]
  );

  return (
    <section
      className={`bg-blk1 w-screen h-screen mb-8 flex flex-col items-center justify-between pb-24 p-4 ${
        homePage ? "pt-32" : "pt-4"
      }`}
    >
      {filteredItems.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <AnimatePresence>
          <Masonry
            items={items}
            config={{
              columns: [1, 2, 3],
              gap: [24, 24, 24],
              media: [640, 768, 1024],
            }}
            render={(item, idx) => (
              <GridCard
                key={item.id}
                data={item}
                onDelete={handleDelete}
                isUser={filterByCurrentUser}
                uid={userDetails?.uid}
                ownerId={item.uid}
                isHomePage={homePage}
                isAnonymous={item.isAnonymous}
              />
            )}
          />
        </AnimatePresence>
      )}
      {hasMore &&  (
        <div className="pagination-controls p-8">
          <button
            onClick={() => handlePageChange(page + 1)}
            className={`border-2 rounded-2xl py-[10px] text-white transition-all duration-300  p-4 ${
              filterByType === "req"
                ? "hover:bg-purp hover:border-purp"
                : filterByType === "tes"
                ? "hover:bg-coral hover:border-coral"
                : filterByType === "all"
                ? "hover:bg-white hover:text-blk1"
                : "hover:bg-gray"
            }`}
          >
            Load More
          </button>
        </div>
      )}
      <div className="p-4">

      </div>
    </section>
  );
};

export default CardBento;
