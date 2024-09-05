import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '@/app/firebase/config'; // Ensure you've imported your Firestore instance
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Fetch user details from Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserDetails({
            displayName: userData.displayName || currentUser.displayName,
            img: userData.img || '',
            isUserId: true,
            userID: userData.userID || currentUser.uid,
            uid: currentUser.uid
          });
        } else {
          // If no additional details found, set default values
          setUserDetails({
            displayName: currentUser.displayName,
            img: '',
            isUserId: false,
            userID: currentUser.uid,
            uid: currentUser.uid
          });
        }
      } else {
        setUser(null);
        setUserDetails(null);
      }

      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userDetails }}>
      {children}
    </AuthContext.Provider>
  );
};
