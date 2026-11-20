"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface WishlistContextType {
  likedIds: string[];
  isLiked: (id: string) => boolean;
  toggleLike: (id: string) => void;
  likeCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("af_liked_fragrances");
      if (stored) {
        setLikedIds(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load likes from storage", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem("af_liked_fragrances", JSON.stringify(likedIds));
      window.dispatchEvent(new Event("af_wishlist_change"));
    } catch (e) {
      console.error("Failed to save likes to storage", e);
    }
  }, [likedIds, isInitialized]);

  const isLiked = (id: string) => likedIds.includes(id);

  const toggleLike = (id: string) => {
    setLikedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  return (
    <WishlistContext.Provider
      value={{
        likedIds,
        isLiked,
        toggleLike,
        likeCount: likedIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
