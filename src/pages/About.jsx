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
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
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

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden p-4 md:p-8">
        <div className="absolute inset-0">
          <img
            src="/assets/images/about/ee25d2f193c3dbc7db0758a5720714de.jpg"
            alt="About Hero Background"
            className="w-full h-full object-cover"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-5xl mx-auto"
        >
          <div className="bg-red-900/20 backdrop-blur-md rounded-3xl p-6 sm:p-10 md:p-16 shadow-2xl border border-red-300/30 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
              {/* Left - Image */}
              <div className="overflow-hidden rounded-3xl">
                <img
                  src="/assets/images/about/ee25d2f193c3dbc7db0758a5720714de.jpg"
                  alt="About Square"
                  className="w-full h-56 sm:h-72 md:h-96 object-cover"
                />
              </div>

              {/* Right - Text */}
              <div className="text-left space-y-4 md:space-y-6">
                <div>
                  <p
                    className="text-orange-300/90 text-base md:text-2xl font-thin tracking-wider mb-3 italic"
                    style={{ fontFamily: "Now, serif" }}
                  >
                    Soft enough to pull them in
                  </p>
                  <h1
                    className="text-2xl sm:text-3xl md:text-5xl font-light text-transparent bg-clip-text bg-gradient-to-r from-yellow-700 via-amber-600 to-yellow-600 leading-tight mb-4"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    BOLD Enough to Stay
                  </h1>
                </div>
                <div className="text-amber-600/90 text-base md:text-lg leading-relaxed">
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

      {/* Story Section */}
      <section className="py-16 md:py-20 bg-red-950">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Mobile - stacked */}
          <div className="block lg:hidden space-y-10">
            <div className="relative h-64 sm:h-80 overflow-hidden rounded-3xl shadow-2xl">
              <img
                src="/assets/images/about/LIPS.png"
                alt="About Us Story"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-orange-300/90 leading-relaxed text-base text-justify py-4"
            >
              Somewhere between{" "}
              <span className="italic">"I don't feel like myself"</span> and{" "}
              <span className="italic">"watch me own the room"</span>, there's a
              version of you waiting to show up, sharper, hotter, untouchable.
              This is for the days you want a glow-up that feels instant,
              effortless, almost unfair. One spritz, one swipe, and suddenly
              you're not trying to be pretty, you're becoming unforgettable.
            </motion.p>
            <div className="bg-gradient-to-br from-pink-900/30 to-pink-200/30 backdrop-blur-md rounded-3xl p-6 border border-amber-100/20 shadow-2xl ring-2 ring-rose-500/50 mt-4">
              <div className="space-y-4 text-center">
                <h3 className="text-xl font-light text-amber-400/90">
                  Crafted with Purpose
                </h3>
                <p className="text-orange-300/90 leading-relaxed text-sm">
                  Each fragrance is meticulously crafted using the finest
                  ingredients, ensuring a scent that not only captivates but
                  also tells your story.
                </p>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-amber-300/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400/90 mb-1">
                      100+
                    </div>
                    <div className="text-xs text-orange-200/80">
                      Premium Notes
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400 mb-1">
                      50+
                    </div>
                    <div className="text-xs text-orange-200/80">
                      Unique Blends
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400 mb-1">
                      ∞
                    </div>
                    <div className="text-xs text-orange-200/80">
                      Possibilities
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop - image left, text overlaps it, card far right */}
          <div className="hidden lg:grid grid-cols-[1fr_360px] gap-8 items-center">
            {/* Left side - image + overlapping text together */}
            <div className="relative h-[420px]">
              {/* Image - left portion */}
              <div className="absolute left-0 top-0 w-[55%] h-full overflow-hidden rounded-3xl shadow-2xl">
                <img
                  src="/assets/images/about/LIPS.png"
                  alt="About Us Story"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-950/20 to-red-950/70"></div>
              </div>

              {/* Text - starts at 30%, overlaps right half of image and extends beyond */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="absolute left-[28%] right-0 top-0 h-full flex items-center pl-6"
              >
                <p className="text-orange-300/95 leading-relaxed text-lg">
                  Somewhere between{" "}
                  <span className="italic">"I don't feel like myself"</span> and{" "}
                  <span className="italic">"watch me own the room"</span>,
                  there's a version of you waiting to show up, sharper, hotter,
                  untouchable. This is for the days you want a glow-up that
                  feels instant, effortless, almost unfair. One spritz, one
                  swipe, and suddenly you're not trying to be pretty, you're
                  becoming unforgettable.
                </p>
              </motion.div>
            </div>

            {/* Col 2 - Crafted with Purpose card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-br from-pink-900/30 to-pink-200/30 backdrop-blur-md rounded-3xl p-8 border border-amber-100/20 shadow-2xl ring-2 ring-rose-500/50"
            >
              <div className="space-y-6 text-center">
                <div>
                  <h3 className="text-2xl md:text-3xl font-light text-amber-400/90 mb-4">
                    Crafted with Purpose
                  </h3>
                  <p className="text-orange-300/90 leading-relaxed">
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-12 bg-red-950">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center">
            <span className="text-orange-800 font-light italic text-lg md:text-2xl">
              Because confidence isn't something you're born with,
              <br />
              it's something you wear.
            </span>
          </div>
        </div>
      </section>

      {/* Our Philosophy Section */}
      <section className="py-16 md:py-20 bg-red-950">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Left - Philosophy Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-4 md:space-y-6"
            >
              <h2 className="text-3xl md:text-5xl font-light text-transparent bg-clip-text bg-gradient-to-r from-yellow-700 via-amber-600 to-yellow-600 leading-tight">
                Our Philosophy
              </h2>
              <p className="text-amber-600 leading-relaxed text-base md:text-lg text-justify">
                We believe that fragrance is more than just a scent—it's an
                extension of your identity, a silent language that speaks
                volumes before you say a word.
              </p>
              <p className="text-amber-600 leading-relaxed text-base md:text-lg text-justify">
                Every bottle we create is a testament to the art of perfumery,
                blending tradition with innovation to craft experiences that
                resonate with your unique essence.
              </p>
              <p className="text-amber-600 leading-relaxed text-base md:text-lg text-justify">
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
            >
              <div className="overflow-hidden rounded-3xl shadow-2xl">
                <img
                  src="/assets/images/about/LIPS.png"
                  alt="Our Philosophy"
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4 Feature Cards Grid */}
      <section className="py-16 md:py-24 bg-red-950">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-48 md:h-64 rounded-2xl overflow-hidden cursor-pointer shadow-2xl ring-2 ring-rose-200/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-900 to-red-800"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent"></div>
              <div className="relative z-10 p-4 md:p-6 h-full flex flex-col justify-between">
                <p className="text-white/50 text-xs uppercase tracking-widest">
                  The feeling
                </p>
                <div>
                  <h3 className="text-white font-bold text-sm md:text-lg mb-1 leading-snug">
                    You walked in.
                    <br />
                    The room noticed.
                  </h3>
                  <p className="text-white/70 text-xs md:text-sm">
                    Before you said a word.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative h-48 md:h-64 rounded-2xl overflow-hidden cursor-pointer shadow-2xl ring-2 ring-rose-200/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-800 to-pink-900"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent"></div>
              <div className="relative z-10 p-4 md:p-6 h-full flex flex-col justify-between">
                <p className="text-white/50 text-xs uppercase tracking-widest">
                  The question
                </p>
                <div>
                  <h3 className="text-white font-bold text-sm md:text-lg mb-1 leading-snug">
                    "What are you wearing?"
                  </h3>
                  <p className="text-white/70 text-xs md:text-sm">
                    The best compliment you'll ever get.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-48 md:h-64 rounded-2xl overflow-hidden cursor-pointer shadow-2xl ring-2 ring-rose-200/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-900 to-rose-800"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent"></div>
              <div className="relative z-10 p-4 md:p-6 h-full flex flex-col justify-between">
                <p className="text-white/50 text-xs uppercase tracking-widest">
                  The power
                </p>
                <div>
                  <h3 className="text-white font-bold text-sm md:text-lg mb-1 leading-snug">
                    Soft enough to draw them in. Bold enough to stay.
                  </h3>
                </div>
              </div>
            </motion.div>

            {/* Card 4 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative h-48 md:h-64 rounded-2xl overflow-hidden cursor-pointer shadow-2xl ring-2 ring-rose-200/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-900 to-rose-800"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent"></div>
              <div className="relative z-10 p-4 md:p-6 h-full flex flex-col justify-between">
                <p className="text-white/50 text-xs uppercase tracking-widest">
                  The memory
                </p>
                <div>
                  <h3 className="text-white font-bold text-sm md:text-lg mb-1 leading-snug">
                    They forgot your name.
                    <br />
                    Not your scent.
                  </h3>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bottom Banner Section */}
      <section className="relative py-16 md:py-24 flex items-center overflow-hidden bg-red-950">
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-white leading-tight mb-4 md:mb-6">
                PREMIUM LINE ONLY
              </h2>
              <p className="text-base md:text-lg text-white/90 leading-relaxed">
                Our fragrances undergo strict selective selection, ensuring
                every bottle meets the highest standards of quality and
                excellence.
              </p>
            </motion.div>

            {/* Right */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-white/10 backdrop-blur-md rounded-full px-4 md:px-6 py-3 inline-block mb-6">
                <p className="text-white text-sm md:text-lg font-medium">
                  "When fragrance is not just an object"
                </p>
              </div>
              <div className="text-white/80 space-y-4 text-sm md:text-base">
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
