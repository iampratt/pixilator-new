import { GenerationForm } from '@/components/forms/GenerationForm';
import { GenerationHistory } from '@/components/GenerationHistory';
import { Header } from '@/components/Header';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            <span className="inline-block animate-float">Pixilator</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your ideas into stunning AI-generated images with our advanced prompt refinement technology.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <div className="salt-paper-card rounded-2xl p-8 animate-fade-in-up">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Generate New Image</h2>
            <GenerationForm />
          </div>

          <div className="salt-paper-card rounded-2xl p-8 animate-fade-in-up">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Generations</h2>
            <GenerationHistory />
          </div>
        </div>

        <div className="text-center mt-12 animate-fade-in-up">
          <Link 
            href="/styles" 
            className="salt-paper-button px-8 py-3 rounded-lg font-semibold inline-block hover:scale-105 transition-transform"
          >
            Customize Styles
          </Link>
        </div>
      </main>
    </div>
  );
}