export default function LandingPage() {
  console.log('=== LandingPage Rendering ===');
  console.log('LandingPage component executed successfully');
  
  return (
    <div className="relative overflow-hidden min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to LearnChinese
        </h1>
        <p className="text-zinc-400 text-lg">
          Master Chinese with AI-Powered Learning
        </p>
      </div>
    </div>
  )
}
