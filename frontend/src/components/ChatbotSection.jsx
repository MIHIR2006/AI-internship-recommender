import { motion } from "framer-motion";
import React from "react";
import { SlideUp } from "../utils/Animation";
import EmbeddedChatbot from "./EmbeddedChatbot";

const ChatbotSection = () => {
  return (
    <section className="py-16 px-6 md:px-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          variants={SlideUp(0.4)}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Get Personalized Career Guidance
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Chat with our AI assistant to discover job opportunities, get career advice, 
            and find the perfect role that matches your skills and aspirations.
          </p>
        </motion.div>

        {/* Embedded Chatbot */}
        <motion.div
          className="max-w-4xl mx-auto"
          variants={SlideUp(0.6)}
          initial="hidden"
          animate="visible"
        >
          <EmbeddedChatbot />
        </motion.div>
      </div>
    </section>
  );
};

export default ChatbotSection;