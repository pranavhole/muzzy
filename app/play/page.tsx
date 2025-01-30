import Link from 'next/link';
import Image from 'next/image';

interface FeatureCard {
  title: string;
  description: string;
  icon: string;
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export default function LandingPage() {
  const features: FeatureCard[] = [
    {
      title: "Interactive Playlists",
      description: "Fans vote in real-time to decide what plays next during your live streams",
      icon: "🎵",
    },
    {
      title: "Creator Dashboard",
      description: "Manage your streams, track engagement, and connect with your community",
      icon: "📊",
    },
    {
      title: "Monetization",
      description: "Earn through fan donations, subscriptions, and sponsored streams",
      icon: "💸",
    },
  ];

  const testimonials: Testimonial[] = [
    {
      quote: "This platform transformed how I connect with my audience. The interaction is incredible!",
      name: "DJ Nova",
      role: "Electronic Music Producer"
    },
    {
      quote: "Finally a service that puts both artists and fans first. Our streams have never been more lively!",
      name: "The Midnight Crew",
      role: "Indie Band"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold">SoundWave</span>
        </div>
        <div className="flex space-x-4">
          <Link href="/login" className="hover:text-purple-300 transition-colors">
            Sign In
          </Link>
          <Link 
            href="/signup" 
            className="bg-purple-500 hover:bg-purple-600 px-6 py-2 rounded-full transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          Let Your Fans <span className="text-purple-400">Control</span> The Music
        </h1>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Connect with your audience like never before. Real-time voting, interactive playlists, 
          and seamless streaming for creators who want to engage their fans.
        </p>
        <div className="flex justify-center space-x-4">
          <Link 
            href="/creator-signup" 
            className="bg-purple-500 hover:bg-purple-600 px-8 py-4 rounded-full text-lg transition-colors"
          >
            I'm a Creator
          </Link>
          <Link 
            href="/fan-signup" 
            className="border border-purple-500 hover:bg-purple-900 px-8 py-4 rounded-full text-lg transition-colors"
          >
            I'm a Fan
          </Link>
        </div>
        <div className="mt-16 rounded-2xl overflow-hidden shadow-xl max-w-4xl mx-auto">
          <Image
            src="/stream-demo.png" // Replace with actual image path
            alt="Stream interface demo"
            width={1200}
            height={675}
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-black/30 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">Why SoundWave?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 bg-purple-900/20 rounded-xl">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-between items-center space-y-12 md:space-y-0">
          <div className="md:w-1/2">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-purple-500 w-8 h-8 rounded-full flex items-center justify-center">1</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Start a Stream</h3>
                  <p className="text-gray-400">Creators launch a live stream and fans join through your unique link</p>
                </div>
              </div>
              {/* Add steps 2 and 3 similarly */}
            </div>
          </div>
          <div className="md:w-1/2">
            {/* Add another demo image or illustration */}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-black/30 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">What Creators Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-6 bg-purple-900/20 rounded-xl">
                <p className="text-lg mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Amplify Your Streams?</h2>
        <p className="text-gray-300 mb-8 max-w-xl mx-auto">
          Join thousands of creators already transforming their live music experiences
        </p>
        <Link 
          href="/signup" 
          className="bg-purple-500 hover:bg-purple-600 px-8 py-4 rounded-full text-lg transition-colors inline-block"
        >
          Start Free Trial
        </Link>
      </section>
    </div>
  );
}