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

      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Career Blog & Resources
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert advice, practical tips, and insider strategies to accelerate your career in South Africa
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
              <article key={post.slug} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
                {/* Post Header */}
                <div className="p-6">
                  <div className="text-6xl mb-4">{post.image}</div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {post.date}
                    </span>
                    <span>{post.readTime}</span>
                  </div>

                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full mb-3">
                    {post.category}
                  </span>

                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <User className="w-4 h-4 mr-1" />
                    {post.author}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="inline-flex items-center text-xs text-gray-600">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      Coming soon...
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => sharePost(post, 'whatsapp')}
                        className="p-2 text-gray-500 hover:text-green-600 transition-colors"
                        title="Share on WhatsApp"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => sharePost(post, 'facebook')}
                        className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                        title="Share on Facebook"
                      >
                        <Facebook className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => sharePost(post, 'twitter')}
                        className="p-2 text-gray-500 hover:text-blue-400 transition-colors"
                        title="Share on Twitter"
                      >
                        <Twitter className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => sharePost(post, 'linkedin')}
                        className="p-2 text-gray-500 hover:text-blue-700 transition-colors"
                        title="Share on LinkedIn"
                      >
                        <Linkedin className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => copyLink(post)}
                        className={`p-2 transition-colors ${
                          copiedLink === post.slug ? 'text-green-600' : 'text-gray-500 hover:text-green-600'
                        }`}
                        title={copiedLink === post.slug ? 'Copied!' : 'Copy link'}
                      >
                        <LinkIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Job Search?</h2>
            <p className="text-lg mb-6 opacity-90">
              Apply the strategies you have learned and find your dream job today
            </p>
            <Link href="/">
              <a className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
                Search Jobs Now
              </a>
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
