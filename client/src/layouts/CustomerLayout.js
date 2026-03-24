"use client";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { fetchCart } from "../redux/slices/cartSlice";
import Navbar from "../components/customer/Navbar";
import Footer from "../components/customer/Footer";
import ScrollToTop from "../components/common/ScrollToTop";
import NewsletterPopup from "../components/customer/NewsletterPopup";
import AnnouncementPopup from "../components/customer/AnnouncementPopup";
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.15, ease: "easeOut" } },
  exit: { opacity: 1 },
};

const CustomerLayout = ({ children }) => {
  const pathname = usePathname();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <NewsletterPopup />
      <AnnouncementPopup />
      <main className="flex-grow">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default CustomerLayout;
