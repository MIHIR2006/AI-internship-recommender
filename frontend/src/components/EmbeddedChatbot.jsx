import { motion } from "framer-motion";
import { Bot, Loader2, Send, User } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { SlideUp } from "../utils/Animation";

const EmbeddedChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Good evening! I'm your AI career assistant. I can help you discover job opportunities, provide career guidance, and answer any questions about your professional journey. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatInputRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Mock job database
  const jobDatabase = [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "TechFlow Inc.",
      location: "San Francisco, CA",
      skills: ["JavaScript", "React", "Node.js", "Python"],
      type: "Full-time",
      salary: "$120k - $150k",
      description: "Lead development of cutting-edge web applications and mentor junior developers.",
      category: "tech"
    },
    {
      id: 2,
      title: "Digital Marketing Manager",
      company: "BrandBoost Agency",
      location: "New York, NY",
      skills: ["Social Media Marketing", "Google Analytics", "SEO", "Content Strategy"],
      type: "Full-time",
      salary: "$80k - $100k",
      description: "Develop and execute comprehensive digital marketing strategies across multiple channels.",
      category: "marketing"
    },
    {
      id: 3,
      title: "UX/UI Designer",
      company: "DesignStudio Pro",
      location: "Remote",
      skills: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping"],
      type: "Full-time",
      salary: "$90k - $120k",
      description: "Create user-centered designs and conduct usability research for mobile and web applications.",
      category: "design"
    },
    {
      id: 4,
      title: "Data Scientist",
      company: "DataCorp Analytics",
      location: "Seattle, WA",
      skills: ["Python", "SQL", "Machine Learning", "Tableau", "Statistics"],
      type: "Full-time",
      salary: "$110k - $140k",
      description: "Analyze large datasets and build predictive models for business insights.",
      category: "data"
    },
    {
      id: 5,
      title: "Cybersecurity Analyst",
      company: "SecureTech Solutions",
      location: "Austin, TX",
      skills: ["Security Analysis", "Network Security", "Incident Response", "Compliance"],
      type: "Full-time",
      salary: "$95k - $125k",
      description: "Protect organizational data and systems from cyber threats and vulnerabilities.",
      category: "cybersecurity"
    }
  ];

  // AI Response Generator
  const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Tech/Programming queries
    if (message.includes('programming') || message.includes('tech') || message.includes('software') || message.includes('developer') || message.includes('coding')) {
      const techJobs = jobDatabase.filter(job => job.category === 'tech');
      return {
        content: "Great choice! Programming careers are in high demand with excellent growth potential. Here are some exciting software engineering opportunities:\n\n**🚀 Top Programming Jobs:**\n• **Senior Software Engineer** at TechFlow Inc. - $120k-$150k\n• **Full Stack Developer** positions available\n• **Remote opportunities** in tech companies\n\n**💡 Skills in Demand:**\n• JavaScript, React, Node.js, Python\n• Cloud platforms (AWS, Azure)\n• DevOps and CI/CD practices\n\nWould you like me to show you specific job details or help with skill development?",
        jobs: techJobs
      };
    }
    
    // Data Science queries
    if (message.includes('data science') || message.includes('data') || message.includes('analytics') || message.includes('machine learning')) {
      const dataJobs = jobDatabase.filter(job => job.category === 'data');
      return {
        content: "Data Science is one of the most exciting fields right now! Here are some fantastic opportunities:\n\n**📊 Data Science Roles:**\n• **Data Scientist** at DataCorp Analytics - $110k-$140k\n• **Business Intelligence Analyst** positions\n• **Machine Learning Engineer** roles\n\n**🔧 Key Skills:**\n• Python, R, SQL\n• Machine Learning frameworks\n• Data visualization tools\n• Statistical analysis\n\nInterested in any specific data science role?",
        jobs: dataJobs
      };
    }

    // Marketing queries
    if (message.includes('marketing') || message.includes('social media') || message.includes('content') || message.includes('brand')) {
      const marketingJobs = jobDatabase.filter(job => job.category === 'marketing');
      return {
        content: "Marketing is a dynamic and creative field! Here are some excellent opportunities:\n\n**📈 Marketing Positions:**\n• **Digital Marketing Manager** at BrandBoost Agency - $80k-$100k\n• **Content Marketing Specialist** roles\n• **Social Media Manager** positions\n\n**🎯 Essential Skills:**\n• Google Analytics, SEO, SEM\n• Content creation and strategy\n• Social media platforms\n• Data-driven marketing\n\nWant to explore specific marketing roles?",
        jobs: marketingJobs
      };
    }

    // Cybersecurity queries
    if (message.includes('cybersecurity') || message.includes('security') || message.includes('cyber') || message.includes('hacking')) {
      const securityJobs = jobDatabase.filter(job => job.category === 'cybersecurity');
      return {
        content: "Cybersecurity is a critical and growing field! Here are some important opportunities:\n\n**🔒 Security Roles:**\n• **Cybersecurity Analyst** at SecureTech Solutions - $95k-$125k\n• **Security Engineer** positions\n• **Incident Response Specialist** roles\n\n**🛡️ Key Skills:**\n• Network security, threat analysis\n• Security tools and frameworks\n• Compliance and risk management\n• Incident response procedures\n\nInterested in cybersecurity career paths?",
        jobs: securityJobs
      };
    }

    // Design queries
    if (message.includes('design') || message.includes('ux') || message.includes('ui') || message.includes('creative')) {
      const designJobs = jobDatabase.filter(job => job.category === 'design');
      return {
        content: "Design careers are perfect for creative problem-solvers! Here are some opportunities:\n\n**🎨 Design Positions:**\n• **UX/UI Designer** at DesignStudio Pro - $90k-$120k\n• **Product Designer** roles\n• **Graphic Designer** positions\n\n**✨ Essential Skills:**\n• Figma, Adobe Creative Suite\n• User research and testing\n• Prototyping and wireframing\n• Design systems and accessibility\n\nWant to explore design career options?",
        jobs: designJobs
      };
    }

    // Remote work queries
    if (message.includes('remote') || message.includes('work from home') || message.includes('virtual')) {
      const remoteJobs = jobDatabase.filter(job => job.location === 'Remote');
      return {
        content: "Remote work offers flexibility and access to opportunities worldwide! Here are some excellent remote positions:\n\n**🏠 Remote Opportunities:**\n• **UX/UI Designer** - Remote position\n• **Software Engineer** - Remote available\n• **Digital Marketing** - Remote options\n\n**💡 Remote Work Tips:**\n• Set up a dedicated workspace\n• Maintain regular communication\n• Use collaboration tools effectively\n• Establish work-life balance\n\nLooking for specific remote roles?",
        jobs: remoteJobs
      };
    }

    // Career advice queries
    if (message.includes('career') || message.includes('advice') || message.includes('resume') || message.includes('interview')) {
      return {
        content: "I'd love to help with your career development! Here's my comprehensive guide:\n\n**📝 Resume & Application:**\n• Tailor your resume for each position\n• Highlight quantifiable achievements\n• Use keywords from job descriptions\n• Include a compelling summary\n\n**🎯 Interview Success:**\n• Research the company thoroughly\n• Practice the STAR method\n• Prepare thoughtful questions\n• Follow up professionally\n\n**🚀 Career Growth:**\n• Set clear goals and milestones\n• Seek feedback regularly\n• Build your professional network\n• Stay updated with industry trends\n\nWhat specific area would you like to focus on?",
        jobs: []
      };
    }

    // Default response
    return {
      content: "I'm here to help you find the perfect career opportunity! I can assist you with:\n\n**🔍 Job Discovery:**\n• Programming & Tech roles\n• Data Science positions\n• Marketing opportunities\n• Design careers\n• Cybersecurity jobs\n\n**💼 Career Guidance:**\n• Resume optimization\n• Interview preparation\n• Skill development\n• Career planning\n\nWhat would you like to explore today?",
      jobs: jobDatabase.slice(0, 2)
    };
  };

  const handleSendMessage = async (messageText = null) => {
    const message = messageText || inputMessage.trim();
    if (!message) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate realistic AI response delay
    setTimeout(() => {
      const botResponse = generateBotResponse(message);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse.content,
        timestamp: new Date(),
        jobs: botResponse.jobs
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Job Card Component
  const JobCard = ({ job }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3 hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 text-sm mb-1">{job.title}</h4>
          <p className="text-blue-600 text-xs font-medium">{job.company}</p>
        </div>
        <span className="text-xs text-gray-500">{job.salary}</span>
      </div>
      <p className="text-gray-600 text-xs mb-2">{job.description}</p>
      <div className="flex flex-wrap gap-1">
        {job.skills.slice(0, 3).map((skill, index) => (
          <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
      variants={SlideUp(0.6)}
      initial="hidden"
      animate="visible"
    >
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-white/20 p-2 rounded-full mr-3">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Career Assistant</h3>
            <p className="text-blue-100 text-xs">Claude Sonnet 4</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs">Online</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50"
        style={{ scrollBehavior: 'smooth' }}
      >
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
              <div className={`flex items-start space-x-2 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white border border-blue-200 text-blue-600'
                }`}>
                  {message.type === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                
                {/* Message Content */}
                <div className={`px-3 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}>
                  <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                  
                  {/* Job Cards */}
                  {message.jobs && message.jobs.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.jobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-blue-200 text-blue-600 flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="bg-white px-3 py-2 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-1">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">AI is thinking...</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              ref={chatInputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              placeholder="How can I help you today?"
              className="w-full border border-gray-300 focus:border-blue-500 rounded-full px-4 py-3 text-sm focus:outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
              disabled={isTyping}
              maxLength={500}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
              {inputMessage.length}/500
            </div>
          </div>
          <motion.button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white p-3 rounded-full transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isTyping ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </motion.button>
        </div>
        
        {/* Quick Actions */}
        <div className="flex items-center justify-center mt-3 space-x-2">
          <span className="text-xs text-gray-500">Quick start:</span>
          {["Programming", "Data Science", "Marketing", "Cybersecurity"].map((quick) => (
            <button
              key={quick}
              onClick={() => handleSendMessage(`Show me ${quick.toLowerCase()} jobs`)}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded-full transition-colors"
              disabled={isTyping}
            >
              {quick}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default EmbeddedChatbot;
