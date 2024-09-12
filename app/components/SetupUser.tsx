"use client";
import React, { useState, useEffect } from "react";
import { auth, db, storage } from "@/app/firebase/config";
import {
  doc,
  getDoc,
  setDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FaCheckCircle } from "react-icons/fa";
import { BiSolidXCircle } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";
import _ from "lodash";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

const SetupUser = () => {
  const [displayName, setDisplayName] = useState("");
  const [userID, setUserID] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userIDError, setUserIDError] = useState<boolean | null>(null);
  const router = useRouter();


  useEffect(() => {
    const fetchUserData = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      try {
        const userDocRef = doc(db, "users", userId);
        const docSnapshot = await getDoc(userDocRef);

        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setDisplayName(data.displayName || "");
          setUserID(data.userID || "");
          setImageURL(data.img || "");
          if (data.img) {
            setProfileImagePreview(data.img);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const checkUserIDUnique = async (id: string) => {
    if (id.trim() === "") {
      setUserIDError(null);
      return;
    }

    const currentUserID = auth.currentUser?.uid;

    const q = query(
      collection(db, "users"),
      where("userID", "==", id),
      where("__name__", "!=", currentUserID) // Exclude current user's document
    );

    try {
      const querySnapshot = await getDocs(q);
      setUserIDError(!querySnapshot.empty);
    } catch (error) {
      console.error("Error checking user ID:", error);
      setUserIDError(null);
    }
  };

  const handleUserIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserID(e.target.value);
    checkUserIDUnique(e.target.value);
  };

  const debouncedCheckUserIDUnique = _.debounce(checkUserIDUnique, 500);

  useEffect(() => {
    debouncedCheckUserIDUnique(userID);
  }, [debouncedCheckUserIDUnique, userID]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file)); // Preview image
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (userIDError) {
        throw new Error("User ID is already taken.");
      }

      let url = "";

      // Handle image upload
      if (profileImage) {
        const imageRef = ref(
          storage,
          `profile_images/${auth.currentUser?.uid}`
        );
        await uploadBytes(imageRef, profileImage); // Upload the file
        url = await getDownloadURL(imageRef); // Get the download URL
        setImageURL(url); // Optionally store it in the state
      }

      // Save user data to Firestore
      const userDocRef = doc(db, "users", auth.currentUser?.uid || "");
      await setDoc(
        userDocRef,
        {
          displayName,
          userID,
          img: url || imageURL || "",
          isUserId: true,
        },
        { merge: true }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
      router.push(`/profile/${auth.currentUser?.uid}`);
    }
  };

  return (
    <motion.div
      className="login-card bg-white lg:w-[500px] sm:w-[400px] rounded-2xl border-2 self-center text-xs lg:text-base  border-blk1 flex flex-col p-8"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, originY: 0 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 40 }}
    >
      <form onSubmit={handleSave} className="flex flex-col">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-2 border-2 border-gray-300">
              {profileImagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profileImagePreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                  No Image
                </div>
              )}
            </div>
            <input
              id="profileImageInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="profileImageInput"
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-full shadow-lg cursor-pointer"
            >
              <FiEdit className="text-blk1" />
            </label>
          </div>
        </div>
        <label className="text-start text-blk1 mb-2">Display Name</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Enter Display Name"
          className="p-[12px] border-2 border-gray-300 rounded-2xl text-blk1 focus:outline-none focus:ring-0 focus:border-purp mb-4"
        />
        <label className="text-start text-blk1 mb-2">Username</label>
        <div className="relative mb-8">
          <input
            type="text"
            value={userID}
            onChange={handleUserIDChange}
            placeholder="@username"
            className="p-[12px] border-2 border-gray-300 rounded-2xl text-blk1 focus:outline-none focus:ring-0 focus:border-purp w-full pr-10"
          />
          {userIDError !== null && (
            <span className="absolute inset-y-0 right-3 flex items-center">
              {userIDError ? (
                <BiSolidXCircle className="text-red-500 size-6" />
              ) : (
                <FaCheckCircle className="text-green-500 size-5" />
              )}
            </span>
          )}
        </div>
        <button
          type="submit"
          className="bg-blk1 text-white p-[12px] border-2 border-blk1 rounded-2xl hover:bg-purp"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </motion.div>
  );
};

export default SetupUser;
