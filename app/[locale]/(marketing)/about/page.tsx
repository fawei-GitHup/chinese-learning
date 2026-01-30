export default function AboutPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">About LearnChinese</h1>
        
        <div className="space-y-6 text-zinc-300">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Our Mission</h2>
            <p className="text-lg">
              LearnChinese is dedicated to making Mandarin Chinese accessible to learners worldwide through 
              AI-powered, personalized learning experiences. We believe that language learning should be 
              engaging, effective, and tailored to each individual's needs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">What We Offer</h2>
            <ul className="list-disc list-inside space-y-2 text-lg">
              <li>Comprehensive HSK 1-6 curriculum with 2000+ lessons</li>
              <li>Specialized Medical Chinese program for healthcare professionals</li>
              <li>Smart spaced repetition system (SRS) for effective vocabulary retention</li>
              <li>Interactive reading materials with instant definitions</li>
              <li>Grammar patterns with real-world examples</li>
              <li>Progress tracking and detailed analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Our Approach</h2>
            <p className="text-lg">
              We combine proven language learning methodologies with cutting-edge AI technology to create 
              a learning experience that adapts to your pace and style. Whether you're a complete beginner 
              or preparing for advanced HSK exams, our platform grows with you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Join Our Community</h2>
            <p className="text-lg">
              Join over 50,000 learners who are mastering Mandarin Chinese with LearnChinese. 
              Start your journey today and experience the difference of personalized, AI-powered learning.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
