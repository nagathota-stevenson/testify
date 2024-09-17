"use client";
import React, { useState, useContext } from "react";
import { deleteUser } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { IoMail } from "react-icons/io5";
import { BiSolidCommentDetail } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext"; // Import your AuthContext
import { auth } from "../firebase/config";
import { useRouter } from "next/navigation";

const db = getFirestore();

interface AccordionItemProps {
  title: string;
  content: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  content,
  isOpen,
  onToggle,
  icon,
}) => (
  <div className="border w-[400px] border-gray-300 rounded-2xl overflow-hidden">
    <div
      onClick={onToggle}
      className="flex items-center px-4 py-3 cursor-pointer transition-colors duration-300"
    >
      <span className="text-gray-700 text-xs lg:text-base flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </span>
      <span className="ml-auto text-xl text-blk1">
        {isOpen ? <HiChevronUp /> : <HiChevronDown />}
      </span>
    </div>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="p-4">{content}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  error?: string; // Optional error message
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  error,
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0  flex items-center justify-center"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 40 }}
    >
      <div className="bg-blk1 p-6 rounded-2xl shadow-lg max-w-sm mx-auto">
        <h2 className="text-lg font-bold mb-4">Are you sure?</h2>
        <p className="mb-4">
          You cannot undo this action. This will permanently delete your
          account.
        </p>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-2xl bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-2xl bg-red-500 text-white hover:bg-red-600 transition-colors duration-300"
          >
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const SettingsCard = () => {
  const { user, userDetails } = useContext(AuthContext);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    if (!user) {
      setError("No user logged in");
      return;
    }

    try {
      const uid = userDetails.uid;

      await deleteDoc(doc(db, "users", uid));

      const user = auth.currentUser;
      
      if (user) {
        await deleteUser(user);
        router.push("/");
        console.log("User account and data successfully deleted");
        setIsModalOpen(false);
        
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("There was an issue deleting your account."); // Set error message
    }
  };

  const handleToggleCard = (card: string) => {
    setActiveCard(activeCard === card ? null : card);
  };

  const handleFeedbackSubmit = async () => {
    if (!feedback) return;

    try {
      if (!user) return;

      setLoading(true);

      await addDoc(collection(db, "mail"), {
        message: {
          subject: "Feedback Submission",
          html: `
          <p><strong>Feedback:</strong> ${feedback}</p>
          <p><strong>Sent by:</strong></p>
          <p><strong>Name:</strong> ${userDetails.displayName}</p>
          <p><strong>Username:</strong> ${userDetails.userID}</p>
          <p><strong>UID:</strong> ${userDetails.uid}</p>
        `,
          text: "Feedback has been submitted by a user.",
        },
        to: "nagathota.stevenson@gmail.com",
      });

      setLoading(false);
      setSubmitted(true);
      setFeedback("");

      // Revert the button text back after a few seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting feedback: ", error);
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="shadow-custom-purple space-y-4 text-xs lg:text-base border-2 border-blk1 bg-white rounded-2xl p-8 max-w-3xl mx-auto"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, originY: 0 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 40 }}
    >
      <AccordionItem
        title="Contact Support"
        content={
          <p className="text-gray-700">
            For support, please reach out to us at{" "}
            <a href="mailto:testifyth@gmail.com" className="text-purp">
              testifyth@gmail.com
            </a>
          </p>
        }
        isOpen={activeCard === "contact"}
        onToggle={() => handleToggleCard("contact")}
        icon={<IoMail className="text-xl text-gray-700" />}
      />
      <AccordionItem
        title="Submit Feedback"
        content={
          <div className="flex flex-col space-y-4">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Please share your feedback to help us improve.."
              className="w-full h-32 px-4 py-2 rounded-lg border-gray-300 text-gray-700 resize-none focus:outline-none"
            />
            <div className="flex justify-end">
              <button
                onClick={handleFeedbackSubmit}
                className={`relative w-full px-4 py-2 rounded-2xl text-white transition-colors duration-300 overflow-hidden active:scale-95 ${
                  loading || feedback.trim() === ""
                    ? "bg-gray-300 cursor-not-allowed" // Disabled state color
                    : "bg-blk1 hover:bg-purp"
                }`}
                disabled={loading || submitted || feedback.trim() === ""}
              >
                {loading ? (
                  <span className="relative z-10">Submitting...</span>
                ) : submitted ? (
                  <span className="relative z-10">Submitted!</span>
                ) : (
                  <span className="relative z-10">Submit</span>
                )}
                <span className="absolute inset-0 bg-white opacity-20 transform scale-0 transition-transform duration-300 ease-in-out active:scale-110"></span>
              </button>
            </div>
          </div>
        }
        isOpen={activeCard === "feedback"}
        onToggle={() => handleToggleCard("feedback")}
        icon={<BiSolidCommentDetail className="text-xl text-gray-700" />}
      />
      <>
        <AccordionItem
          title="Delete Account"
          content={
            <div className="flex flex-col space-y-4">
              <textarea
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please specify your reasons for deleting your account.."
                className="w-full h-32 px-4 py-2 rounded-lg border-gray-300 text-gray-700 resize-none focus:outline-none"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => setIsModalOpen(true)} // Open the modal
                  className="relative px-4 py-2 rounded-2xl text-blk1 hover:text-red-500 transition-colors duration-300 overflow-hidden active:scale-95"
                >
                  <span className="relative z-10">Delete</span>
                  <span className="absolute inset-0 bg-red-200 opacity-20 transform scale-0 transition-transform duration-300 ease-in-out active:scale-110"></span>
                </button>
              </div>
            </div>
          }
          isOpen={activeCard === "delete"}
          onToggle={() => handleToggleCard("delete")}
          icon={<MdDelete className="text-xl text-gray-700" />}
        />
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleDelete}
        />
      </>
    </motion.div>
  );
};

export default SettingsCard;
