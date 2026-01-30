export default function FeaturesPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Features</h1>
          <p className="text-xl text-zinc-300">
            Everything you need to master Mandarin Chinese
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-white mb-2">Personalized Learning</h3>
            <p className="text-zinc-400">
              AI-powered lessons that adapt to your learning pace, style, and goals for maximum efficiency.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <div className="text-3xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-white mb-2">HSK 1-6 Curriculum</h3>
            <p className="text-zinc-400">
              Complete curriculum covering all HSK levels with 2000+ structured lessons and practice materials.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <div className="text-3xl mb-4">🧠</div>
            <h3 className="text-xl font-semibold text-white mb-2">Smart SRS System</h3>
            <p className="text-zinc-400">
              Scientifically proven spaced repetition algorithm ensures you never forget what you learn.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <div className="text-3xl mb-4">🏥</div>
            <h3 className="text-xl font-semibold text-white mb-2">Medical Chinese</h3>
            <p className="text-zinc-400">
              Specialized program for healthcare professionals with clinical scenarios and medical vocabulary.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <div className="text-3xl mb-4">📖</div>
            <h3 className="text-xl font-semibold text-white mb-2">Interactive Reading</h3>
            <p className="text-zinc-400">
              Immersive reading materials with instant definitions, pinyin, and audio support.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <div className="text-3xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-white mb-2">Grammar Patterns</h3>
            <p className="text-zinc-400">
              Comprehensive grammar explanations with real-world examples and practice exercises.
            </p>
          </div>

          {/* Feature 7 */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <div className="text-3xl mb-4">🎧</div>
            <h3 className="text-xl font-semibold text-white mb-2">Native Audio</h3>
            <p className="text-zinc-400">
              High-quality native speaker audio for all vocabulary and reading materials.
            </p>
          </div>

          {/* Feature 8 */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2">Progress Tracking</h3>
            <p className="text-zinc-400">
              Detailed analytics and insights to monitor your learning progress and identify areas for improvement.
            </p>
          </div>

          {/* Feature 9 */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <div className="text-3xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">Smart Dictionary</h3>
            <p className="text-zinc-400">
              Comprehensive Chinese-English dictionary with example sentences and usage notes.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a
            href="/login"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Get Started Free
          </a>
        </div>
      </div>
    </div>
  );
}
