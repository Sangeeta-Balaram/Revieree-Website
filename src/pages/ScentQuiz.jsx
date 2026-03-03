import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Heart, Sparkles, Gift, ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ScentQuiz = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [quizType, setQuizType] = useState('fragrance');
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const type = searchParams.get('type') || 'fragrance';
    setQuizType(type);
  }, [searchParams]);

  const fragranceQuestions = [
    {
      id: 'personality',
      question: 'Which word best describes your personality?',
      options: [
        { value: 'romantic', label: 'Romantic' },
        { value: 'adventurous', label: 'Adventurous' },
        { value: 'elegant', label: 'Elegant' },
        { value: 'playful', label: 'Playful' }
      ]
    },
    {
      id: 'season',
      question: 'What\'s your favorite season?',
      options: [
        { value: 'spring', label: 'Spring' },
        { value: 'summer', label: 'Summer' },
        { value: 'autumn', label: 'Autumn' },
        { value: 'winter', label: 'Winter' }
      ]
    },
    {
      id: 'mood',
      question: 'What mood are you trying to create?',
      options: [
        { value: 'energetic', label: 'Energetic & Vibrant' },
        { value: 'calm', label: 'Calm & Relaxing' },
        { value: 'sophisticated', label: 'Sophisticated & Chic' },
        { value: 'mysterious', label: 'Mysterious & Alluring' }
      ]
    },
    {
      id: 'notes',
      question: 'Which scent notes appeal to you most?',
      options: [
        { value: 'floral', label: 'Floral' },
        { value: 'citrus', label: 'Citrus' },
        { value: 'woody', label: 'Woody' },
        { value: 'sweet', label: 'Sweet & Gourmand' }
      ]
    },
    {
      id: 'occasion',
      question: 'When will you wear this fragrance most?',
      options: [
        { value: 'daily', label: 'Daily Wear' },
        { value: 'special', label: 'Special Occasions' },
        { value: 'work', label: 'Work/Professional' },
        { value: 'evening', label: 'Evening/Night Out' }
      ]
    }
  ];

  const cosmeticQuestions = [
    {
      id: 'skin_tone',
      question: 'What\'s your skin tone?',
      options: [
        // Cool Undertones
        { value: 'porcelain', label: 'Porcelain', color: '#FFF0E5' },
        { value: 'ivory', label: 'Ivory', color: '#FFE5D9' },
        { value: 'beige', label: 'Beige', color: '#FDD9C3' },
        { value: 'almond', label: 'Almond', color: '#F4C2A1' },
        
        // Warm Undertones
        { value: 'warm_ivory', label: 'Warm Ivory', color: '#F1C27D' },
        { value: 'sand', label: 'Sand', color: '#E8D5B7' },
        { value: 'warm_beige', label: 'Warm Beige', color: '#E5B88A' },
        { value: 'honey', label: 'Honey', color: '#DBC7A8' },
        { value: 'golden', label: 'Golden', color: '#D2B48C' },
        { value: 'chestnut', label: 'Chestnut', color: '#C8956D' },
        
        // Neutral Undertones
        { value: 'natural', label: 'Natural', color: '#C8A882' },
        { value: 'warm_natural', label: 'Warm Natural', color: '#B8735D' },
        { value: 'tan_neutral', label: 'Tan', color: '#A07B6C' },
        { value: 'medium_tan', label: 'Medium Tan', color: '#967059' },
        { value: 'deep_tan', label: 'Deep Tan', color: '#8B4513' },
        
        // Cool-Neutral to Dark
        { value: 'deep_natural', label: 'Deep Natural', color: '#704214' },
        { value: 'espresso', label: 'Espresso', color: '#5C3317' },
        { value: 'deep_espresso', label: 'Deep Espresso', color: '#4A2C17' },
        { value: 'rich_espresso', label: 'Rich Espresso', color: '#3E2415' },
        { value: 'dark_espresso', label: 'Dark Espresso', color: '#2E1A0D' }
      ]
    },
    {
      id: 'makeup_style',
      question: 'Which makeup style do you prefer?',
      options: [
        { value: 'no-makeup', label: 'No Makeup Makeup' },
        { value: 'soft-glam', label: 'Soft Glam' },
        { value: 'bold-glam', label: 'Bold Glam' },
        { value: 'edgy-artistic', label: 'Edgy/Artistic' }
      ]
    },
    {
      id: 'eye_preference',
      question: 'What\'s your eye makeup preference?',
      options: [
        { value: 'natural-eye', label: 'Natural Eyes' },
        { value: 'smokey-eye', label: 'Smokey Eyes' },
        { value: 'winged-liner', label: 'Winged Liner' },
        { value: 'colorful-creative', label: 'Colorful & Creative' }
      ]
    },
    {
      id: 'lip_preference',
      question: 'What\'s your lip vibe?',
      options: [
        { value: 'nude-lips', label: 'Nude & Natural' },
        { value: 'bold-red', label: 'Bold Red' },
        { value: 'soft-pinks', label: 'Soft Pinks' },
        { value: 'dark-plums', label: 'Dark Plums' }
      ]
    },
    {
      id: 'occasion',
      question: 'Where will you wear this makeup most?',
      options: [
        { value: 'daily-casual', label: 'Daily/Casual' },
        { value: 'work-office', label: 'Work/Office' },
        { value: 'party-night', label: 'Party/Night Out' },
        { value: 'special-event', label: 'Special Events' }
      ]
    }
  ];

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getRecommendations = () => {
    if (quizType === 'fragrance') {
      // Fragrance recommendations
      const { personality, notes, mood } = answers;
      
      if (notes === 'floral' && personality === 'romantic') {
        return [
          { name: 'Rose Eternity', description: 'Timeless rose with notes of jasmine', price: 2800 },
          { name: 'Peony Dreams', description: 'Fresh peony with white musk', price: 3200 }
        ];
      } else if (notes === 'citrus' && mood === 'energetic') {
        return [
          { name: 'Citrus Burst', description: 'Vibrant lemon and bergamot', price: 2600 },
          { name: 'Orange Blossom', description: 'Fresh orange with neroli', price: 2900 }
        ];
      } else if (notes === 'woody' && personality === 'elegant') {
        return [
          { name: 'Sandalwood Luxury', description: 'Creamy sandalwood with vanilla', price: 3500 },
          { name: 'Cedar Mystery', description: 'Rich cedar with amber', price: 3100 }
        ];
      } else if (notes === 'sweet' && personality === 'playful') {
        return [
          { name: 'Vanilla Bliss', description: 'Sweet vanilla with caramel', price: 2700 },
          { name: 'Gourmand Delight', description: 'Chocolate and praline notes', price: 3300 }
        ];
      } else {
        return [
          { name: 'Signature Scent', description: 'A perfect balance for you', price: 3000 },
          { name: 'Classic Choice', description: 'Timeless elegance', price: 2800 }
        ];
      }
    } else {
      // Cosmetic recommendations
      const { skin_tone, makeup_style, eye_preference, lip_preference, occasion } = answers;
      
      if (makeup_style === 'no-makeup' && occasion === 'daily-casual') {
        return [
          { name: 'Natural Glow Foundation', description: 'Light coverage with dewy finish', price: 2200 },
          { name: 'Subtle Touch Palette', description: 'Everyday neutral eyeshadows', price: 1800 }
        ];
      } else if (makeup_style === 'bold-glam' && occasion === 'party-night') {
        return [
          { name: 'Drama Queen Set', description: 'Full glam makeup collection', price: 3200 },
          { name: 'Velvet Matte Lipsticks', description: 'Long-wearing bold colors', price: 1600 }
        ];
      } else if (eye_preference === 'winged-liner' && lip_preference === 'bold-red') {
        return [
          { name: 'Classic Glam Collection', description: 'Retro-inspired makeup essentials', price: 2800 },
          { name: 'Precision Liner Set', description: 'Winged liner perfection tools', price: 1200 }
        ];
      } else if (skin_tone === 'deep' && makeup_style === 'soft-glam') {
        return [
          { name: 'Rich Tones Palette', description: 'Shades perfect for deep skin tones', price: 2400 },
          { name: 'Golden Glow Highlighter', description: 'Warm radiant finish', price: 1400 }
        ];
      } else {
        return [
          { name: 'Perfect Match Set', description: 'Personalized makeup collection for you', price: 3500 },
          { name: 'Daily Essentials Kit', description: 'Must-have makeup basics', price: 2000 }
        ];
      }
    }
  };

  const quizQuestions = quizType === 'fragrance' ? fragranceQuestions : cosmeticQuestions;

  // Add fallback styling for missing images
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .image-fallback {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
        font-size: 1.1rem;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (showResults) {
    const recommendations = getRecommendations();
    
    return (
      <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-cream-50 to-burgundy-50">
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-burgundy-100 rounded-full">
                <Sparkles className="w-8 h-8 text-burgundy-700" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
              Your Perfect {quizType === 'fragrance' ? 'Fragrance' : 'Cosmetic'} Match Awaits
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Based on your preferences, we've selected these {quizType === 'fragrance' ? 'fragrances' : 'products'} just for you
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {recommendations.map((product, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-br from-burgundy-100 to-cream-100 flex items-center justify-center">
                  <Gift className="w-16 h-16 text-burgundy-700 opacity-50" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-burgundy-700">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <button className="px-6 py-3 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-12 space-x-4">
            <button
              onClick={() => {
                setCurrentStep(0);
                setAnswers({});
                setShowResults(false);
              }}
              className="px-8 py-3 border-2 border-burgundy-700 text-burgundy-700 rounded-lg hover:bg-burgundy-50 transition-colors"
            >
              Retake Quiz
            </button>
            <button
              onClick={() => navigate(`/products/${quizType === 'fragrance' ? 'fragrances' : 'cosmetics'}`)}
              className="px-8 py-3 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800 transition-colors"
            >
              Shop All {quizType === 'fragrance' ? 'Fragrances' : 'Cosmetics'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - Full Background Image with Centered Text */}
      <section className="relative h-[60vh] lg:h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/adc8fc81eac678aba089250ca3074d47.jpg"
            alt="Scent Quiz"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-700 via-amber-600 to-yellow-600 mb-4 leading-tight">
            {quizType === 'fragrance' ? 'Find Your Perfect Fragrance' : 'Find Your Perfect Makeup Style'}
          </h1>
          <p className="text-lg md:text-xl text-amber-600/90 mb-8 font-light max-w-2xl">
            {quizType === 'fragrance' 
              ? 'Take our quick scent quiz to discover your signature fragrance'
              : 'Take our quick makeup quiz to discover your perfect beauty style'
            }
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-burgundy-800 font-semibold rounded-lg hover:bg-cream-50 transition-all duration-300 shadow-xl"
          >
            <span>Start Quiz</span>
          </motion.button>
        </div>
      </section>

      {/* Quiz Content */}
      <div className="pt-24 pb-16 bg-gradient-to-br from-cream-50 to-burgundy-50">
        <div className="container-custom relative z-10">

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Question {currentStep + 1} of {quizQuestions.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(((currentStep + 1) / quizQuestions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-burgundy-700 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / quizQuestions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Quiz Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            {/* Back to Homepage Button */}
            <button
              onClick={() => navigate('/')}
              className="mb-4 flex items-center text-gray-600 hover:text-burgundy-700 transition-colors group"
            >
              <ArrowLeft size={18} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
              <span>Back to Homepage</span>
            </button>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8 text-center">
                {quizQuestions[currentStep].question}
              </h2>

              {quizType === 'cosmetics' ? (
                <div>
                  {quizQuestions[currentStep].id === 'skin_tone' ? (
                    // Special skin tone strip layout
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                      <p className="text-center text-gray-600 mb-6">Click on the shade that matches your skin tone</p>
                      <div className="flex justify-center items-center space-x-1 overflow-x-auto max-w-4xl mx-auto">
                        {quizQuestions[currentStep].options.map((option, index) => (
                          <motion.button
                            key={option.value}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAnswer(quizQuestions[currentStep].id, option.value)}
                            className={`relative w-12 h-16 transition-all duration-300 ${
                              answers[quizQuestions[currentStep].id] === option.value
                                ? 'ring-2 ring-burgundy-600 transform scale-105'
                                : 'hover:ring-1 hover:ring-burgundy-300'
                            }`}
                            style={{ backgroundColor: option.color }}
                          >
                            {answers[quizQuestions[currentStep].id] === option.value && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full shadow-lg" />
                              </div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                      <div className="flex justify-center mt-6 space-x-4 text-xs text-gray-600 overflow-x-auto max-w-4xl mx-auto">
                        {quizQuestions[currentStep].options.map((option) => (
                          <span key={option.value} className="text-center flex-shrink-0">
                            {option.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    // Regular text layout for other cosmetic questions
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {quizQuestions[currentStep].options.map((option) => (
                        <motion.button
                          key={option.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAnswer(quizQuestions[currentStep].id, option.value)}
                          className={`relative p-8 rounded-xl border-2 transition-all duration-300 text-left ${
                            answers[quizQuestions[currentStep].id] === option.value
                              ? 'border-burgundy-700 bg-burgundy-50 ring-2 ring-burgundy-300'
                              : 'border-gray-200 hover:border-burgundy-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              answers[quizQuestions[currentStep].id] === option.value
                                ? 'border-burgundy-700 bg-burgundy-600'
                                : 'border-gray-400 bg-white'
                            }`} />
                            <span className={`font-semibold ${
                              answers[quizQuestions[currentStep].id] === option.value
                                ? 'text-burgundy-800'
                                : 'text-gray-900'
                            }`}>
                              {option.label}
                            </span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quizQuestions[currentStep].options.map((option) => (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(quizQuestions[currentStep].id, option.value)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                        answers[quizQuestions[currentStep].id] === option.value
                          ? 'border-burgundy-700 bg-burgundy-50'
                          : 'border-gray-200 hover:border-burgundy-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-medium text-gray-900">{option.label}</span>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                    currentStep === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <ChevronLeft size={20} />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handleNext}
                  disabled={!answers[quizQuestions[currentStep].id]}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                    answers[quizQuestions[currentStep].id]
                      ? 'bg-burgundy-700 text-white hover:bg-burgundy-800'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <span>{currentStep === quizQuestions.length - 1 ? 'See Results' : 'Next'}</span>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      </div>
    </div>
  );
};

export default ScentQuiz;