import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { getFeaturedProducts } from "../utils/storage";
import ScentQuizPopup from "../components/ScentQuizPopup";

// Hero images for carousel
const heroImages = [
  "/perfumes/5.png",
  "/perfumes/6.png",
  "/perfumes/7.png",
  "/perfumes/8.png",
  "/perfumes/9.png",
  "/perfumes/10.png",
];

const Home = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [layeringOccasion, setLayeringOccasion] = useState("");
  const [layeringCombo, setLayeringCombo] = useState([]);
  const [lastGeneratedOccasion, setLastGeneratedOccasion] = useState("");
  const [wishlist, setWishlist] = useState(new Set());
  const [giftStep, setGiftStep] = useState(1);
  const [selectedFragrances, setSelectedFragrances] = useState(new Set());
  const [selectedCosmetics, setSelectedCosmetics] = useState(new Set());
  const [giftNote, setGiftNote] = useState("");
  const [showQuizPopup, setShowQuizPopup] = useState(false);

  const handleStartQuiz = (quizType) => {
    setShowQuizPopup(false);
    // Navigate to the appropriate quiz page with type parameter
    window.location.href = `/scent-quiz?type=${quizType}`;
  };

  // Fairy dust cursor effect for both flip cards and scent quiz sections
  useEffect(() => {
    const moodSection = document.querySelector(".mood-cards-container");
    const scentQuizSection = document.querySelector(
      'section[class*="from-yellow-50"]'
    );

    console.log("Elements found:", {
      moodSection: !!moodSection,
      scentQuizSection: !!scentQuizSection,
    });

    if (!moodSection && !scentQuizSection) return;

    let cursor = null;
    let isInSection = false;

    const createCursor = () => {
      cursor = document.createElement("div");
      cursor.className = "fairy-cursor";
      document.body.appendChild(cursor);
    };

    const createTrail = (x, y) => {
      const trail = document.createElement("div");
      trail.className = "fairy-trail";
      trail.style.left = x + "px";
      trail.style.top = y + "px";
      trail.style.pointerEvents = "none";
      document.body.appendChild(trail);

      setTimeout(() => trail.remove(), 1500);
    };

    const moveCursor = (e) => {
      if (!cursor || !isInSection) return;

      cursor.style.left = e.clientX - 10 + "px";
      cursor.style.top = e.clientY - 10 + "px";

      setTimeout(() => {
        if (Math.random() > 0.6) {
          createTrail(
            e.clientX + (Math.random() - 0.5) * 25,
            e.clientY + (Math.random() - 0.5) * 25
          );
        }
      }, 50);
    };

    const enterSection = () => {
      isInSection = true;
      if (!cursor) createCursor();
    };

    const leaveSection = () => {
      isInSection = false;
      if (cursor) {
        cursor.remove();
        cursor = null;
      }
      document
        .querySelectorAll(".fairy-trail")
        .forEach((trail) => trail.remove());
    };

    // Add listeners to both sections
    if (moodSection) {
      moodSection.addEventListener("mouseenter", enterSection);
      moodSection.addEventListener("mouseleave", leaveSection);
    }

    if (scentQuizSection) {
      scentQuizSection.addEventListener("mouseenter", enterSection);
      scentQuizSection.addEventListener("mouseleave", leaveSection);
    }

    document.addEventListener("mousemove", moveCursor);

    return () => {
      if (moodSection) {
        moodSection.removeEventListener("mouseenter", enterSection);
        moodSection.removeEventListener("mouseleave", leaveSection);
      }
      if (scentQuizSection) {
        scentQuizSection.removeEventListener("mouseenter", enterSection);
        scentQuizSection.removeEventListener("mouseleave", leaveSection);
      }
      document.removeEventListener("mousemove", moveCursor);
      if (cursor) cursor.remove();
      document
        .querySelectorAll(".fairy-trail")
        .forEach((trail) => trail.remove());
    };
  }, []);

  // Add CSS for card flip animation, marquee, and fairy cursor
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .card-3d {
        perspective: 1000px;
      }
      
      .card-inner {
        position: relative;
        width: 100%;
        height: 100%;
        text-align: center;
        transition: transform 0.6s;
        transform-style: preserve-3d;
      }
      
      .card-3d:hover .card-inner {
        transform: rotateY(180deg);
      }
      
      .card-front, .card-back {
        position: absolute;
        width: 100%;
        height: 100%;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        border-radius: 0.75rem;
      }
      
      .card-back {
        transform: rotateY(180deg);
      }
      
      .card-back-content {
        transform: rotateY(180deg);
      }
      
      @keyframes marquee {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-50%);
        }
      }
      
      @keyframes marquee-reverse {
        0% {
          transform: translateX(-50%);
        }
        100% {
          transform: translateX(0);
        }
      }
      
      @keyframes fadeInUp {
        0% {
          opacity: 0;
          transform: translateY(30px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .animate-marquee {
        animation: marquee 30s linear infinite;
      }
      
      .animate-marquee-reverse {
        animation: marquee-reverse 30s linear infinite;
      }
      
      /* Fairy cursor styles */
      .fairy-cursor {
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255, 182, 193, 0.8), rgba(255, 105, 180, 0.6));
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 20px rgba(255, 182, 193, 0.6);
      }
      
      .fairy-trail {
        position: fixed;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255, 182, 193, 0.6), rgba(255, 105, 180, 0.4));
        pointer-events: none;
        z-index: 9998;
        transform: translate(-50%, -50%);
        animation: fadeOut 1.5s ease-out forwards;
      }
      
      @keyframes fadeOut {
        0% {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
        100% {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.2);
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setNewsletterMessage("Thank you for subscribing!");
    setNewsletterEmail("");
  };

  const generateLayeringCombo = () => {
    // Don't generate if input is empty or less than 3 characters
    if (!layeringOccasion.trim() || layeringOccasion.trim().length < 3) {
      // Clear combo if input is too short to show popular occasions
      setLayeringCombo([]);
      setLastGeneratedOccasion("");
      return;
    }

    // Don't regenerate if same occasion was already generated
    if (lastGeneratedOccasion === layeringOccasion.trim()) return;

    // Sample product combinations ensuring fragrance + cosmetics diversity
    const combinations = {
      "Date Night": [
        {
          name: "Midnight Rose",
          type: "fragrance",
          role: "Signature scent - Seductive",
          price: 2999,
          image: "/perfumes/5.png",
        },
        {
          name: "Velvet Matte Lipstick",
          type: "cosmetic",
          role: "Perfect complement - Romantic",
          price: 1299,
          image: "/assets/images/cosmetics/lipstick1.png",
        },
        {
          name: "Golden Hour",
          type: "fragrance",
          role: "Finishing touch - Romantic",
          price: 2499,
          image: "/perfumes/8.png",
        },
      ],
      "Office Meeting": [
        {
          name: "Crystal Clean",
          type: "fragrance",
          role: "Signature scent - Professional",
          price: 1999,
          image: "/perfumes/6.png",
        },
        {
          name: "Foundation SPF 30",
          type: "cosmetic",
          role: "Perfect complement - Polished",
          price: 2299,
          image: "/assets/images/cosmetics/foundation1.png",
        },
      ],
      "Revenge on Ex": [
        {
          name: "Boss Lady",
          type: "fragrance",
          role: "Power scent - Unforgettable",
          price: 2799,
          image: "/perfumes/7.png",
        },
        {
          name: "Precision Eyeliner",
          type: "cosmetic",
          role: "Perfect complement - Bold",
          price: 899,
          image: "/assets/images/cosmetics/eyeliner1.png",
        },
        {
          name: "Satin Eyeshadow Palette",
          type: "cosmetic",
          role: "Finishing touch - Dramatic",
          price: 2499,
          image: "/assets/images/cosmetics/eyeshadow1.png",
        },
      ],
      "Girls' Night Out": [
        {
          name: "Cherry Blossom",
          type: "fragrance",
          role: "Signature scent - Fun & Flirty",
          price: 2199,
          image: "/perfumes/10.png",
        },
        {
          name: "Velvet Matte Lipstick",
          type: "cosmetic",
          role: "Perfect complement - Party ready",
          price: 1299,
          image: "/assets/images/cosmetics/lipstick1.png",
        },
        {
          name: "Blush Powder Duo",
          type: "cosmetic",
          role: "Finishing touch - Glamorous",
          price: 1599,
          image: "/assets/images/cosmetics/blush1.png",
        },
      ],
      "First Date": [
        {
          name: "Crystal Clean",
          type: "fragrance",
          role: "Signature scent - Fresh impression",
          price: 1999,
          image: "/perfumes/6.png",
        },
        {
          name: "Blush Powder Duo",
          type: "cosmetic",
          role: "Perfect complement - Sweet & approachable",
          price: 1599,
          image: "/assets/images/cosmetics/blush1.png",
        },
      ],
      "Job Interview": [
        {
          name: "Crystal Clean",
          type: "fragrance",
          role: "Signature scent - Professional confidence",
          price: 1999,
          image: "/perfumes/6.png",
        },
        {
          name: "Foundation SPF 30",
          type: "cosmetic",
          role: "Perfect complement - Power presence",
          price: 2299,
          image: "/assets/images/cosmetics/foundation1.png",
        },
      ],
      "Beach Day": [
        {
          name: "Safe Bet",
          type: "fragrance",
          role: "Signature scent - Casual & carefree",
          price: 1899,
          image: "/perfumes/9.png",
        },
        {
          name: "Foundation SPF 30",
          type: "cosmetic",
          role: "Perfect complement - Sun protection",
          price: 2299,
          image: "/assets/images/cosmetics/foundation1.png",
        },
      ],
      Wedding: [
        {
          name: "Midnight Rose",
          type: "fragrance",
          role: "Signature scent - Elegant romance",
          price: 2999,
          image: "/perfumes/5.png",
        },
        {
          name: "Satin Eyeshadow Palette",
          type: "cosmetic",
          role: "Perfect complement - Bridal glow",
          price: 2499,
          image: "/assets/images/cosmetics/eyeshadow1.png",
        },
      ],
      "Brunch with Friends": [
        {
          name: "Crystal Clean",
          type: "fragrance",
          role: "Signature scent - Fresh & friendly",
          price: 1999,
          image: "/perfumes/6.png",
        },
        {
          name: "Blush Powder Duo",
          type: "cosmetic",
          role: "Perfect complement - Sweet & social",
          price: 1599,
          image: "/assets/images/cosmetics/blush1.png",
        },
      ],
      "Solo Self-Care": [
        {
          name: "Safe Bet",
          type: "fragrance",
          role: "Signature scent - Comforting familiarity",
          price: 1899,
          image: "/perfumes/9.png",
        },
        {
          name: "Foundation SPF 30",
          type: "cosmetic",
          role: "Perfect complement - Me-time pampering",
          price: 2299,
          image: "/assets/images/cosmetics/foundation1.png",
        },
      ],
      "Gift for Girlfriend": [
        {
          name: "Midnight Rose",
          type: "fragrance",
          role: "Signature scent - Romantic gesture",
          price: 2999,
          image: "/perfumes/5.png",
        },
        {
          name: "Velvet Matte Lipstick",
          type: "cosmetic",
          role: "Perfect complement - Sweet surprise",
          price: 1299,
          image: "/assets/images/cosmetics/lipstick1.png",
        },
      ],
    };

    // Enhanced keyword mapping for synonyms and partial matches
    const keywordMapping = {
      date: "Date Night",
      night: "Date Night",
      romantic: "Date Night",
      dinner: "Date Night",
      valentine: "Date Night",
      anniversary: "Date Night",
      office: "Office Meeting",
      work: "Office Meeting",
      meeting: "Office Meeting",
      professional: "Office Meeting",
      business: "Office Meeting",
      corporate: "Office Meeting",
      revenge: "Revenge on Ex",
      ex: "Revenge on Ex",
      breakup: "Revenge on Ex",
      movingon: "Revenge on Ex",
      girls: "Girls' Night Out",
      "night out": "Girls' Night Out",
      party: "Girls' Night Out",
      clubbing: "Girls' Night Out",
      dancing: "Girls' Night Out",
      first: "First Date",
      initial: "First Date",
      interview: "Job Interview",
      job: "Job Interview",
      career: "Job Interview",
      beach: "Beach Day",
      vacation: "Beach Day",
      summer: "Beach Day",
      holiday: "Beach Day",
      wedding: "Wedding",
      marriage: "Wedding",
      brunch: "Brunch with Friends",
      friends: "Brunch with Friends",
      social: "Brunch with Friends",
      gathering: "Brunch with Friends",
      solo: "Solo Self-Care",
      "self care": "Solo Self-Care",
      selfcare: "Solo Self-Care",
      me: "Solo Self-Care",
      relaxation: "Solo Self-Care",
      gift: "Gift for Girlfriend",
      girlfriend: "Gift for Girlfriend",
      present: "Gift for Girlfriend",
      birthday: "Gift for Girlfriend",
    };

    // Find matching occasion using enhanced search
    let matchedOccasion = null;
    const inputLower = layeringOccasion.toLowerCase().trim();

    // First try exact match
    if (combinations[layeringOccasion]) {
      matchedOccasion = layeringOccasion;
    } else {
      // Enhanced keyword matching with fuzzy logic
      let bestMatch = null;
      let bestScore = 0;

      for (const [keyword, occasion] of Object.entries(keywordMapping)) {
        let score = 0;

        // Exact keyword match gets highest score
        if (inputLower.includes(keyword)) {
          score = 100;
        }
        // Partial matching with similarity
        else {
          const keywordWords = keyword.split(" ");
          const inputWords = inputLower.split(" ");

          // Count matching words
          let matchingWords = 0;
          for (const kWord of keywordWords) {
            for (const iWord of inputWords) {
              if (
                kWord === iWord ||
                kWord.includes(iWord) ||
                iWord.includes(kWord)
              ) {
                matchingWords++;
                break;
              }
            }
          }
          score =
            (matchingWords / Math.max(keywordWords.length, inputWords.length)) *
            80;
        }

        if (score > bestScore && score > 30) {
          // Minimum threshold
          bestScore = score;
          bestMatch = occasion;
        }
      }

      matchedOccasion = bestMatch;
    }

    // Enhanced product database with categories
    const fragranceProducts = [
      {
        name: "Midnight Rose",
        type: "fragrance",
        price: 2999,
        image: "/perfumes/5.png",
      },
      {
        name: "Crystal Clean",
        type: "fragrance",
        price: 1999,
        image: "/perfumes/6.png",
      },
      {
        name: "Boss Lady",
        type: "fragrance",
        price: 2799,
        image: "/perfumes/7.png",
      },
      {
        name: "Golden Hour",
        type: "fragrance",
        price: 2499,
        image: "/perfumes/8.png",
      },
      {
        name: "Safe Bet",
        type: "fragrance",
        price: 1899,
        image: "/perfumes/9.png",
      },
      {
        name: "Cherry Blossom",
        type: "fragrance",
        price: 2199,
        image: "/perfumes/10.png",
      },
    ];

    const cosmeticProducts = [
      {
        name: "Velvet Matte Lipstick",
        type: "cosmetic",
        price: 1299,
        image: "/assets/images/cosmetics/lipstick1.png",
      },
      {
        name: "Satin Eyeshadow Palette",
        type: "cosmetic",
        price: 2499,
        image: "/assets/images/cosmetics/eyeshadow1.png",
      },
      {
        name: "Precision Eyeliner",
        type: "cosmetic",
        price: 899,
        image: "/assets/images/cosmetics/eyeliner1.png",
      },
      {
        name: "Blush Powder Duo",
        type: "cosmetic",
        price: 1599,
        image: "/assets/images/cosmetics/blush1.png",
      },
      {
        name: "Foundation SPF 30",
        type: "cosmetic",
        price: 2299,
        image: "/assets/images/cosmetics/foundation1.png",
      },
    ];

    // Default combination ensuring fragrance + cosmetic mix with variable size
    const createDefaultCombo = (seed, occasionText = "") => {
      const allProducts = [...fragranceProducts, ...cosmeticProducts];
      const shuffled = [...allProducts].sort(() => {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
      });

      // Determine number of products based on occasion complexity and seed
      const textLength = occasionText.length;
      let numProducts = 3; // default

      // Adjust product count based on text complexity and seed variation
      if (textLength > 15) {
        numProducts = Math.min(5, 3 + (seed % 3)); // 3-5 products for detailed queries
      } else if (textLength > 8) {
        numProducts = Math.min(4, 3 + (seed % 2)); // 3-4 products for medium queries
      }

      // Ensure balanced mix of fragrances and cosmetics
      const fragrances = shuffled.filter((p) => p.type === "fragrance");
      const cosmetics = shuffled.filter((p) => p.type === "cosmetic");

      const combo = [];
      const fragranceCount = Math.ceil(numProducts / 2);
      const cosmeticCount = numProducts - fragranceCount;

      // Add fragrances
      for (let i = 0; i < fragranceCount && i < fragrances.length; i++) {
        combo.push(fragrances[i]);
      }

      // Add cosmetics
      for (let i = 0; i < cosmeticCount && i < cosmetics.length; i++) {
        combo.push(cosmetics[i]);
      }

      return combo.map((product, index) => ({
        ...product,
        role:
          index === 0
            ? "Signature scent"
            : index === 1
            ? "Perfect complement"
            : index < fragranceCount
            ? `Layer ${index + 1}`
            : `Enhancement ${index - fragranceCount + 1}`,
      }));
    };

    // Find matching combination or create intelligent default
    let combo;
    if (matchedOccasion) {
      combo = combinations[matchedOccasion];
    } else {
      // Smart default combo with internet lookup simulation and diversity
      const hashCode = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          const char = str.charCodeAt(i);
          hash = (hash << 5) - hash + char;
          hash = hash & hash;
        }
        return Math.abs(hash);
      };

      const seed = hashCode(layeringOccasion);
      combo = createDefaultCombo(seed, layeringOccasion);
    }

    // Enhance existing combos to include cosmetics if they don't have them
    if (matchedOccasion && combo) {
      const hasOnlyFragrances = combo.every((product) =>
        fragranceProducts.some((f) => f.name === product.name)
      );

      if (hasOnlyFragrances) {
        const hashCode = (str) => {
          let hash = 0;
          for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash;
          }
          return Math.abs(hash);
        };

        const seed = hashCode(matchedOccasion);
        const cosmetic = cosmeticProducts[seed % cosmeticProducts.length];

        // Replace one fragrance with a cosmetic to ensure diversity
        combo = [
          ...combo.slice(0, -1),
          {
            ...cosmetic,
            role: "Perfect complement",
          },
        ];
      }
    }

    setLayeringCombo(combo);
    setLastGeneratedOccasion(layeringOccasion.trim());

    // Enhanced search: If no match found, simulate internet lookup for style analysis
    if (!matchedOccasion && layeringOccasion.trim()) {
      const simulateInternetLookup = async () => {
        try {
          // This would normally call an API, but we'll simulate based on keywords
          const moodAnalysis = analyzeMoodFromText(layeringOccasion);
          console.log(
            `Analyzing "${layeringOccasion}" as: ${moodAnalysis.style} mood`
          );

          // Could update UI with this analysis
        } catch (error) {
          console.error("Style analysis failed:", error);
        }
      };

      simulateInternetLookup();
    }
  };

  // Helper function to analyze mood/style from text (simulates internet lookup)
  const analyzeMoodFromText = (text) => {
    const textLower = text.toLowerCase();

    // Analyze emotional tone and suggest appropriate style
    if (
      textLower.includes("confident") ||
      textLower.includes("power") ||
      textLower.includes("boss")
    ) {
      return { style: "Power Professional", mood: "confident" };
    } else if (
      textLower.includes("relax") ||
      textLower.includes("calm") ||
      textLower.includes("peace")
    ) {
      return { style: "Serene Elegance", mood: "relaxed" };
    } else if (
      textLower.includes("party") ||
      textLower.includes("fun") ||
      textLower.includes("energy")
    ) {
      return { style: "Vibrant Celebration", mood: "energetic" };
    } else if (
      textLower.includes("romantic") ||
      textLower.includes("love") ||
      textLower.includes("intimate")
    ) {
      return { style: "Romantic Sophistication", mood: "romantic" };
    } else if (
      textLower.includes("mystery") ||
      textLower.includes("dark") ||
      textLower.includes("night")
    ) {
      return { style: "Mysterious Allure", mood: "enigmatic" };
    } else {
      return { style: "Versatile Classic", mood: "balanced" };
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[100vh] min-h-[700px] flex items-center justify-center overflow-hidden pt-16 lg:pt-0">
        {/* Background Image */}
        <img
          src="/assets/images/adc8fc81eac678aba089250ca3074d47.jpg"
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20"></div>

        {/* Glass Morphism Rectangle */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-full mx-auto px-4 md:px-20"
        >
          <div className="bg-red-900/20 backdrop-blur-md rounded-3xl p-12 md:p-20 shadow-2xl border border-red-300/30">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left - Content */}
              <div className="space-y-6">
                <div className="inline-block">
                  <span className="px-4 py-2 bg-white/90 text-red-800 rounded-full text-sm font-medium backdrop-blur-sm">
                    Luxury Redefined
                  </span>
                </div>

                <motion.h1
                  variants={itemVariants}
                  className="text-4xl md:text-6xl font-serif font-regular text-transparent bg-clip-text bg-gradient-to-r from-yellow-700 via-amber-500 to-yellow-600 leading-none "
                >
                  Wear Mood, Not the Trend
                </motion.h1>

                <motion.p
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                  className="text-lg text-orange-100 font-light"
                >
                  Fragrances that feel like a version of you.
                </motion.p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setShowQuizPopup(true)}
                    className="bg-white text-red-800 px-6 py-3 rounded-lg hover:bg-red-50 transition-all transform hover:scale-105 flex items-center justify-center font-medium"
                  >
                    <Sparkles size={20} className="mr-2" />
                    Find Match
                  </button>
                  <button
                    onClick={() => {
                      const bestsellersSection = document.getElementById(
                        "bestsellers-section"
                      );
                      bestsellersSection?.scrollIntoView({
                        behavior: "smooth",
                      });
                    }}
                    className="border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white/10 transition-all transform hover:scale-105 flex items-center justify-center font-medium backdrop-blur-sm"
                  >
                    Bestsellers
                  </button>
                </div>

                <div className="flex items-center space-x-2 text-sm">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <span className="text-white/80">4.8 | Loved by 10,000+</span>
                </div>
              </div>

              {/* Right - Product Images Carousel */}
              <div className="relative flex justify-center items-center">
                {/* Image background behind changing product images */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full max-w-sm max-h-96 rounded-2xl overflow-hidden">
                    <img
                      src="/assets/images/adc8fc81eac678aba089250ca3074d47.jpg"
                      alt="Background"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="relative w-full max-w-sm h-80 z-10">
                  {heroImages.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-1000 flex items-center justify-center ${
                        currentImage === index ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-contain drop-shadow-2xl filter brightness-110"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SHOP BY MOOD Section */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-pink-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-red-800 mb-4">
              What are you feeling today?
            </h2>
            <p className="text-xl text-red-700 font-light">
              Don't overthink it. Pick a mood. Smell like it.
            </p>
          </div>

          <div className="mood-cards-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                title: "Soft Girl",
                liner: "Smells like clean skin + expensive peace.",
                image: "/assets/images/cards mood/Soft Girl.jpeg",
              },
              {
                title: "Clean & Expensive",
                liner: "Like white shirts, iced coffee, and boundaries.",
                image: "/assets/images/cards mood/Clean & Expensive.jpeg",
              },
              {
                title: "Main Character",
                liner: "You enter. People notice. That's the plot.",
                image: "/assets/images/cards mood/Main Character.jpeg",
              },
              {
                title: "Romantic Chaos",
                liner: "Sweet… but emotionally unhinged in a cute way.",
                image: "/assets/images/cards mood/Romantic Chaos.jpeg",
              },
              {
                title: "After Hours",
                liner: "Dark. Warm. Dangerous. Don't text him.",
                image: "/assets/images/cards mood/After Hours.jpeg",
              },
              {
                title: "Bare Skin",
                liner: "Intimate. Close. Like a secret only you know.",
                image: "/assets/images/cards mood/Bare Skin.jpeg",
              },
              {
                title: "Sweet Danger",
                liner: "Sugar on top. Red flags underneath.",
                image: "/assets/images/cards mood/Sweet Danger.jpeg",
              },
              {
                title: "Unbothered",
                liner: "Calm face. Loud presence.",
                image: "/assets/images/cards mood/Unbothered.jpeg",
              },
            ].map((mood, index) => (
              <div key={index} className="relative h-48 group card-3d">
                <div className="card-inner">
                  {/* Front of card */}
                  <div className="card-front bg-white shadow-lg overflow-hidden">
                    <img
                      src={mood.image}
                      alt={mood.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Back of card - Dark Red with details */}
                  <div className="card-back bg-gradient-to-br from-red-800 to-red-950 shadow-lg p-6 flex flex-col justify-center items-center text-center text-white">
                    <div className="card-back-content">
                      <h3 className="text-xl font-bold mb-3">{mood.title}</h3>
                      <p className="text-sm leading-relaxed mb-4 opacity-90">
                        {mood.liner}
                      </p>
                      <Link
                        to="/products"
                        className="bg-white text-red-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors transform hover:scale-105 inline-block"
                      >
                        Shop {mood.title.toLowerCase()} vibes
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Glow border overlay ✅ FIXED */}
                <div
                  className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    top: "-4px",
                    left: "-4px",
                    right: "-4px",
                    bottom: "-4px",
                    background:
                      "linear-gradient(45deg, #ff69b4, #ffb6c1, #ffc0cb, #ffb6c1, #ff69b4)",
                    backgroundSize: "300% 300%",
                    filter: "blur(2px) brightness(1.8)",
                    zIndex: -1,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scent Quiz Section */}
      <section className="py-20 bg-gradient-to-r from-rose-950 to-red-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
            Not sure what fits your mood?
          </h2>
          <p className="text-xl text-red-100 font-light mb-10">
            No bad decisions here. Take a test to find right product for you.
          </p>
          <button
            onClick={() => setShowQuizPopup(true)}
            className="inline-flex items-center text-red-900 text-xl font-bold transition-colors group bg-white px-10 py-5 rounded-2xl hover:bg-red-50 transform hover:scale-105 shadow-2xl"
          >
            Find Your Perfect Match
            <ArrowRight
              size={24}
              className="ml-3 transform group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </section>

      {/* OUR STORY Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center items-center">
            {/* Centered Story Content */}
            <div className="max-w-4xl text-center space-y-8">
              <div className="inline-block">
                <span className="px-4 py-2 bg-white text-red-800 rounded-full text-sm font-medium">
                  Our Journey
                </span>
              </div>

              <h2 className="text-4xl md:text-6xl font-serif font-bold text-red-800 leading-tight">
                We believe fragrance is feeling, not luxury.
              </h2>

              <p className="text-xl text-gray-700 leading-relaxed font-light max-w-3xl mx-auto">
                Revieree was born from a simple question: Why do we wear scents
                and cosmetics that don't feel like us? We were tired of playing
                by rules written by others. So we created our own. Each bottle
                holds a mood, a moment, a version of you that's waiting to be
                discovered.
              </p>

              <p className="text-xl text-gray-700 leading-relaxed font-light max-w-3xl mx-auto">
                Not because it's trending. Not because someone told you to. But
                because it feels right. We craft fragrances and cosmetics that
                understand your complexity, celebrate your individuality, and
                give you permission to be exactly who you are today.
              </p>

              <div className="pt-6">
                <Link
                  to="/about"
                  className="inline-flex items-center bg-red-800 text-white px-8 py-4 rounded-lg hover:bg-red-900 transition-colors font-semibold group"
                >
                  Read our full story
                  <ArrowRight
                    size={20}
                    className="ml-2 transform group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>{" "}
      </section>
      {/* BESTSELLERS Section */}
      <section
        id="bestsellers-section"
        className="py-20 bg-gradient-to-r from-rose-950 to-red-950 w-full r px-6"
      >
        <div className="w-full">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              Bestseller. No bad decisions here.
            </h2>
            <p className="text-xl text-red-100 font-light mb-8">
              These are the ones people get complimented for.
            </p>
          </div>

          {/* Fragrances Marquee Row */}
          <div className="mb-8">
            <div className="relative overflow-hidden">
              <div className="flex space-x-6 animate-marquee m-0 p-0">
                {[
                  {
                    name: "Midnight Rose",
                    badge: "Most Complimented",
                    perfect: "date nights",
                    image: "/perfumes/5.png",
                  },
                  {
                    name: "Crystal Clean",
                    badge: "Clean Girl Favourite",
                    perfect: "everyday wear",
                    image: "/perfumes/6.png",
                  },
                  {
                    name: "Boss Lady",
                    badge: "Best for Date Nights",
                    perfect: "office meetings",
                    image: "/perfumes/7.png",
                  },
                  {
                    name: "Golden Hour",
                    badge: "Hot Girl Essential",
                    perfect: "weekend parties",
                    image: "/perfumes/8.png",
                  },
                  {
                    name: "Safe Bet",
                    badge: "The Safe Blind Buy",
                    perfect: "any occasion",
                    image: "/perfumes/9.png",
                  },
                  {
                    name: "Cherry Blossom",
                    badge: "Most Complimented",
                    perfect: "spring days",
                    image: "/perfumes/10.png",
                  },
                ].map((product, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-[450px] h-[400px] relative group cursor-pointer border-2 border-red-200 rounded-2xl overflow-hidden"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Hover overlay with red glass morphism */}
                    <div className="absolute inset-8 bg-red-900/85 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 rounded-xl">
                      {/* Upper part - Details */}
                      <div className="h-1/2 flex flex-col justify-center space-y-2">
                        <h4 className="text-xl font-bold text-white text-center">
                          {product.name}
                        </h4>
                        <p className="text-sm text-white/90 text-center">
                          Perfect for: {product.perfect || "everyday luxury"}
                        </p>
                        <p className="text-xs text-white/80 text-center">
                          {product.badge}
                        </p>
                      </div>

                      {/* Divider line */}
                      <div className="h-px bg-white/30 my-3"></div>

                      {/* Bottom part - CTA Button */}
                      <div className="h-1/2 flex items-center justify-center">
                        <Link
                          to="/products"
                          className="bg-white text-red-900 px-8 py-2 rounded-lg font-semibold hover:bg-red-50 transition-colors inline-block"
                        >
                          Shop Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Duplicate for seamless scroll */}
                {[
                  {
                    name: "Midnight Rose",
                    badge: "Most Complimented",
                    perfect: "date nights",
                    image: "/perfumes/5.png",
                  },
                  {
                    name: "Crystal Clean",
                    badge: "Clean Girl Favourite",
                    perfect: "everyday wear",
                    image: "/perfumes/6.png",
                  },
                  {
                    name: "Boss Lady",
                    badge: "Best for Date Nights",
                    perfect: "office meetings",
                    image: "/perfumes/7.png",
                  },
                  {
                    name: "Golden Hour",
                    badge: "Hot Girl Essential",
                    perfect: "weekend parties",
                    image: "/perfumes/8.png",
                  },
                  {
                    name: "Safe Bet",
                    badge: "The Safe Blind Buy",
                    perfect: "any occasion",
                    image: "/perfumes/9.png",
                  },
                  {
                    name: "Cherry Blossom",
                    badge: "Most Complimented",
                    perfect: "spring days",
                    image: "/perfumes/10.png",
                  },
                ].map((product, index) => (
                  <div
                    key={`duplicate-${index}`}
                    className="flex-shrink-0 w-[450px] h-[400px] relative group cursor-pointer border-2 border-red-200 rounded-2xl overflow-hidden"
                    onClick={() => {
                      const productSlug = product.name
                        .toLowerCase()
                        .replace(/\s+/g, "-");
                      window.location.href = `/product/fragrance/${productSlug}`;
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Hover overlay with red glass morphism */}
                    <div className="absolute inset-8 bg-red-900/85 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 rounded-xl">
                      {/* Upper part - Details */}
                      <div className="h-1/2 flex flex-col justify-center space-y-2">
                        <h4 className="text-xl font-bold text-white text-center">
                          {product.name}
                        </h4>
                        <p className="text-sm text-white/90 text-center">
                          Perfect for: {product.perfect || "everyday luxury"}
                        </p>
                        <p className="text-xs text-white/80 text-center">
                          {product.badge}
                        </p>
                      </div>

                      {/* Divider line */}
                      <div className="h-px bg-white/30 my-3"></div>

                      {/* Bottom part - CTA Button */}
                      <div className="h-1/2 flex items-center justify-center">
                        <Link
                          to="/products"
                          className="bg-white text-red-900 px-8 py-2 rounded-lg font-semibold hover:bg-red-50 transition-colors inline-block"
                        >
                          Shop Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cosmetics Marquee Row */}
          <div className="mb-0">
            <div className="relative overflow-hidden">
              <div className="flex space-x-6 animate-marquee-reverse m-0 p-0">
                {[
                  {
                    name: "Glow Up",
                    badge: "Most Complimented",
                    perfect: "daily radiance",
                    image: "/assets/images/cosmetics/1.png",
                  },
                  {
                    name: "Perfect Pout",
                    badge: "Clean Girl Favourite",
                    perfect: "date nights",
                    image: "/assets/images/cosmetics/2.png",
                  },
                  {
                    name: "Power Brow",
                    badge: "Hot Girl Essential",
                    perfect: "power meetings",
                    image: "/assets/images/cosmetics/3.png",
                  },
                  {
                    name: "Sun Kissed",
                    badge: "Best for Date Nights",
                    perfect: "beach days",
                    image: "/assets/images/cosmetics/4.png",
                  },
                  {
                    name: "No Makeup Makeup",
                    badge: "The Safe Blind Buy",
                    perfect: "natural look",
                    image: "/assets/images/cosmetics/5.png",
                  },
                  {
                    name: "Velvet Touch",
                    badge: "Clean Girl Favourite",
                    perfect: "evening glam",
                    image: "/assets/images/cosmetics/6.png",
                  },
                ].map((product, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-[450px] h-[400px] relative group cursor-pointer border-2 border-red-200 rounded-2xl overflow-hidden"
                    onClick={() => {
                      const productSlug = product.name
                        .toLowerCase()
                        .replace(/\s+/g, "-");
                      window.location.href = `/product/cosmetic/${productSlug}`;
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Hover overlay with red glass morphism */}
                    <div className="absolute inset-8 bg-red-900/85 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 rounded-xl">
                      {/* Upper part - Details */}
                      <div className="h-1/2 flex flex-col justify-center space-y-2">
                        <h4 className="text-xl font-bold text-white text-center">
                          {product.name}
                        </h4>
                        <p className="text-sm text-white/90 text-center">
                          Perfect for: {product.perfect || "everyday luxury"}
                        </p>
                        <p className="text-xs text-white/80 text-center">
                          {product.badge}
                        </p>
                      </div>

                      {/* Divider line */}
                      <div className="h-px bg-white/30 my-3"></div>

                      {/* Bottom part - CTA Button */}
                      <div className="h-1/2 flex items-center justify-center">
                        <Link
                          to="/products"
                          className="bg-white text-red-900 px-8 py-2 rounded-lg font-semibold hover:bg-red-50 transition-colors inline-block"
                        >
                          Shop Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Duplicate for seamless scroll */}
                {[
                  {
                    name: "Glow Up",
                    badge: "Most Complimented",
                    perfect: "daily radiance",
                    image: "/assets/images/cosmetics/1.png",
                  },
                  {
                    name: "Perfect Pout",
                    badge: "Clean Girl Favourite",
                    perfect: "date nights",
                    image: "/assets/images/cosmetics/2.png",
                  },
                  {
                    name: "Power Brow",
                    badge: "Hot Girl Essential",
                    perfect: "power meetings",
                    image: "/assets/images/cosmetics/3.png",
                  },
                  {
                    name: "Sun Kissed",
                    badge: "Best for Date Nights",
                    perfect: "beach days",
                    image: "/assets/images/cosmetics/4.png",
                  },
                  {
                    name: "No Makeup Makeup",
                    badge: "The Safe Blind Buy",
                    perfect: "natural look",
                    image: "/assets/images/cosmetics/5.png",
                  },
                  {
                    name: "Velvet Touch",
                    badge: "Clean Girl Favourite",
                    perfect: "evening glam",
                    image: "/assets/images/cosmetics/6.png",
                  },
                ].map((product, index) => (
                  <div
                    key={`duplicate-${index}`}
                    className="flex-shrink-0 w-[450px] h-[400px] relative group cursor-pointer border-2 border-red-200 rounded-2xl overflow-hidden"
                    onClick={() => {
                      const productSlug = product.name
                        .toLowerCase()
                        .replace(/\s+/g, "-");
                      window.location.href = `/product/cosmetic/${productSlug}`;
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Hover overlay with red glass morphism */}
                    <div className="absolute inset-8 bg-red-900/85 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 rounded-xl">
                      {/* Upper part - Details */}
                      <div className="h-1/2 flex flex-col justify-center space-y-2">
                        <h4 className="text-xl font-bold text-white text-center">
                          {product.name}
                        </h4>
                        <p className="text-sm text-white/90 text-center">
                          Perfect for: {product.perfect || "everyday luxury"}
                        </p>
                        <p className="text-xs text-white/80 text-center">
                          {product.badge}
                        </p>
                      </div>

                      {/* Divider line */}
                      <div className="h-px bg-white/30 my-3"></div>

                      {/* Bottom part - CTA Button */}
                      <div className="h-1/2 flex items-center justify-center">
                        <Link
                          to="/products"
                          className="bg-white text-red-900 px-8 py-2 rounded-lg font-semibold hover:bg-red-50 transition-colors inline-block"
                        >
                          Shop Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <div className="mt-20 mx-9 bg-white py-16 px-9 rounded-t-3xl rounded-b-3xl relative overflow-hidden">
        <h3 className="text-3xl md:text-4xl font-serif font-bold text-red-800 text-center mb-12 relative z-10">
          What we stand for
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {[
            {
              title: "Authenticity First",
              description:
                "No trends. No rules. Just scents that feel like you were meant to find them.",
            },
            {
              title: "Crafted with Care",
              description:
                "Every bottle is made with premium ingredients and intention, not chemicals and compromise.",
            },
            {
              title: "Inclusive Beauty",
              description:
                "Fragrance has no gender, no age, no rules. Just your mood, your way.",
            },
          ].map((value, index) => (
            <div
              key={index}
              className="text-center bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border-2 border-red-800 transform transition-all duration-300 hover:scale-105 hover:-translate-y-6 hover:shadow-3xl hover:shadow-red-800/80 hover:bg-gradient-to-br hover:from-red-50 hover:to-pink-50 hover:rotate-1 hover:border-red-800 hover:shadow-lg hover:shadow-red-800/60"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.2}s both`,
              }}
            >
              <div className="mb-6 transform transition-transform duration-300 hover:rotate-12 hover:scale-110">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mx-auto flex items-center justify-center">
                  <Sparkles size={36} className="text-red-600" />
                </div>
              </div>
              <h4 className="text-lg font-bold text-red-800 mb-4 text-center">
                {value.title}
              </h4>
              <p className="text-red-800 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* LAYERING COMBOS Section */}
      <section className="mt-20 py-20 bg-gradient-to-r from-rose-950 to-red-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              Layering Combos
            </h2>
            <p className="text-xl text-white font-light mb-8">
              Tell us your occasion. We'll create the perfect fragrance
              combination.
            </p>
          </div>

          {/* Occasion Input */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Type your occasion e.g., Date Night, Revenge on Ex..."
                className="w-full px-6 py-4 text-lg border-2 border-red-200 rounded-lg focus:outline-none focus:border-red-500 text-gray-900"
                value={layeringOccasion}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setLayeringOccasion(newValue);
                  // Clear combo if input is emptied
                  if (!newValue.trim()) {
                    setLayeringCombo([]);
                    setLastGeneratedOccasion("");
                  }
                }}
              />
              <button
                onClick={generateLayeringCombo}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-800 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Generate Combo
              </button>
            </div>
          </div>

          {/* Sample Occasions - appears below input when no combo */}
          {layeringCombo.length === 0 && (
            <div className="max-w-4xl mx-auto mb-12">
              <p className="text-white mb-4 text-center">
                Choose from these popular occasions:
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  "Date Night",
                  "Office Meeting",
                  "Revenge on Ex",
                  "Girls' Night Out",
                  "First Date",
                  "Job Interview",
                  "Beach Day",
                  "Wedding",
                  "Brunch with Friends",
                  "Solo Self-Care",
                  "Gift for Girlfriend",
                ].map((occasion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setLayeringOccasion(occasion);
                      // Clear previous generation to allow new one
                      setLastGeneratedOccasion("");
                      // Auto-generate for preset occasions
                      setTimeout(() => generateLayeringCombo(), 0);
                    }}
                    className="px-4 py-2 bg-white border-2 border-red-200 text-red-800 rounded-lg hover:bg-red-50 hover:border-red-500 transition-colors"
                  >
                    {occasion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Products */}
          {layeringCombo.length > 0 && layeringOccasion.trim() !== "" && (
            <div className="mb-12">
              <h3 className="text-2xl font-serif font-bold text-white mb-6 text-center">
                Perfect for: {layeringOccasion}
              </h3>
              <div className="mb-8">
                <div className="flex flex-wrap justify-center gap-6">
                  {layeringCombo.map((product, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-[450px] h-[400px] relative group cursor-pointer border-2 border-red-200 rounded-2xl overflow-hidden"
                      onClick={() => {
                        const productSlug = product.name
                          .toLowerCase()
                          .replace(/\s+/g, "-");
                        window.location.href = `/product/fragrance/${productSlug}`;
                      }}
                    >
                      <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-red-50 to-pink-50">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const productId = product.name; // Using name as unique identifier
                            const newWishlist = new Set(wishlist);
                            if (newWishlist.has(productId)) {
                              newWishlist.delete(productId);
                            } else {
                              newWishlist.add(productId);
                            }
                            setWishlist(newWishlist);
                          }}
                          className={`absolute top-3 right-3 p-2 shadow-lg transition-all duration-300 hover:scale-110 ${
                            wishlist.has(product.name)
                              ? "bg-white/90 backdrop-blur-sm opacity-100"
                              : "bg-white/90 backdrop-blur-sm border-2 border-red-400 opacity-0 group-hover:opacity-100"
                          } rounded-full`}
                        >
                          <svg
                            className={`w-4 h-4 transition-colors duration-200 ${
                              wishlist.has(product.name)
                                ? "text-red-600"
                                : "text-white"
                            }`}
                            fill={`${
                              wishlist.has(product.name)
                                ? "currentColor"
                                : "white"
                            }`}
                            stroke={`${
                              wishlist.has(product.name) ? "none" : "red"
                            }`}
                            strokeWidth="2"
                            viewBox="0 0 20 20"
                          >
                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                          </svg>
                        </button>
                      </div>
                      <div className="p-5 bg-gradient-to-b from-transparent to-white">
                        <h4 className="text-red-800 font-bold text-base mb-2 leading-tight group-hover:text-red-600 transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-gray-500 text-sm mb-3 line-clamp-2 italic">
                          {product.role}
                        </p>
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-2xl font-bold bg-gradient-to-r from-red-800 to-red-600 bg-clip-text text-transparent">
                            ₹{product.price}
                          </p>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400">★</span>
                            <span className="text-sm text-gray-600">4.8</span>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button className="w-full bg-gradient-to-r from-red-800 to-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:from-red-700 hover:to-red-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                            Add to Cart
                          </button>
                        </div>
                      </div>
                      {/* Glow margin effect on hover */}
                      <div
                        className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          top: "-2px",
                          left: "-2px",
                          right: "-2px",
                          bottom: "-2px",
                          background:
                            "linear-gradient(45deg, #ff69b4, #ffb6c1, #ffc0cb, #ffb6c1, #ff69b4)",
                          backgroundSize: "300% 300%",
                          filter: "blur(2px) brightness(1.8)",
                          zIndex: -1,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Make it a Hamper Section */}
              <div className="text-center">
                <div className="relative inline-block px-2">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 blur-2xl opacity-20"></div>
                  <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-12 py-6 shadow-2xl max-w-2xl transition-all duration-300 hover:shadow-red-400/30 hover:shadow-3xl hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-light text-white tracking-wide">
                            Complete Collection
                          </h3>
                          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-0.5 rounded-full text-xs font-medium shadow-lg border border-pink-400/50">
                            30% OFF
                          </div>
                        </div>
                        <div className="flex items-baseline gap-4">
                          <div>
                            <span className="text-white/50 text-sm line-through">
                              ₹
                              {Math.round(
                                layeringCombo.reduce(
                                  (total, product) => total + product.price,
                                  0
                                ) * 1.3
                              )}
                            </span>
                            <p className="text-2xl font-thin text-white tracking-tight">
                              ₹
                              {layeringCombo.reduce(
                                (total, product) => total + product.price,
                                0
                              )}
                            </p>
                          </div>
                          <span className="text-white/70 text-sm">
                            {layeringCombo.length} products for "
                            {layeringOccasion}"
                          </span>
                        </div>
                      </div>
                      <button className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-8 py-3 rounded-xl text-sm font-medium tracking-wide hover:from-red-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-pink-400/50 hover:shadow-2xl ml-4">
                        Make it a Hamper
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* GIFT SECTION */}
      <section className="py-20 bg-gradient-to-br from-rose-50 to-pink-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
              Gift a mood. Not a boring box.
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Perfect for birthdays, anniversaries, or self-love that feels
              expensive.
            </p>
          </div>

          {/* Mini Perks */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Ready-to-gift packaging
                </h4>
                <p className="text-sm text-gray-600">Beautiful presentation</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Gift note included
                </h4>
                <p className="text-sm text-gray-600">Personal messages</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  "No wrong choice" bestsellers
                </h4>
                <p className="text-sm text-gray-600">Crowd favorites only</p>
              </div>
            </div>
          </div>

          {/* Gift Builder Section */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12">
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6 text-center">
              Create Your Custom Gift
            </h3>
            <p className="text-gray-600 text-center mb-8">
              Choose products to create the perfect gift combination
            </p>

            {/* Gift Steps */}
            <div className="flex justify-center items-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 ${
                    giftStep === 1
                      ? "bg-gradient-to-r from-rose-500 to-pink-500"
                      : "bg-red-500"
                  } rounded-full flex items-center justify-center text-white font-semibold text-sm`}
                >
                  {giftStep > 1 ? "✓" : "1"}
                </div>
                <span
                  className={`${
                    giftStep === 1 ? "text-gray-900" : "text-red-600"
                  } font-medium`}
                >
                  Choose Fragrances
                </span>
              </div>
              <div
                className={`w-12 h-0.5 ${
                  giftStep > 1 ? "bg-red-500" : "bg-gray-300"
                }`}
              ></div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 ${
                    giftStep === 2
                      ? "bg-gradient-to-r from-rose-500 to-pink-500"
                      : giftStep > 2
                      ? "bg-red-500"
                      : "bg-gray-300"
                  } rounded-full flex items-center justify-center ${
                    giftStep === 2
                      ? "text-white"
                      : giftStep > 2
                      ? "text-white"
                      : "text-gray-500"
                  } font-semibold text-sm`}
                >
                  {giftStep > 2 ? "✓" : "2"}
                </div>
                <span
                  className={`${
                    giftStep === 2
                      ? "text-gray-900"
                      : giftStep > 2
                      ? "text-red-600"
                      : "text-gray-500"
                  } font-medium`}
                >
                  Choose Cosmetics
                </span>
              </div>
              <div
                className={`w-12 h-0.5 ${
                  giftStep > 2 ? "bg-red-500" : "bg-gray-300"
                }`}
              ></div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 ${
                    giftStep === 3
                      ? "bg-gradient-to-r from-rose-500 to-pink-500"
                      : "bg-gray-300"
                  } rounded-full flex items-center justify-center ${
                    giftStep === 3 ? "text-white" : "text-gray-500"
                  } font-semibold text-sm`}
                >
                  3
                </div>
                <span
                  className={`${
                    giftStep === 3 ? "text-gray-900" : "text-gray-500"
                  } font-medium`}
                >
                  Review & Complete
                </span>
              </div>
            </div>

            {/* Step 1: Fragrances */}
            {giftStep === 1 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Select Fragrances
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    "Rose Paradise",
                    "Vanilla Dream",
                    "Ocean Breeze",
                    "Midnight Jasmine",
                  ].map((product, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        const newSelection = new Set(selectedFragrances);
                        if (newSelection.has(product)) {
                          newSelection.delete(product);
                        } else {
                          newSelection.add(product);
                        }
                        setSelectedFragrances(newSelection);
                      }}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                        selectedFragrances.has(product)
                          ? "border-rose-500 bg-rose-50"
                          : "border-gray-200 hover:border-rose-400 hover:bg-rose-50"
                      }`}
                    >
                      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 relative">
                        {selectedFragrances.has(product) && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <h5 className="font-medium text-gray-900 text-sm">
                        {product}
                      </h5>
                      <p className="text-gray-600 text-sm">
                        ₹{999 + index * 100}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Cosmetics */}
            {giftStep === 2 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Select Cosmetics
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    "Lipstick Set",
                    "Face Serum",
                    "Eyeshadow Palette",
                    "Blush Compact",
                  ].map((product, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        const newSelection = new Set(selectedCosmetics);
                        if (newSelection.has(product)) {
                          newSelection.delete(product);
                        } else {
                          newSelection.add(product);
                        }
                        setSelectedCosmetics(newSelection);
                      }}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                        selectedCosmetics.has(product)
                          ? "border-rose-500 bg-rose-50"
                          : "border-gray-200 hover:border-rose-400 hover:bg-rose-50"
                      }`}
                    >
                      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 relative">
                        {selectedCosmetics.has(product) && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <h5 className="font-medium text-gray-900 text-sm">
                        {product}
                      </h5>
                      <p className="text-gray-600 text-sm">
                        ₹{599 + index * 100}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {giftStep === 3 && (
              <div className="mb-6">
                <h4 className="text-xl font-serif font-semibold text-gray-900 mb-6 text-center">
                  Review Your Perfect Gift
                </h4>
                <div className="bg-gradient-to-br from-white via-rose-50 to-pink-50 rounded-2xl p-8 border border-rose-200 shadow-lg">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-rose-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9.527 7.5H3a1 1 0 00-1 1v8a1 1 0 001 1h6.527L15 18.5V5.5L9.527 7.5z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-6 6m0 0l-6-6m6 6V3"
                            />
                          </svg>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900">
                            Fragrances
                          </h5>
                          <p className="text-sm text-gray-600">
                            {selectedFragrances.size} selected
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {Array.from(selectedFragrances).map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-rose-50 rounded-lg border border-rose-200"
                          >
                            <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                            <span className="text-gray-800 font-medium">
                              {item}
                            </span>
                            <span className="ml-auto text-rose-600 font-semibold">
                              ₹{999 + index * 100}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-pink-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                            />
                          </svg>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900">
                            Cosmetics
                          </h5>
                          <p className="text-sm text-gray-600">
                            {selectedCosmetics.size} selected
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {Array.from(selectedCosmetics).map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg border border-pink-200"
                          >
                            <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                            <span className="text-gray-800 font-medium">
                              {item}
                            </span>
                            <span className="ml-auto text-pink-600 font-semibold">
                              ₹{599 + index * 100}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Gift Note Section */}
                  <div className="mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-rose-400 rounded-2xl blur-xl opacity-30"></div>
                      <div className="relative bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 rounded-2xl p-8 border border-pink-200 shadow-lg backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg">
                            <svg
                              className="w-6 h-6 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                          <div>
                            <h5 className="text-xl font-serif font-bold text-rose-900">
                              Personalized Gift Note
                            </h5>
                            <p className="text-sm text-rose-600 font-medium">
                              Add your heartfelt message
                            </p>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="absolute top-3 left-3 opacity-10">
                            <svg
                              className="w-8 h-8 text-rose-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                clip-rule="evenodd"
                              />
                            </svg>
                          </div>
                          <textarea
                            value={giftNote}
                            onChange={(e) => setGiftNote(e.target.value)}
                            placeholder="Dear someone, I hope this gift brings you as much joy as you bring me..."
                            className="w-full p-5 border-2 border-pink-200 rounded-xl bg-white/90 backdrop-blur-sm text-gray-900 placeholder-pink-300 focus:outline-none focus:ring-4 focus:ring-pink-200 focus:border-pink-400 resize-none font-medium shadow-inner"
                            rows="5"
                            maxLength="200"
                          />
                          <div className="absolute bottom-3 right-3 opacity-10">
                            <svg
                              className="w-8 h-8 text-rose-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                clip-rule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                giftNote.length > 180
                                  ? "bg-red-500"
                                  : giftNote.length > 100
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }`}
                            ></div>
                            <p className="text-sm font-medium text-rose-700">
                              {giftNote.length}/200 characters
                            </p>
                          </div>
                          {giftNote && (
                            <div className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span>Note ready</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-rose-200 pt-6">
                    <div className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-red-100 text-sm">Total Items</p>
                          <p className="text-2xl font-bold">
                            {selectedFragrances.size + selectedCosmetics.size}{" "}
                            Products
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-red-100 text-sm mb-1">
                            Gift Total
                          </p>
                          <p className="text-3xl font-bold">
                            ₹
                            {Array.from(selectedFragrances).reduce(
                              (sum, item, index) => sum + 999 + index * 100,
                              0
                            ) +
                              Array.from(selectedCosmetics).reduce(
                                (sum, item, index) => sum + 599 + index * 100,
                                0
                              )}
                          </p>
                        </div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                        <p className="text-sm font-medium">
                          {giftNote
                            ? "Personal note included"
                            : "Ready to gift with premium packaging"}{" "}
                          {giftNote ? "&" : "&"} note included
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="text-center flex gap-4 justify-center">
              {giftStep > 1 && (
                <button
                  onClick={() => setGiftStep(giftStep - 1)}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300"
                >
                  Previous
                </button>
              )}
              {giftStep < 3 && (
                <button
                  onClick={() => {
                    if (giftStep === 1 && selectedFragrances.size === 0) {
                      return; // Can't proceed without selecting fragrances
                    }
                    if (giftStep === 2 && selectedCosmetics.size === 0) {
                      return; // Can't proceed without selecting cosmetics
                    }
                    setGiftStep(giftStep + 1);
                  }}
                  disabled={
                    (giftStep === 1 && selectedFragrances.size === 0) ||
                    (giftStep === 2 && selectedCosmetics.size === 0)
                  }
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                    (giftStep === 1 && selectedFragrances.size === 0) ||
                    (giftStep === 2 && selectedCosmetics.size === 0)
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600"
                  }`}
                >
                  {giftStep === 1
                    ? "Next: Choose Cosmetics"
                    : giftStep === 2
                    ? "Next: Review & Complete"
                    : "Complete Gift"}
                </button>
              )}
              {giftStep === 3 && (
                <button className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Complete Gift Order
                </button>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-8 py-4 rounded-full font-semibold hover:from-gray-800 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-xl">
              Shop Gifts
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className=" py-20 bg-gradient-to-r from-rose-900 to-red-950 text-white text-white text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-6">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Want to smell expensive every day?
            </h2>
            <p className="text-lg text-red-100 mb-8 max-w-2xl mx-auto">
              Join our exclusive community for fragrance enthusiasts and get
              access to new launches, special offers.
            </p>
          </div>

          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col sm:flex-row gap-4 mb-4 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:outline-none"
              required
            />

            <button
              type="submit"
              className="px-8 py-4 bg-white text-red-800 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap transform hover:scale-105"
            >
              Join Revieree
            </button>
          </form>

          {newsletterMessage && (
            <div className="mt-4 p-4 bg-green-500 text-white rounded-lg">
              {newsletterMessage}
            </div>
          )}
        </div>
      </section>
      {/* Scent Quiz Popup */}
      <ScentQuizPopup
        isOpen={showQuizPopup}
        onClose={() => setShowQuizPopup(false)}
        onStartQuiz={handleStartQuiz}
      />
    </div>
  );
};

export default Home;
