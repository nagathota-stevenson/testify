import React, { useState } from "react";
import "./LoginCard.css";
import { TITLE, PROFILE_IMG } from "../constants";
import { auth, provider } from "@/app/firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { FaGoogle } from "react-icons/fa";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { motion } from "framer-motion";

// Define a type for error state
type ErrorState = {
  field: "email" | "password" | null;
  message: string;
};

const getErrorMessage = (error: any): ErrorState => {
  switch (error.code) {
    case "auth/email-already-in-use":
      return {
        field: "email",
        message:
          "This email is already in use. Please use a different email address.",
      };
    case "auth/invalid-email":
      return {
        field: "email",
        message:
          "The email address is not valid. Please enter a valid email address.",
      };
    case "auth/weak-password":
      return {
        field: "password",
        message: "The password is too weak. Please choose a stronger password.",
      };
    case "auth/user-not-found":
      return {
        field: "email",
        message:
          "No account found with this email. Please check the email and try again.",
      };
    case "auth/wrong-password":
      return {
        field: "password",
        message: "Incorrect password. Please check the password and try again.",
      };
    case "auth/invalid-credential":
      return {
        field: "email",
        message: "Invalid credentials. Please check your input and try again.",
      };
    default:
      return {
        field: null,
        message: "An unknown error occurred. Please try again later.",
      };
  }
};

const LoginCard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [showPassword, setshowPassword] = useState(false);
  const [error, setError] = useState<ErrorState>({ field: null, message: "" }); // State to hold error messages

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const db = getFirestore();

      const userData = {
        img: PROFILE_IMG,
        isUserId: false,
        name: user.displayName || "",
        userID: null,
      };

      await setDoc(doc(db, "users", user.uid), userData);

      setEmail("");
      setPassword("");
      setError({ field: null, message: "" }); // Clear error on successful sign up
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const db = getFirestore();

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        const userData = {
          img: PROFILE_IMG,
          isUserId: false,
          name: user.displayName || "",
          userID: null,
        };
        await setDoc(docRef, userData);
      }
      setError({ field: null, message: "" }); // Clear error on successful Google sign in
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
      setError({ field: null, message: "" }); // Clear error on successful login
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  const toggleForm = () => {
    setIsSigningUp(!isSigningUp);
  };

  return (
    <motion.div
      className="login-card bg-white w-[400px] lg:w-[550px] text-xs lg:text-base rounded-2xl border-2 border-blk1 flex flex-col p-8"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, originY: 0 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 40 }}
    >
      <h2 className="text-center text-blk1 text-xl font-normal mb-2 mt-4">
        {isSigningUp ? `Join ${TITLE} today!` : `Welcome back to ${TITLE}!`}
      </h2>
      <h2 className="text-center text-purp text-sm font-normal mb-8">
        {isSigningUp
          ? "Pray for Unknown. Praise the Known."
          : "Please login to continue."}
      </h2>
      <form
        className="flex flex-col"
        onSubmit={isSigningUp ? handleSignUp : handleLogin}
      >
        <label className="text-start text-blk1 mb-2">Email</label>

        <div className="relative mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`p-[12px] border-2 border-gray-300 rounded-2xl text-blk1 focus:outline-none focus:ring-0 focus:border-purp ${
              error.field === "email" ? "border-red-500" : ""
            } w-full`}
          />
          {error.field === "email" && (
            <p className="text-red-500 text-xs mt-2">{error.message}</p>
          )}
        </div>

        <label className="text-start text-blk1 mt-4 mb-2">Password</label>
        <div className="relative mb-8">
          <input
            type={showPassword ? "text" : "password"}
            placeholder={isSigningUp ? "Create a password" : "Enter password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`p-[12px] border-2 border-gray-300 rounded-2xl text-blk1 focus:outline-none focus:ring-0 focus:border-purp w-full ${
              error.field === "password" ? "border-red-500" : ""
            }`}
          />
          <span
            className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={() => setshowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <IoMdEye className="text-gray-300 size-5" />
            ) : (
              <IoMdEyeOff className="text-gray-300 size-5" />
            )}
          </span>
          {error.field === "password" && (
            <p className="text-red-500 text-xs absolute right-0 top-full mt-1">
              {error.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blk1 text-white p-[12px] border-2 border-blk1 rounded-2xl hover:bg-purp"
        >
          {isSigningUp ? "Sign Up" : "Login"}
        </button>
      </form>

      <div className="flex items-center justify-center my-4">
        <span className="text-gray-500">or</span>
      </div>

      <button
        onClick={handleGoogleSignIn}
        className="bg-purp text-white p-[12px] mb-4 rounded-2xl border-2 border-blk1 flex items-center justify-center hover:bg-blk1"
      >
        <FaGoogle className="size-5 mr-2" />
        {isSigningUp ? "Sign Up with Google" : "Login with Google"}
      </button>

      <div className="text-center mt-4">
        <span className="text-blk1">
          {isSigningUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button onClick={toggleForm} className="text-purp hover:underline">
            {isSigningUp ? "Login" : "Sign Up"}
          </button>
        </span>
      </div>
    </motion.div>
  );
};

export default LoginCard;
