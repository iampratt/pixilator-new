import { GenerationForm } from '@/components/forms/GenerationForm';
import { Header } from '@/components/Header';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-7xl font-bold text-gray-900 mb-6">
            <span className="inline-block animate-float">Pixilator</span>
          </h1>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Transform your ideas into stunning AI-generated images with advanced prompt refinement technology
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span className="px-3 py-1 bg-gray-100 rounded-full">✨ AI-Powered</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">🎨 Multiple Styles</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">⚡ Fast Generation</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">🌐 Public Library</span>
          </div>
        </div>

        {/* Main Generation Form - Centered */}
        <div className="max-w-2xl mx-auto">
          <div className="salt-paper-card rounded-2xl p-8 animate-fade-in-up">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Image</h2>
              <p className="text-gray-600">Describe what you want to see and let AI bring it to life</p>
            </div>
            <GenerationForm />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Pixilator?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center salt-paper-card rounded-lg p-6 hover:scale-105 transition-transform">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Generate high-quality images in seconds with our optimized AI models</p>
            </div>

            <div className="text-center salt-paper-card rounded-lg p-6 hover:scale-105 transition-transform">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Enhancement</h3>
              <p className="text-gray-600">Our AI automatically refines your prompts for better results</p>
            </div>

            <div className="text-center salt-paper-card rounded-lg p-6 hover:scale-105 transition-transform">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Library</h3>
              <p className="text-gray-600">Explore and download images from our public community library</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 animate-fade-in-up">
          <Link 
            href="/library" 
            className="salt-paper-button px-8 py-4 rounded-lg font-semibold inline-block hover:scale-105 transition-transform text-lg"
          >
            Explore Community Library
          </Link>
        </div>
      </main>
    </div>
  );
}