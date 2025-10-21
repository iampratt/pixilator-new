import { GenerationForm } from '@/components/forms/GenerationForm';
import { GenerationHistory } from '@/components/GenerationHistory';
import { Header } from '@/components/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Pixilator</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Transform your ideas into stunning AI-generated images with our advanced prompt refinement technology.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-6">Generate New Image</h2>
            <GenerationForm />
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-6">Recent Generations</h2>
            <GenerationHistory />
          </div>
        </div>
      </main>
    </div>
  );
}