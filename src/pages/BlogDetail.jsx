import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Share2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { getBlogById, getBlogs } from '../utils/storage';

const BlogDetail = () => {
  const { id } = useParams();
  const blog = getBlogById(id);
  const validBlog = blog?.status === 'Published' ? blog : null;
  
  const relatedBlogs = getBlogs()
    .filter(b => b.id !== parseInt(id) && b.category === validBlog?.category && b.status === 'Published')
    .slice(0, 3);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!validBlog) {
    return (
      <div className="min-h-screen pt-0 pb-16">
        {/* Hero Section */}
        <section className="relative h-[80vh] min-h-[550px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/src/assets/images/adc8fc81eac678aba089250ca3074d47.jpg"
              alt="Blog"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/15"></div>
          </div>
          <div className="relative h-full flex items-center justify-center px-6">
            <div className="text-center">
              <h1
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                style={{ color: "#FF8C00", textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
              >
                BLOG
              </h1>
            </div>
          </div>
        </section>
        <div className="container-custom py-16">
          <div className="text-center">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
              Article not found
            </h2>
            <Link to="/blogs" className="text-burgundy-700 hover:underline">
              Back to all articles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-0 pb-16">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={validBlog.image}
            alt={validBlog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="absolute inset-0 flex flex-col justify-end pb-12 px-6">
          <div className="container-custom">
            <span className="inline-block px-3 py-1 bg-burgundy-700 text-sm font-semibold rounded-full mb-4 text-white">
              {validBlog.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              {validBlog.title}
            </h1>
            <div className="flex items-center space-x-6 text-sm text-white">
              <span className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>{formatDate(validBlog.date)}</span>
              </span>
              <span className="flex items-center space-x-2">
                <User size={16} />
                <span>{validBlog.author}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Back Button */}
      <div className="container-custom py-6">
        <Link
          to="/blogs"
          className="inline-flex items-center space-x-2 text-burgundy-700 hover:text-burgundy-800 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Articles</span>
        </Link>
      </div>

      {/* Article Content */}
      <section className="container-custom">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Share & Like */}
            <div className="flex items-center justify-between mb-8 pb-8 border-b">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 bg-burgundy-100 text-burgundy-700 rounded-lg hover:bg-burgundy-200 transition-colors">
                  <Heart size={18} />
                  <span className="text-sm font-medium">Like</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Share2 size={18} />
                  <span className="text-sm font-medium">Share</span>
                </button>
              </div>
              <span className="text-sm text-gray-500">5 min read</span>
            </div>

            {/* Article Text */}
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                {validBlog.excerpt}
              </p>

              <div className="text-gray-700 leading-relaxed space-y-6">
                <p>{validBlog.content}</p>

                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                  quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                  consequat.
                </p>

                <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-4">
                  Understanding the Basics
                </h2>

                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                  eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                  sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>

                <blockquote className="border-l-4 border-burgundy-700 pl-6 my-8 italic text-gray-600">
                  "Luxury is in each detail, in every scent that tells a story, in every shade
                  that enhances your natural beauty."
                </blockquote>

                <h2 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-4">
                  Expert Tips & Techniques
                </h2>

                <p>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                  doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
                  veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                </p>

                <ul className="list-disc list-inside space-y-2 my-6">
                  <li>Choose fragrances that complement your natural scent</li>
                  <li>Apply perfume to pulse points for longer lasting effect</li>
                  <li>Layer different products for a unique signature scent</li>
                  <li>Store fragrances in cool, dark places to preserve quality</li>
                </ul>

                <p>
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,
                  sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                  Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
                  adipisci velit.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedBlogs.length > 0 && (
        <section className="section-padding bg-cream-50 mt-16">
          <div className="container-custom">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">
              Related Articles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedBlogs.map((relatedBlog) => (
                <motion.div
                  key={relatedBlog.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                >
                  <Link to={`/blogs/${relatedBlog.id}`} className="group block">
                    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={relatedBlog.image}
                          alt={relatedBlog.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      <div className="p-6">
                        <h3 className="text-lg font-serif font-bold text-gray-900 mb-2 group-hover:text-burgundy-700 transition-colors line-clamp-2">
                          {relatedBlog.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {relatedBlog.excerpt}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogDetail;