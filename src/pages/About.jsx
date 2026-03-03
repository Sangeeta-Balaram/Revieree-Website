import {
  Heart,
  Sparkles,
  Award,
  Users,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import VintageOrnament from "../components/VintageOrnament";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Passion & Craftsmanship",
      description:
        "Every product is crafted with meticulous attention to detail and a deep passion for excellence.",
    },
    {
      icon: Sparkles,
      title: "Luxury Redefined",
      description:
        "We believe luxury is not just about price—it's about quality, experience, and feeling.",
    },
    {
      icon: Award,
      title: "Premium Quality",
      description:
        "Only the finest ingredients and materials make it into our collections.",
    },
    {
      icon: Users,
      title: "Customer First",
      description:
        "Your satisfaction and elegance are at the heart of everything we create.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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

  return (
    <div className="min-h-screen relative">
      {/* Full Page Background */}
      <div className="fixed inset-0 -z-10">
        <img
          src="/assets/images/about/ee25d2f193c3dbc7db0758a5720714de.jpg"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>
      {/* Hero Section - Full Screen with Frosted Glass Panel */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden p-8">
        {/* Background - Your Image */}
        <div className="absolute inset-0">
          <img
            src="/assets/images/about/ee25d2f193c3dbc7db0758a5720714de.jpg"
            alt="About Hero Background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Frosted Glass Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-full mx-auto px-8 md:px-24 h-full flex items-center"
        >
          <div className="bg-red-900/20 backdrop-blur-md rounded-3xl p-16 md:p-32 shadow-2xl border border-red-300/30 w-full">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="md:col-span-1 md:col-start-1">
                {/* Left Side - Bigger Image */}
                <div className="overflow-hidden rounded-3xl">
                  <img
                    src="/assets/images/about/ee25d2f193c3dbc7db0758a5720714de.jpg"
                    alt="About Square"
                    className="w-full h-80 md:h-96 object-cover"
                  />
                </div>
              </div>

              {/* Right Side - Headline + Content */}
              <div className="text-left space-y-6">
                <div>
                  <p
                    className="text-orange-300/90 text-lg md:text-2xl font-thin tracking-wider mb-4 italic"
                    style={{ fontFamily: "Now, serif" }}
                  >
                    Soft enough to pull them in
                  </p>
                  <h1
                    className="text-3xl md:text-5xl font-light text-transparent bg-clip-text bg-gradient-to-r from-yellow-700 via-amber-600 to-yellow-600 leading-none mb-6"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    BOLD Enough to Stay
                  </h1>
                </div>
                <div className="text-amber-600/90 text-lg leading-relaxed">
                  <p className="text-justify">
                    For days you want to be delicate, and nights you want to be
                    dangerous, Revieree is beauty you wear, fragrance you
                    become, and confidence that stays longer than conversation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
      <section className="py-20 bg-red-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative bg-transparent">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center bg-transparent">
              {/* Left - Vertical Rectangle Image */}
              <div className="relative h-[300px] lg:h-[400px] max-w-md overflow-hidden rounded-3xl shadow-2xl ">
                <img
                  src="/assets/images/about/LIPS.png"
                  alt="About Us Story"
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay on image for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>

              {/* Right - Content Area */}
              <div className="relative">
                {/* Text Content (overlapping and extending beyond image) */}
                <div className="relative lg:-ml-96 lg:-mt-12 p-8 lg:p-16 h-full lg:h-[300px] flex flex-col justify-center">
                  {/* Badge - positioned to overlap the image area */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="inline-block mb-20"
                  ></motion.div>
                  {/* Main Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-orange-300/90 leading-relaxed text-lg mb-9 text-justify"
                  >
                    Somewhere between{" "}
                    <span className="italic">"I don't feel like myself"</span>
                    <br />
                    and <span className="italic">"watch me own the room"</span>,
                    there's a version of you
                    <br />
                    waiting to show up, sharper, hotter, untouchable.
                    <br />
                    This is for the days you want a glow-up that feels
                    <br />
                    instant, effortless, almost unfair. One spritz,
                    <br />
                    one swipe, and suddenly you're not
                    <br />
                    trying to be pretty, you're becoming unforgettable.
                    <br />
                  </motion.p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Last line below image and centered */}
      <section className="py-10 bg-red-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mt-32">
            <span className="text-orange-800 font-light italic text-2xl">
              Because confidence isn't something you're born with,
              <br />
              it's something you wear.
            </span>
          </div>
        </div>
      </section>

      {/* Our Philosophy Section */}
      <section className="py-10 bg-red-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left - Philosophy Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-light text-transparent bg-clip-text bg-gradient-to-r from-yellow-700 via-amber-600 to-yellow-600 leading-none">
                Our Philosophy
              </h2>
              <p className="text-amber-600 leading-relaxed text-lg text-justify">
                We believe that fragrance is more than just a scent—it's an
                extension of your identity, a silent language that speaks
                volumes before you say a word.
              </p>
              <p className="text-amber-600 leading-relaxed text-lg text-justify">
                Every bottle we create is a testament to the art of perfumery,
                blending tradition with innovation to craft experiences that
                resonate with your unique essence.
              </p>
              <p className="text-amber-600 leading-relaxed text-lg text-justify">
                Because true luxury isn't about what you wear—it's about how you
                feel when you wear it.
              </p>
            </motion.div>

            {/* Right - Philosophy Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="overflow-hidden rounded-3xl shadow-2xl">
                <img
                  src="/assets/images/about/LIPS.png"
                  alt="Our Philosophy"
                  className="w-full h-80 lg:h-96 object-cover"
                />
              </div>
            </motion.div>
          </div>

          {/* Philosophy Card - Positioned separately */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 250 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:ml-[37rem] lg:mr-[20rem] lg:-mt-[60rem]"
          >
            <div className="bg-gradient-to-br from-pink-900/30 to pink-200/30 backdrop-blur-md rounded-3xl p-6 border border-amber-100/20 shadow-2xl h-[24rem] ring-2 ring-rose-500/50 shadow-rose-500/50 w-[100%]">
              <div className="space-y-6 h-full flex flex-col justify-between text-center">
                <div>
                  <h3 className="text-2xl md:text-3xl font-light text-amber-400/90 mb-4 text-center">
                    Crafted with Purpose
                  </h3>
                  <p className="text-orange-300/90 leading-relaxed text-center">
                    Each fragrance is meticulously crafted using the finest
                    ingredients, ensuring a scent that not only captivates but
                    also tells your story.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-amber-300/20">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400/90 mb-2">
                      100+
                    </div>
                    <div className="text-sm text-orange-200/80">
                      Premium Notes
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400 mb-2">
                      50+
                    </div>
                    <div className="text-sm text-orange-200/80">
                      Unique Blends
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400 mb-2">
                      ∞
                    </div>
                    <div className="text-sm text-orange-200/80">
                      Possibilities
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4 Feature Cards Grid */}
      <section className="py-96 bg-red-950">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Card 1: Scent Test */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 220 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer shadow-2xl ring-2 ring-rose-200/50 shadow-rose-500/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-900 to-red-800"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent"></div>
              <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                <h3 className="text-white font-bold text-lg">SCENT TEST</h3>
                <p className="text-white/80 text-sm">
                  Find your perfect fragrance through our personality-based quiz
                  system
                </p>
              </div>
            </motion.div>

            {/* Card 2: Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 100 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer shadow-2xl ring-2 ring-rose-200/50 shadow-rose-500/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-800 to-pink-900"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent"></div>
              <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                <h3 className="text-white font-bold text-lg">INFO</h3>
                <p className="text-white/80 text-sm mb-4">
                  Expert articles and guides about fragrance notes and
                  combinations
                </p>
                <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-white/30 transition-colors flex items-center self-start">
                  PODCAST FOR YOU
                  <ChevronRight size={12} className="ml-1" />
                </button>
              </div>
            </motion.div>

            {/* Card 3: Feature */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 220 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer shadow-2xl ring-2 ring-rose-200/50 shadow-rose-500/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-900 to-rose-800"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent"></div>
              <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                <h3 className="text-white font-bold text-lg">FEATURE</h3>
                <p className="text-white/80 text-sm">
                  Each fragrance has its own passport - unique notes and story
                </p>
              </div>
            </motion.div>

            {/* Card 4: App */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 100 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer shadow-2xl ring-2 ring-rose-200/50 shadow-rose-500/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-900 to-rose-800"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent"></div>
              <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                <h3 className="text-white font-bold text-lg">APP</h3>
                <p className="text-white/80 text-sm">
                  Making your fragrance experience easier and more beautiful
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Next Large Banner Section */}
      <section className="relative h-auto py-12 flex items-center overflow-hidden pb-40">
        {/* Background Image - Glass/Greenhouse effect */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1579532572959-2c5e787914d0?w=1920&h=1080&fit=crop"
            alt="Luxury Fragrance Display"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-red-950"></div>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Banner Title */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight mb-6">
                PREMIUM LINE ONLY
              </h2>
              <p className="text-lg text-white/90 leading-relaxed max-w-xl">
                Our fragrances undergo strict selective selection, ensuring
                every bottle meets the highest standards of quality and
                excellence.
              </p>
            </motion.div>

            {/* Right - Overlay Text in Creative Layout */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-full px-6 py-3 inline-block mb-8">
                <p className="text-white text-lg font-medium">
                  "When fragrance is not just an object"
                </p>
              </div>

              <div className="text-white/80 space-y-4">
                <p>
                  We believe that true luxury lies in the details—the quality of
                  ingredients, the artistry of composition, and the experience
                  of wearing something that feels uniquely yours.
                </p>
                <p>
                  Each creation is a testament to our commitment to excellence
                  and your personal journey of self-expression.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
