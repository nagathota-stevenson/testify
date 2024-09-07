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
import { RiArrowLeftDownLine } from "react-icons/ri";
import { MdArrowOutward } from "react-icons/md";
import "./EditCard.css";
import { AnimatePresence, motion, useAnimation } from "framer-motion";

interface EditCardProps {
  docId: string;
  type: "request" | "testimony";
}

const EditCard: React.FC<EditCardProps> = ({ docId, type }) => {
  const { userDetails } = useContext(AuthContext);
  const [activeButton, setActiveButton] = useState(type);

  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [posted, setPosted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    controls.start({ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.9 });
  }, [isOpen]);

  useEffect(() => {
    const fetchDocument = async () => {
      if (docId) {
        const collectionName =
          activeButton === "request" ? "requests" : "testimonies";
        const docRef = doc(db, collectionName, docId);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setInputText(docSnap.data()?.req || docSnap.data()?.praise || "");
          } else {
            // console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching document: ", error);
        }
      }
    };

    fetchDocument();
  }, [docId, activeButton]);

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

    setLoading(true);
    setPosted(false);

    const collectionName =
      activeButton === "request" ? "requests" : "testimonies";
    let docRef;

    try {
      // If `docId` is provided, use it; otherwise, create a new document with a unique ID
      if (docId) {
        docRef = doc(db, collectionName, docId);
      } else {
        // Create a new document with a unique ID
        docRef = doc(collection(db, collectionName));
      }

      // Create a dynamic update object
      const updateData: Record<string, any> = {
        uid: userDetails?.uid,
        time: serverTimestamp(),
        prayers: [], // Adjust this as needed
      };

      // Conditionally add fields based on the active button
      if (activeButton === "request") {
        updateData.req = inputText;
      } else if (activeButton === "testimony") {
        updateData.praise = inputText;
      }

      // Check if the document exists
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // If the document exists, update it
        await updateDoc(docRef, updateData);
      } else {
        // If the document does not exist, create it
        await setDoc(docRef, updateData);
      }

      // Set timeout to simulate loading delay
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
            <p className="text-xs lg:text-sm text-gray-500">@{userDetails?.userID}</p>
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
              className="inline-flex w-36 items-center justify-between rounded-2xl border border-gray-300 shadow-sm px-4 py-2 bg-white text-xs lg:text-base  font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-300"
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
                    } group flex items-center px-4 py-3 text-xs lg:text-base  w-full text-left hover:bg-purp hover:text-white transition-colors duration-300`}
                  >
                    Request
                  </button>
                  <button
                    onClick={() => handleMenuItemClick("testimony")}
                    className={`${
                      activeButton === "testimony"
                        ? "bg-coral text-white"
                        : "text-gray-700"
                    } group flex items-center px-4 py-3 text-xs lg:text-base  w-full text-left hover:bg-coral hover:text-white transition-colors duration-300`}
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
        {posted && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-2xl"
            onClick={() => setPosted(false)}
          >
            <div className="text-center flex items-center">
              <FaCheckCircle className="text-green-500 text-4xl mr-2" />
              <p className="text-xs lg:text-base font-semibold text-blk1">
                {activeButton.charAt(0).toUpperCase() + activeButton.slice(1)}{" "}
                Posted!
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default EditCard;
