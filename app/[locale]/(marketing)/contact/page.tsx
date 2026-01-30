export default function ContactPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">Contact Us</h1>
        
        <div className="space-y-8 text-zinc-300">
          <section>
            <p className="text-lg mb-6">
              Have a question, feedback, or need support? We're here to help! 
              Get in touch with us using any of the methods below.
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Email Support */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
              <div className="text-3xl mb-4">📧</div>
              <h3 className="text-xl font-semibold text-white mb-2">Email Support</h3>
              <p className="text-zinc-400 mb-4">
                For general inquiries and support questions
              </p>
              <a 
                href="mailto:support@learnchinese.com" 
                className="text-red-500 hover:text-red-400 font-medium"
              >
                support@learnchinese.com
              </a>
            </div>

            {/* Technical Support */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
              <div className="text-3xl mb-4">🔧</div>
              <h3 className="text-xl font-semibold text-white mb-2">Technical Support</h3>
              <p className="text-zinc-400 mb-4">
                For technical issues and bug reports
              </p>
              <a 
                href="mailto:tech@learnchinese.com" 
                className="text-red-500 hover:text-red-400 font-medium"
              >
                tech@learnchinese.com
              </a>
            </div>

            {/* Business Inquiries */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
              <div className="text-3xl mb-4">💼</div>
              <h3 className="text-xl font-semibold text-white mb-2">Business Inquiries</h3>
              <p className="text-zinc-400 mb-4">
                For partnerships and enterprise solutions
              </p>
              <a 
                href="mailto:business@learnchinese.com" 
                className="text-red-500 hover:text-red-400 font-medium"
              >
                business@learnchinese.com
              </a>
            </div>

            {/* Social Media */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
              <div className="text-3xl mb-4">🌐</div>
              <h3 className="text-xl font-semibold text-white mb-2">Social Media</h3>
              <p className="text-zinc-400 mb-4">
                Follow us for updates and learning tips
              </p>
              <div className="space-y-2">
                <div>Twitter: <span className="text-red-500">@LearnChinese</span></div>
                <div>Instagram: <span className="text-red-500">@LearnChineseApp</span></div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Send us a message</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-zinc-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="How can we help?"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-zinc-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Your message..."
                />
              </div>
              
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Send Message
              </button>
            </form>
          </section>

          {/* FAQ Link */}
          <section className="text-center">
            <p className="text-zinc-400">
              Looking for quick answers? Check out our{' '}
              <a href="/login" className="text-red-500 hover:text-red-400 font-medium">
                FAQ section
              </a>
              {' '}in the help center.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
