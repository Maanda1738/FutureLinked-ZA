import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { logShare } from '../utils/analytics';
import { Calendar, User, Tag, Facebook, Twitter, Linkedin, Link as LinkIcon, MessageCircle } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedLink, setCopiedLink] = useState(null);

  const categories = ['All', 'Career Advice', 'CV Tips', 'Bursaries', 'Interview Tips', 'Industry Insights'];

  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const sharePost = (post, platform) => {
    const url = `https://futurelinked.co.za/blog/${post.slug}`;
    const text = `${post.title} - ${post.excerpt.substring(0, 100)}...`;
    
    let shareUrl;
    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      logShare('blog_post', post.title, platform);
    }
  };

  const copyLink = (post) => {
    const url = `https://futurelinked.co.za/blog/${post.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(post.slug);
    setTimeout(() => setCopiedLink(null), 2000);
    logShare('blog_post', post.title, 'copy_link');
  };

  return (
    <>
      <Head>
        <title>Career Blog - FutureLinked South Africa</title>
        <meta name="description" content="Expert career advice, CV tips, bursary guides, and job search strategies for South African job seekers. Stay updated with the latest career trends and opportunities." />
        <meta name="keywords" content="South Africa career advice, CV writing tips, bursary applications, job search strategies, interview tips, SA employment" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://futurelinked.co.za/blog" />
        <meta property="og:title" content="Career Blog - FutureLinked South Africa" />
        <meta property="og:description" content="Expert career advice, CV tips, bursary guides, and job search strategies for South African job seekers." />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://futurelinked.co.za/blog" />
        <meta property="twitter:title" content="Career Blog - FutureLinked South Africa" />
        <meta property="twitter:description" content="Expert career advice, CV tips, bursary guides, and job search strategies for South African job seekers." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section - MODERNIZED */}
          <div className="text-center mb-16 animate-fadeIn">
            <div className="inline-block mb-6">
              <span className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                📚 CAREER INSIGHTS & GUIDES
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              Expert Career Advice
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                For Your Success
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Practical tips, insider strategies, and expert guidance to accelerate your career in South Africa
            </p>
          </div>

          {/* Category Filter - IMPROVED */}
          <div className="flex flex-wrap justify-center gap-3 mb-12 animate-slideUp">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200 hover:border-green-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog Posts Grid - ENHANCED */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
            {filteredPosts.map(post => (
              <article key={post.slug} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden transform hover:-translate-y-2">
                {/* Post Header */}
                <div className="p-8">
                  <div className="text-7xl mb-6 transform group-hover:scale-110 transition-transform">{post.image}</div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center bg-gray-100 px-3 py-1.5 rounded-lg">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      {new Date(post.date).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg font-medium">{post.readTime}</span>
                  </div>

                  <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 text-xs font-bold rounded-full mb-4">
                    {post.category}
                  </span>

                  <Link href={`/articles/${post.slug}`} className="block mb-4">
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors leading-tight">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mb-6 bg-gray-50 px-3 py-2 rounded-lg">
                    <User className="w-4 h-4 mr-2" />
                    <span className="font-medium">{post.author}</span>
                  </div>

                  {/* Read More Button */}
                  <Link href={`/articles/${post.slug}`} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all text-sm font-bold mb-6 shadow-md group-hover:shadow-lg transform group-hover:scale-105">
                    Read Full Article
                    <span className="text-xl">→</span>
                  </Link>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="inline-flex items-center text-xs text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-6 border-t-2 border-gray-100">
                    <div className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">
                      Share This Article:
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => sharePost(post, 'whatsapp')}
                        className="flex-1 p-2.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-all transform hover:scale-105"
                        title="Share on WhatsApp"
                      >
                        <MessageCircle className="w-5 h-5 mx-auto" />
                      </button>
                      <button
                        onClick={() => sharePost(post, 'facebook')}
                        className="flex-1 p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-all transform hover:scale-105"
                        title="Share on Facebook"
                      >
                        <Facebook className="w-5 h-5 mx-auto" />
                      </button>
                      <button
                        onClick={() => sharePost(post, 'twitter')}
                        className="flex-1 p-2.5 bg-sky-50 text-sky-600 hover:bg-sky-100 rounded-lg transition-all transform hover:scale-105"
                        title="Share on Twitter"
                      >
                        <Twitter className="w-5 h-5 mx-auto" />
                      </button>
                      <button
                        onClick={() => sharePost(post, 'linkedin')}
                        className="flex-1 p-2.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all transform hover:scale-105"
                        title="Share on LinkedIn"
                      >
                        <Linkedin className="w-5 h-5 mx-auto" />
                      </button>
                      <button
                        onClick={() => copyLink(post)}
                        className={`flex-1 p-2.5 rounded-lg transition-all transform hover:scale-105 ${
                          copiedLink === post.slug 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title={copiedLink === post.slug ? 'Copied!' : 'Copy link'}
                      >
                        <LinkIcon className="w-5 h-5 mx-auto" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* CTA Section - ENHANCED */}
          <div className="mt-20 bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl transform hover:scale-105 transition-all">
            <div className="text-6xl mb-6 animate-bounce">🚀</div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Ready to Land Your Dream Job?</h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
              Apply what you've learned and start your job search journey today!
            </p>
            <Link href="/" className="inline-flex items-center gap-3 bg-white text-green-600 px-10 py-5 rounded-2xl font-extrabold text-xl hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105">
              <span>Start Searching Jobs</span>
              <span className="text-2xl">→</span>
            </Link>
            <div className="mt-8 flex items-center justify-center gap-8 text-sm opacity-80">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                10K+ Active Jobs
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                100% Free
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                No Sign-ups
              </span>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
