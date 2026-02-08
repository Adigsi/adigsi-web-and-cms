'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function CMSLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate login process
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('[v0] Login attempt with:', { email })
    setIsLoading(false)
    // Redirect to dashboard after successful login
    window.location.href = '/cms/dashboard'
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-4 flex justify-center">
            <Link href="/" className="text-[#29294b]">
              <Image
                alt="logo"
                src="/images/design-mode/logo-adigsi.png"
                width={132}
                height={46}
                loading="eager"
                priority
                style={{ width: '132px', height: '46px' }}
              />
            </Link>
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-[#29294b] mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">
              Sign in to manage ADIGSI content
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3350e6] focus:border-transparent outline-none transition-all"
                  placeholder="admin@adigsi.id"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3350e6] focus:border-transparent outline-none transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#3350e6] border-gray-300 rounded focus:ring-[#3350e6]"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                href="/cms/forgot-password"
                className="text-sm font-medium text-[#3350e6] hover:text-[#2a42c7]"
              >
                Forgot password?
              </Link>
            </div> */}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#3350e6] hover:bg-[#2a42c7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3350e6] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Additional Links */}
          {/* <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need access?{' '}
              <Link href="mailto:admin@adigsi.id" className="font-medium text-[#3350e6] hover:text-[#2a42c7]">
                Contact Administrator
              </Link>
            </p>
          </div> */}
        </div>
      </div>

      {/* Right side - Branded Background */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-[#0a0e27] via-[#1a2255] to-[#0f1538] relative overflow-hidden">
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(51,80,230,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(51,80,230,0.5) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        
        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3350e6] rounded-full opacity-[0.1] blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00c2ff] rounded-full opacity-[0.08] blur-[120px]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12 text-white">
          <div className="max-w-md text-center">
            <div className="mb-8">
              <div className="flex justify-center">
                <Image
                  src="/images/logo-bottom.png"
                  alt="ADIGSI Logo"
                  width={80}
                  height={80}
                  className="mb-4"
                  style={{ width: 'auto', height: '80px' }}
                />
              </div>
            </div>
            
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-[#00c2ff] bg-clip-text text-transparent">
              Securing Indonesia's Digital Future
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Indonesian Association for Digitalization and Cybersecurity
            </p>
            
            {/* Stats */}
            {/* <div className="grid grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#00c2ff] mb-1">500+</div>
                <div className="text-sm text-gray-400">Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#00c2ff] mb-1">100+</div>
                <div className="text-sm text-gray-400">Events</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#00c2ff] mb-1">50+</div>
                <div className="text-sm text-gray-400">Partners</div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-8 right-8 w-32 h-32 border border-[#3350e6]/20 rounded-lg rotate-45" />
        <div className="absolute bottom-8 left-8 w-24 h-24 border border-[#00c2ff]/20 rounded-lg rotate-12" />
      </div>
    </div>
  )
}
