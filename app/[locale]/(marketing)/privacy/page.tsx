export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">Privacy Policy</h1>
        
        <div className="space-y-6 text-zinc-300">
          <section>
            <p className="text-sm text-zinc-400 mb-6">Last updated: January 2026</p>
            <p className="text-lg">
              At LearnChinese, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Information We Collect</h2>
            <p className="mb-3">We collect information that you provide directly to us, including:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Account information (name, email address, password)</li>
              <li>Learning preferences and progress data</li>
              <li>Payment information (processed securely through third-party providers)</li>
              <li>Communications with our support team</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">How We Use Your Information</h2>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Personalize your learning experience</li>
              <li>Process your transactions and send related information</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Monitor and analyze trends, usage, and activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Information Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share your 
              information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li>With your consent</li>
              <li>With service providers who perform services on our behalf</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and the safety of our users</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction. However, no method of 
              transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Your Rights</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access, update, or delete your personal information</li>
              <li>Object to processing of your information</li>
              <li>Request restriction of processing</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at 
              <a href="mailto:privacy@learnchinese.com" className="text-red-500 hover:text-red-400 ml-1">
                privacy@learnchinese.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
