'use client'
import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '@/app/firebase/config'; // Ensure you've imported your Firestore instance
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);

        // Listen for real-time updates to the user's Firestore document
        const unsubscribeSnapshot = onSnapshot(userDocRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            setUserDetails({
              displayName: userData.displayName || currentUser.displayName,
              img: userData.img || '',
              isUserId: userData.isUserId,
              userID: userData.userID,
              uid: currentUser.uid
            });
          } else {
            // If no additional details are found, set default values
            setUserDetails({
              displayName: currentUser.displayName,
              img: '',
              isUserId: false,
              userID: null,
              uid: currentUser.uid
            });
          }
        });

        setUser(currentUser);

        return () => unsubscribeSnapshot(); // Cleanup Firestore listener when the component unmounts or the user changes
      } else {
        setUser(null);
        setUserDetails(null);
      }
    });

    return () => unsubscribeAuth(); // Cleanup the authentication listener when the component unmounts
  }, []);

  return (
    <AuthContext.Provider value={{ user, userDetails }}>
      {children}
    </AuthContext.Provider>
  );
};
