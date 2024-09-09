import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/app/context/AuthContext"; // Adjust path as needed
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "@/app/firebase/config"; // Adjust path as needed
import Image from "next/image"; // Adjust path if using different library
import { RiArrowDropDownLine, RiLoader4Line } from "react-icons/ri";
import { FaCheckCircle } from "react-icons/fa";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Filter } from "bad-words";
import "./EditCard.css";

interface EditCardProps {
  docId: string;
  type: "req" | "tes"; // Corresponds to 'request' or 'testimony' in the type field
}

const EditCard: React.FC<EditCardProps> = ({ docId, type }) => {
  const { userDetails } = useContext(AuthContext);
  const [activeButton, setActiveButton] = useState(
    type === "req" ? "request" : "testimony"
  );
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [posted, setPosted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const controls = useAnimation();
  const filter = new Filter();

  useEffect(() => {
    controls.start({ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.9 });
  }, [isOpen]);

  useEffect(() => {
    const fetchDocument = async () => {
      if (docId) {
        const docRef = doc(db, "requests", docId); // Always fetching from 'requests' collection
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const docData = docSnap.data();
            setInputText(
              docData.type === "req" ? docData.req : docData.praise || ""
            );
            setActiveButton(docData.type === "req" ? "request" : "testimony");
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching document: ", error);
        }
      }
    };

    fetchDocument();
  }, [docId]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = (button: "request" | "testimony") => {
    setActiveButton(button);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handlePost = async () => {
    if (!inputText.trim()) {
      alert("Please enter some text before posting.");
      return;
    }

    const cleanedText = filter.clean(inputText);

    setLoading(true);
    setPosted(false);

    const docRef = doc(
      db,
      "requests",
      docId || doc(collection(db, "requests")).id
    );

    const updateData: Record<string, any> = {
      req: cleanedText,
      uid: userDetails?.uid,
      time: serverTimestamp(),
      prayers: [], // Adjust this as needed
      type: activeButton === "request" ? "req" : "tes",
    };

    try {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, updateData);
      } else {
        await setDoc(docRef, updateData);
      }

      setTimeout(() => {
        setLoading(false);
        setPosted(true);
        setInputText("");
      }, 3000);
    } catch (error) {
      console.error("Error updating or creating document: ", error);
      alert(
        "There was an error updating or creating your content. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className={`bg-white lg:w-[500px] sm:w-[400px] rounded-2xl border-2 border-blk1 flex flex-col p-8 ${
          activeButton === "request" ? "edit-card" : "edit-card-testimony"
        } relative`}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, originY: 0 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 40 }}
      >
        <div className="flex items-center mb-4">
          {userDetails?.img && (
            <Image
              src={userDetails.img}
              width={64}
              height={64}
              className="rounded-full aspect-square object-cover"
              alt="User Image"
            />
          )}
          <div className="ml-4">
            <h2 className="text-sm lg:text-lg font-semibold text-blk1">
              {userDetails?.displayName}
            </h2>
            <p className="text-xs lg:text-sm text-gray-500">
              @{userDetails?.userID}
            </p>
          </div>
        </div>
        <textarea
          maxLength={1000}
          value={inputText}
          onChange={handleInputChange}
          placeholder={
            activeButton === "request"
              ? "Write your prayer request here.."
              : "Share your inspiring testimony here.."
          }
          className="min-h-[250px] text-xs lg:text-base text-start border-gray-300 text-blk1 mb-4 focus:outline-none focus:ring-0 focus:border-purp resize-none"
        />
        <div className="relative flex items-center justify-between gap-4 text-left">
          <div className="relative">
            <button
              onClick={handleToggle}
              className="inline-flex w-36 items-center justify-between rounded-2xl border border-gray-300 shadow-sm px-4 py-2 bg-white text-xs lg:text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-300"
            >
              {activeButton === "request" ? "Request" : "Testimony"}
              <RiArrowDropDownLine className="ml-2 h-6 w-6" />
            </button>

            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={controls}
                className="absolute left-0 mt-2 w-44 rounded-2xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
              >
                <div className="py-4 shadow-md">
                  <button
                    onClick={() => handleMenuItemClick("request")}
                    className={`${
                      activeButton === "request"
                        ? "bg-purp text-white"
                        : "text-gray-700"
                    } group flex items-center px-4 py-3 text-xs lg:text-base w-full text-left hover:bg-purp hover:text-white transition-colors duration-300`}
                  >
                    Request
                  </button>
                  <button
                    onClick={() => handleMenuItemClick("testimony")}
                    className={`${
                      activeButton === "testimony"
                        ? "bg-coral text-white"
                        : "text-gray-700"
                    } group flex items-center px-4 py-3 text-xs lg:text-base w-full text-left hover:bg-coral hover:text-white transition-colors duration-300`}
                  >
                    Testimony
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          <button
            onClick={handlePost}
            disabled={loading || !inputText.trim()}
            className={`flex text-xs lg:text-base items-center justify-center w-36 px-12 py-3 rounded-2xl transition-color duration-300 ${
              loading || !inputText.trim()
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blk1 text-white hover:bg-blk2"
            }`}
          >
            {loading ? (
              <RiLoader4Line className="animate-spin w-6 h-6" />
            ) : (
              "Post"
            )}
          </button>
        </div>
        <AnimatePresence>
          {posted && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPosted(false)}
            >
              <div className="text-center flex items-center">
                
                <p className="text-xs text-blk1 lg:text-base font-semibold">Posted </p>
                <FaCheckCircle className="text-green-400 text-4xl ml-2" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditCard;
