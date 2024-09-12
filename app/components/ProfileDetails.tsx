import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { doc, getDoc } from 'firebase/firestore'; // Firestore imports
import { db } from '../firebase/config'; // Import your Firebase configuration

interface ProfileDetailsProps {
  uid: string; // Accept uid as a prop
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ uid }) => {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
          setUserDetails(userDoc.data());
        } else {
          setError('User not found');
        }
      } catch (err) {
        setError('Failed to fetch user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [uid]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
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
      <h2 className="text-center text-white text-xl lg:text-4xl font-normal mb-2 mt-4">
        {userDetails.displayName || "User"}
      </h2>
      <p className="text-center text-gray-300 text-sm lg:text-base font-normal mb-4">
        @{userDetails.userID}
      </p>
    </div>
  );
};

export default ProfileDetails;
