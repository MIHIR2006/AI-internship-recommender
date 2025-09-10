import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserRound, Mail, MapPin, Briefcase } from "lucide-react";
import { toast } from "react-hot-toast";

const UserInfoForm = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    experience: "",
    interests: []
  });

  const [loading, setLoading] = useState(false);

  const experienceLevels = [
    "Student/Fresh Graduate",
    "0-1 years",
    "1-3 years", 
    "3-5 years",
    "5+ years"
  ];

  const interestOptions = [
    "Software Development",
    "Data Science",
    "UI/UX Design",
    "Marketing",
    "Sales",
    "Finance",
    "Human Resources",
    "Operations",
    "Product Management",
    "Cybersecurity"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error("Please fill in your name and email");
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store user info in localStorage
      localStorage.setItem("userInfo", JSON.stringify(formData));
      localStorage.setItem("hasSeenWelcomePopup", "true");
      
      toast.success("Welcome! Your preferences have been saved.");
      onSubmit?.(formData);
      onClose();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("hasSeenWelcomePopup", "true");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={handleSkip}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-100 px-6 py-4 rounded-t-xl border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Welcome to Our Platform! 👋
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Help us personalize your experience by sharing some basic information
                    </p>
                  </div>
                  <button
                    onClick={handleSkip}
                    className="p-2 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <UserRound className="h-5 w-5 text-blue-600" />
                    Basic Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-300 rounded-lg flex items-center p-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                      <UserRound className="h-5 w-5 text-gray-400 mr-3" />
                      <input
                        type="text"
                        name="name"
                        placeholder="Your full name"
                        className="w-full outline-none text-sm bg-transparent placeholder-gray-500"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="border border-gray-300 rounded-lg flex items-center p-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                      <Mail className="h-5 w-5 text-gray-400 mr-3" />
                      <input
                        type="email"
                        name="email"
                        placeholder="Your email address"
                        className="w-full outline-none text-sm bg-transparent placeholder-gray-500"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="border border-gray-300 rounded-lg flex items-center p-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <input
                      type="text"
                      name="location"
                      placeholder="Your location (city, country)"
                      className="w-full outline-none text-sm bg-transparent placeholder-gray-500"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Experience Level */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                    Experience Level
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {experienceLevels.map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, experience: level }))}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                          formData.experience === level
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-300 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Areas of Interest (Select up to 5)
                  </h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {interestOptions.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => handleInterestToggle(interest)}
                        disabled={!formData.interests.includes(interest) && formData.interests.length >= 5}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                          formData.interests.includes(interest)
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-300 hover:border-blue-300 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                  
                  {formData.interests.length > 0 && (
                    <p className="text-sm text-gray-600">
                      Selected: {formData.interests.length}/5
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Skip for now
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      "Save & Continue"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UserInfoForm;
