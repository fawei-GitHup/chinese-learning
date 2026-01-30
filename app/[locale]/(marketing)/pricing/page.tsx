export default function PricingPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Pricing Plans</h1>
          <p className="text-xl text-zinc-300">
            Choose the plan that's right for you
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 flex flex-col">
            <h3 className="text-2xl font-semibold text-white mb-2">Free</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold text-white">$0</span>
              <span className="text-zinc-400">/month</span>
            </div>
            <ul className="space-y-3 mb-6 flex-grow text-zinc-300">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>100 Basic lessons</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>HSK 1 content</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Basic dictionary access</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Community support</span>
              </li>
            </ul>
            <a
              href="/login"
              className="block text-center bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Get Started
            </a>
          </div>

          {/* Pro Plan */}
          <div className="bg-red-900/20 border-2 border-red-600 rounded-lg p-6 flex flex-col relative">
            <div className="absolute top-0 right-0 bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded-bl-lg rounded-tr-lg">
              Popular
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">Pro</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold text-white">$9.99</span>
              <span className="text-zinc-400">/month</span>
            </div>
            <ul className="space-y-3 mb-6 flex-grow text-zinc-300">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>All Free features</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>2000+ lessons (HSK 1-6)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Smart SRS system</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Interactive reading materials</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Progress tracking & analytics</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Priority support</span>
              </li>
            </ul>
            <a
              href="/login"
              className="block text-center bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Start Pro Trial
            </a>
          </div>

          {/* Premium Plan */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 flex flex-col">
            <h3 className="text-2xl font-semibold text-white mb-2">Premium</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold text-white">$19.99</span>
              <span className="text-zinc-400">/month</span>
            </div>
            <ul className="space-y-3 mb-6 flex-grow text-zinc-300">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>All Pro features</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Medical Chinese program</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Business Chinese module</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>1-on-1 tutoring sessions</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Custom learning paths</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Dedicated support</span>
              </li>
            </ul>
            <a
              href="/login"
              className="block text-center bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Go Premium
            </a>
          </div>
        </div>

        <div className="mt-12 text-center text-zinc-400">
          <p className="mb-4">All plans include a 14-day free trial. No credit card required.</p>
          <p>Annual billing available with 20% discount.</p>
        </div>
      </div>
    </div>
  );
}
