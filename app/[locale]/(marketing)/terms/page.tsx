export default function TermsPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">Terms of Service</h1>
        
        <div className="space-y-6 text-zinc-300">
          <section>
            <p className="text-sm text-zinc-400 mb-6">Last updated: January 2026</p>
            <p className="text-lg">
              Welcome to LearnChinese. By accessing or using our platform, you agree to be bound by these 
              Terms of Service and all applicable laws and regulations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">1. Use of Service</h2>
            <p className="mb-3">By using LearnChinese, you agree to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Use the service only for lawful purposes</li>
              <li>Not interfere with or disrupt the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">2. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account and password. 
              You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">3. Subscription and Payment</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Subscriptions are billed on a recurring basis</li>
              <li>Free trials may be offered at our discretion</li>
              <li>You can cancel your subscription at any time</li>
              <li>Refunds are provided according to our refund policy</li>
              <li>We reserve the right to change pricing with notice</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">4. Intellectual Property</h2>
            <p>
              All content, features, and functionality of LearnChinese are owned by us and are protected 
              by international copyright, trademark, and other intellectual property laws. You may not:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li>Copy, modify, or distribute our content without permission</li>
              <li>Reverse engineer or attempt to extract source code</li>
              <li>Remove copyright or proprietary notices</li>
              <li>Use our trademarks without authorization</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">5. User Content</h2>
            <p>
              You retain ownership of any content you submit. By submitting content, you grant us a 
              worldwide, non-exclusive license to use, display, and distribute your content in connection 
              with the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">6. Prohibited Activities</h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit harmful code or malware</li>
              <li>Harass, abuse, or harm others</li>
              <li>Engage in unauthorized commercial activities</li>
              <li>Attempt to gain unauthorized access to the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">7. Termination</h2>
            <p>
              We may terminate or suspend your account at any time for violation of these terms. 
              Upon termination, your right to use the service will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">8. Disclaimer of Warranties</h2>
            <p>
              The service is provided "as is" without warranties of any kind, either express or implied. 
              We do not guarantee that the service will be uninterrupted, secure, or error-free.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, 
              special, consequential, or punitive damages arising from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">10. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify you of any changes 
              by posting the new terms on this page. Your continued use of the service constitutes 
              acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Contact Us</h2>
            <p>
              If you have questions about these Terms of Service, please contact us at 
              <a href="mailto:legal@learnchinese.com" className="text-red-500 hover:text-red-400 ml-1">
                legal@learnchinese.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
