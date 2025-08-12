'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Check, Calendar, Clock, DollarSign, Home as HomeIcon, Sparkles, Truck, TrendingUp, Users, Facebook, Instagram, Twitter } from 'lucide-react'

export default function Home() {
  const [email, setEmail] = useState('')
  const [userType, setUserType] = useState<'customer' | 'washmate'>('customer')
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // TODO: Integrate with Supabase
      // const { data, error } = await supabase
      //   .from('waitlist')
      //   .insert([{ 
      //     email, 
      //     user_type: userType, 
      //     created_at: new Date().toISOString() 
      //   }])
      
      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setShowSuccess(true)
      setEmail('')
      
      setTimeout(() => {
        setShowSuccess(false)
      }, 5000)
    } catch (error) {
      console.error('Error submitting to waitlist:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen bg-washmates-cream">
      {/* Floating Bubbles Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-washmates-gold to-washmates-gold-light opacity-10 animate-bubble" style={{ left: '10%' }} />
        <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-washmates-purple to-washmates-purple-dark opacity-10 animate-bubble" style={{ left: '30%', animationDelay: '2s' }} />
        <div className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-washmates-gold to-washmates-gold-light opacity-10 animate-bubble" style={{ left: '60%', animationDelay: '4s' }} />
        <div className="absolute w-14 h-14 rounded-full bg-gradient-to-br from-washmates-purple to-washmates-purple-dark opacity-10 animate-bubble" style={{ left: '85%', animationDelay: '6s' }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image 
                src="/images/logo-primary.png" 
                alt="WashMates" 
                width={180} 
                height={60} 
                className="h-14 w-auto"
              />
            </div>
            <button 
              onClick={() => scrollToSection('waitlist')}
              className="px-6 py-2 gradient-gold text-white rounded-full font-semibold hover:shadow-lg transition-all"
            >
              Join Waitlist
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-block mb-4">
              <div className="px-4 py-2 bg-washmates-gold/20 rounded-full text-sm font-semibold text-washmates-purple">
                Launching Soon in GTA
              </div>
            </div>
            <div className="mb-6">
              <Image 
                src="/images/app-icon.png" 
                alt="WashMates - No More Laundry Fuss" 
                width={320} 
                height={320} 
                className="mx-auto w-48 md:w-64 lg:w-80 h-auto"
                priority
              />
            </div>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Professional laundry pickup & delivery service connecting neighbours in the Greater Toronto Area
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => scrollToSection('customer')}
                className="px-8 py-4 gradient-purple text-white rounded-full font-semibold hover:shadow-xl transition-all hover-lift flex items-center justify-center space-x-2"
              >
                <HomeIcon className="w-5 h-5" />
                <span>I need laundry help</span>
              </button>
              <button 
                onClick={() => scrollToSection('washmate')}
                className="px-8 py-4 gradient-gold text-white rounded-full font-semibold hover:shadow-xl transition-all hover-lift flex items-center justify-center space-x-2"
              >
                <DollarSign className="w-5 h-5" />
                <span>I want to earn money</span>
              </button>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="relative mx-auto w-full max-w-3xl h-64 md:h-96">
            <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              {/* Washing Machine */}
              <rect x="300" y="150" width="200" height="200" rx="20" fill="#2e2d4d"/>
              <rect x="320" y="170" width="160" height="160" rx="15" fill="#3d3c5f"/>
              <circle cx="400" cy="250" r="60" fill="#fefdf8" opacity="0.9"/>
              <circle cx="400" cy="250" r="50" fill="none" stroke="#f8c16f" strokeWidth="3" strokeDasharray="5,5" className="animate-spin origin-center" style={{ animationDuration: '3s' }}/>
              
              {/* Laundry Items */}
              <path d="M380 230 Q400 220 420 230 L415 270 Q400 275 385 270 Z" fill="#f8c16f" opacity="0.8"/>
              <circle cx="390" cy="245" r="8" fill="#ffd699"/>
              <circle cx="410" cy="255" r="8" fill="#ffd699"/>
              
              {/* Sparkles */}
              <g className="animate-pulse">
                <path d="M250 120 L255 130 L265 125 L255 130 L250 140 L245 130 L235 125 L245 130 Z" fill="#f8c16f"/>
              </g>
              <g className="animate-pulse" style={{ animationDelay: '0.5s' }}>
                <path d="M520 180 L525 190 L535 185 L525 190 L520 200 L515 190 L505 185 L515 190 Z" fill="#f8c16f"/>
              </g>
              
              {/* People */}
              <g transform="translate(150, 200)">
                <circle cx="0" cy="0" r="25" fill="#ffd699"/>
                <rect x="-30" y="30" width="60" height="80" rx="10" fill="#f8c16f"/>
                <circle cx="-8" cy="-5" r="3" fill="#2e2d4d"/>
                <circle cx="8" cy="-5" r="3" fill="#2e2d4d"/>
                <path d="M-10 5 Q0 15 10 5" stroke="#2e2d4d" strokeWidth="2" fill="none" strokeLinecap="round"/>
              </g>
              
              <g transform="translate(650, 200)">
                <circle cx="0" cy="0" r="25" fill="#ffd699"/>
                <rect x="-30" y="30" width="60" height="80" rx="10" fill="#2e2d4d"/>
                <circle cx="-8" cy="-5" r="3" fill="#2e2d4d"/>
                <circle cx="8" cy="-5" r="3" fill="#2e2d4d"/>
                <path d="M-10 5 Q0 15 10 5" stroke="#2e2d4d" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <text x="0" y="60" fontSize="30" fill="#f8c16f" textAnchor="middle" fontWeight="bold">$</text>
              </g>
              
              <path d="M200 250 Q400 200 600 250" stroke="#f8c16f" strokeWidth="2" fill="none" strokeDasharray="5,5" opacity="0.5"/>
            </svg>
          </div>
        </div>
      </section>

      {/* Customer Section */}
      <section id="customer" className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in">
              <div className="inline-flex items-center space-x-2 mb-4">
                <div className="w-2 h-8 bg-gradient-to-b from-washmates-gold to-washmates-gold-light rounded-full" />
                <span className="text-sm font-semibold text-washmates-gold uppercase tracking-wide">For Customers</span>
              </div>
              <h2 className="text-4xl font-bold mb-6 gradient-text">
                Your Time is Precious
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Get your laundry picked up, professionally cleaned, and delivered back fresh - all without leaving home.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 rounded-lg gradient-gold flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Save Your Time</h3>
                    <p className="text-gray-600">Focus on what matters while we handle your laundry</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 rounded-lg gradient-purple flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Professional Quality</h3>
                    <p className="text-gray-600">Your clothes treated with care by local experts</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 rounded-lg gradient-gold flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Door-to-Door Service</h3>
                    <p className="text-gray-600">Convenient pickup and delivery at your schedule</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden hover-lift bg-gradient-to-br from-washmates-cream to-washmates-cream-dark p-8">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <HomeIcon className="w-24 h-24 text-washmates-gold mx-auto mb-4 animate-float" />
                  <p className="text-lg font-medium text-washmates-purple">Relax at home while we handle everything</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WashMate Section */}
      <section id="washmate" className="py-16 px-6 bg-washmates-cream-dark">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative h-96 rounded-2xl overflow-hidden hover-lift bg-gradient-to-br from-washmates-purple to-washmates-purple-dark p-8">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <DollarSign className="w-24 h-24 text-washmates-gold mx-auto mb-4 animate-float" />
                  <p className="text-lg font-medium text-white">Earn money on your schedule</p>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 animate-slide-in">
              <div className="inline-flex items-center space-x-2 mb-4">
                <div className="w-2 h-8 bg-gradient-to-b from-washmates-purple to-washmates-purple-dark rounded-full" />
                <span className="text-sm font-semibold text-washmates-purple uppercase tracking-wide">For WashMates</span>
              </div>
              <h2 className="text-4xl font-bold mb-6 gradient-text">
                Earn on Your Schedule
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join our community of WashMates and earn money helping neighbours with their laundry.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 rounded-lg gradient-purple flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Flexible Schedule</h3>
                    <p className="text-gray-600">Work when you want, as much as you want</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 rounded-lg gradient-gold flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Help Your Community</h3>
                    <p className="text-gray-600">Provide essential service to your neighbours</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 rounded-lg gradient-purple flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Earn Per Order</h3>
                    <p className="text-gray-600">Get paid for each laundry service completed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist" className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-2xl text-center">
          <div className="inline-block mb-6">
            <div className="px-4 py-2 bg-washmates-gold/20 rounded-full text-sm font-semibold text-washmates-purple animate-pulse-glow">
              Limited Spots Available
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-6 gradient-text">
            Be First to Know
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join our waitlist and be notified when WashMates launches in the GTA.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" 
                required
                className="flex-1 px-6 py-4 rounded-full border-2 border-gray-200 focus:border-washmates-gold focus:outline-none focus:shadow-lg transition-all"
              />
              <button 
                type="submit"
                disabled={isSubmitting} 
                className="px-8 py-4 gradient-gold text-white rounded-full font-semibold hover:shadow-xl transition-all hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Joining...' : 'Join Waitlist'}
              </button>
            </div>
            
            <div className="bg-washmates-cream rounded-2xl p-6 border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-4">Join the waitlist:</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <label className="flex items-center justify-center space-x-2 cursor-pointer px-6 py-3 rounded-full border-2 border-gray-200 hover:border-washmates-gold transition-all">
                  <input 
                    type="radio" 
                    name="userType" 
                    value="customer" 
                    checked={userType === 'customer'}
                    onChange={() => setUserType('customer')}
                    className="w-5 h-5 text-washmates-gold focus:ring-washmates-gold"
                  />
                  <span className="text-gray-700 font-medium">As a Customer</span>
                </label>
                <label className="flex items-center justify-center space-x-2 cursor-pointer px-6 py-3 rounded-full border-2 border-gray-200 hover:border-washmates-gold transition-all">
                  <input 
                    type="radio" 
                    name="userType" 
                    value="washmate"
                    checked={userType === 'washmate'}
                    onChange={() => setUserType('washmate')}
                    className="w-5 h-5 text-washmates-gold focus:ring-washmates-gold"
                  />
                  <span className="text-gray-700 font-medium">As a WashMate</span>
                </label>
              </div>
            </div>
          </form>
          
          {showSuccess && (
            <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-lg animate-fade-in flex items-center justify-center">
              <Check className="w-5 h-5 mr-2" />
              Thanks for joining! We'll notify you when we launch.
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 bg-washmates-cream-dark">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">
            Questions? We've Got Answers
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "When are you launching?",
                a: "Soon! We're putting the final touches on our service. Join the waitlist and you'll be the first to know when we go live in the GTA."
              },
              {
                q: "How much will it cost?",
                a: "We're still figuring that out, but we promise it'll be worth every penny. Think of all the time you'll save not doing laundry!"
              },
              {
                q: "Will my clothes be safe?",
                a: "Your favourite shirt is safe with us! Our WashMates are trained professionals who treat your clothes like their own."
              },
              {
                q: "What areas do you serve?",
                a: "We're starting in the Greater Toronto Area. Specific neighbourhoods coming soon!"
              },
              {
                q: "How do I become a WashMate?",
                a: "Easy! Join our waitlist as a WashMate and we'll send you all the details about our simple application process when we launch."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-md hover-lift">
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full ${index % 2 === 0 ? 'gradient-gold' : 'gradient-purple'} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold text-sm">Q</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                    <p className="text-gray-600">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-washmates-purple text-white">
        <div className="container mx-auto text-center">
          <div className="mb-6">
            <Image 
              src="/images/logotype-cream-bg.png" 
              alt="WashMates" 
              width={200} 
              height={80} 
              className="h-16 w-auto mx-auto brightness-0 invert opacity-90"
            />
          </div>
          
          {/* Social Media Links */}
          <div className="flex justify-center space-x-6 mb-6">
            <a 
              href="https://www.facebook.com/61575342231245/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-washmates-gold transition-colors"
              aria-label="Follow us on Facebook"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a 
              href="#" 
              className="hover:text-washmates-gold transition-colors opacity-50 cursor-not-allowed"
              aria-label="Instagram coming soon"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a 
              href="#" 
              className="hover:text-washmates-gold transition-colors opacity-50 cursor-not-allowed"
              aria-label="Twitter coming soon"
            >
              <Twitter className="w-6 h-6" />
            </a>
          </div>
          
          <p className="text-gray-300 mb-2">© 2025 WashMates. All rights reserved.</p>
          <p className="text-gray-400 text-sm">Proudly serving the Greater Toronto Area</p>
        </div>
      </footer>
    </main>
  )
}