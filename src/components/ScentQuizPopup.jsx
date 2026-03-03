import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Sparkles, ChevronRight } from 'lucide-react';
import VintageOrnament from './VintageOrnament';

const ScentQuizPopup = ({ isOpen, onClose, onStartQuiz }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  if (!isOpen) return null;

  const categoryOptions = [
    {
      id: 'fragrance',
      title: 'Fragrance',
      description: 'Find your signature scent',
      color: 'from-rose-500 to-pink-600'
    },
    {
      id: 'cosmetics',
      title: 'Cosmetics',
      description: 'Discover your perfect products',
      color: 'from-purple-500 to-indigo-600'
    }
  ];

  const quizOptions = selectedCategory === 'fragrance' ? [
    {
      id: 'fragrance-quiz',
      title: 'Fragrance Personality Quiz',
      description: 'Answer questions about your preferences',
      color: 'from-rose-400 to-pink-500'
    }
  ] : [
    {
      id: 'cosmetic-quiz',
      title: 'Cosmetic Match Quiz',
      description: 'Find products perfect for you',
      color: 'from-purple-400 to-indigo-500'
    }
  ];

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-50 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-lg"
          >
            <X size={20} className="text-gray-600" />
          </button>

          {/* Header */}
          <div className="relative bg-gradient-to-br from-cream-50 to-burgundy-50 p-8 pb-12">
            {/* Decorative Elements */}
            <div className="absolute top-4 right-8 text-cream-400 opacity-60">
              <VintageOrnament type="sunburst" className="w-16 h-16" />
            </div>
            <div className="absolute bottom-4 left-8 text-cream-400 opacity-60">
              <VintageOrnament type="leafBranch" className="w-12 h-16" />
            </div>

            <div className="relative z-10 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-burgundy-100 rounded-full">
                  <Heart className="w-6 h-6 text-burgundy-700" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3">
                {selectedCategory ? 'Choose Your Quiz' : 'Find Your Perfect Match'}
              </h2>
              <p className="text-gray-600 text-lg">
                {selectedCategory 
                  ? `Select the perfect ${selectedCategory === 'fragrance' ? 'fragrance' : 'cosmetic'} quiz for you`
                  : 'Select a category to get personalized recommendations'
                }
              </p>
            </div>
          </div>

          {/* Category or Quiz Options */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {(selectedCategory ? quizOptions : categoryOptions).map((option) => (
                <motion.button
                  key={option.id}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (selectedCategory) {
                      onStartQuiz(selectedCategory);
                    } else {
                      setSelectedCategory(option.id);
                    }
                  }}
                  className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 hover:border-burgundy-300 transition-all duration-300"
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  <div className="relative p-6 text-left">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-gray-900 mb-1">
                        {option.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {option.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center text-burgundy-700 font-medium group-hover:text-burgundy-800 transition-colors">
                      <span>{selectedCategory ? 'Start Quiz' : 'Select'}</span>
                      {selectedCategory ? (
                        <Sparkles className="w-4 h-4 ml-2" />
                      ) : (
                        <ChevronRight className="w-4 h-4 ml-2" />
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Back or Skip Option */}
            <div className="text-center mt-8">
              {selectedCategory ? (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-gray-500 hover:text-gray-700 transition-colors underline text-sm mr-4"
                >
                  ← Back to categories
                </button>
              ) : null}
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors underline text-sm"
              >
                No thanks, I'll browse myself
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ScentQuizPopup;