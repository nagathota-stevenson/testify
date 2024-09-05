/* eslint-disable @next/next/no-img-element */
import React, { useState, useContext } from "react";
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

const LoginCard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(true);
  const [showPassword, setshowPassword] = useState(false);

  const handleSignUp = async (e: { preventDefault: () => void }) => {
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
        name: user.displayName,
        userID: "",
      };

      await setDoc(doc(db, "users", user.uid), userData);

      setEmail("");
      setPassword("");
      console.log("User signed up and added to Firestore successfully!");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error during sign up:", error.message);
      } else {
        console.error("Unknown error during sign up");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const db = getFirestore();

      // Check if user exists in Firestore, add if not
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        const userData = {
          img: user.photoURL || PROFILE_IMG,
          isUserId: false,
          name: user.displayName || "",
          userID: "",
        };

        
        await setDoc(docRef, userData);
      }

      console.log("User signed in with Google successfully!");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error during Google sign in:", error.message);
      } else {
        console.error("Unknown error during Google sign in");
      }
    }
  };

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
      console.log("User logged in successfully!");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error during login:", error.message);
      } else {
        console.error("Unknown error during login");
      }
    }
  };

  const toggleForm = () => {
    setIsSigningUp(!isSigningUp);
  };

  return (
    <motion.div
      className="login-card bg-white lg:w-[500px] sm:w-[400px] rounded-2xl border-2 border-blk1 flex flex-col p-8"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, originY: 0 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 40 }}
    >
      <h2 className="text-center text-blk1 text-xl font-semibold mb-2 mt-4">
        {isSigningUp ? `Join ${TITLE} today!` : `Welcome back to ${TITLE}!`}
      </h2>
      <h2 className="text-center text-purp text-sm font-semibold mb-8">
        {isSigningUp
          ? "Pray for Unknown. Praise the Known."
          : "Please login to continue."}
      </h2>
      <form
        className="flex flex-col"
        onSubmit={isSigningUp ? handleSignUp : handleLogin}
      >
        <label className="text-start text-blk1 mb-2">Email</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-[12px] border-2 border-gray-300 rounded-2xl text-blk1 focus:outline-none focus:ring-0 focus:border-purp"
        />
        <label className="text-start text-blk1 mt-4 mb-2">Password</label>
        <div className="relative mb-8">
          <input
            type={showPassword ? "text" : "password"}
            placeholder={isSigningUp ? "Create a password" : "Enter"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-[12px] border-2 border-gray-300 rounded-2xl text-blk1 focus:outline-none focus:ring-0 focus:border-purp w-full"
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
