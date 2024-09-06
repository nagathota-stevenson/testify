"use client";
import { useState } from "react";
import NavBar from "./components/NavBar";
import RequestsPage from "./pages/RequestsPage";
import PostPage from "./pages/PostPage";
import TestimoniesPage from "./pages/TestimoniesPage";
import ProfilePage from "./pages/ProfilePage";
import FadeTransition from "./components/FadeTransition";
import { AuthProvider } from "./context/AuthContext";
import EditProfilePage from "./pages/EditProfilePage";
import NotificationsPage from "./pages/NotificationsPage";

export default function Home() {
  const [activeButton, setActiveButton] = useState("requests");
  const [isDropdown, setisDropDown] = useState(false);
  return (
    <AuthProvider>
      <main className="bg-blk1">
        <NavBar activeButton={activeButton} setActiveButton={setActiveButton} />
          {activeButton === "requests" && <RequestsPage />}
          {activeButton === "add" && <PostPage />}
          {activeButton === "testimonies" && <TestimoniesPage />}
          {activeButton === "profile" && <ProfilePage setActiveButton={setActiveButton}/>}
          {activeButton === "notifications" && <NotificationsPage />}
          {activeButton === "edit" && <EditProfilePage setActiveButton={setActiveButton} />}
      </main>
    </AuthProvider>
  );
}
