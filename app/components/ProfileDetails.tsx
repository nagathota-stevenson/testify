import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Image from 'next/image';

const ProfileDetails = () => {
 
  const { userDetails, user } = useContext(AuthContext);

  
  if (!user) {
    return <p>Loading...</p>;
  }

  if (!userDetails) {
    return <p>No user details available</p>;
  }

  return (
    <div className='flex flex-col items-center'>
      <div className="relative size-24 self-center lg:size-40 rounded-full overflow-hidden">
        <Image
          src={userDetails.img || "/dp.png"}
          alt="User DP"
          layout="fill" // Fills the container
          objectFit="cover" // Ensures the image covers the container
          className="rounded-full"
        />
      </div>
      <h2 className="text-center text-white text-xl lg:text-4xl font-semibold mb-2 mt-4">
        {userDetails.displayName || "User"}
      </h2>
      <p className="text-center text-gray-300 text-sm lg:text-base font-semibold mb-4">
        @{userDetails.userID}
      </p>
    </div>
  );
}

export default ProfileDetails;
