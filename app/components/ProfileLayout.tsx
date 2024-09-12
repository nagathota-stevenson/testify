// components/ProfileLayout.tsx
import React, { ReactNode } from "react";
import NavBar from "./NavBar";
import ProfileDetails from "./ProfileDetails";

interface ProfileLayoutProps {
    children: ReactNode; 
    uid: string// Type the children prop
  }

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children, uid }) => {
  return (
    <>
     
      <section className="bg-blk1 w-screen h-screen flex items-start justify-center pt-24 pb-24">
        <div className="flex flex-col items-center">
          <ProfileDetails uid={uid} />
          {children}
        </div>
      </section>
    </>
  );
};

export default ProfileLayout;
