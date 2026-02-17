'use client';

import { useState } from 'react';
import {
  Loader2,
  Zap,
  Shield,
  Globe,
  Lock,
} from 'lucide-react';
import { loginWithGoogle, loginWithGithub } from './googleAuth';

export default function SignInPage() {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      const result = await loginWithGoogle();
      if (result && typeof result === 'object' && 'url' in result) {
        window.location.href = result.url;
      } else {
        setGoogleLoading(false);
      }
    } catch (error) {
      console.error("Google login error:", error);
      setGoogleLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      setGithubLoading(true);
      const result = await loginWithGithub();
      if (result && typeof result === 'object' && 'url' in result) {
        window.location.href = result.url;
      } else {
        setGithubLoading(false);
      }
    } catch (error) {
      console.error("GitHub login error:", error);
      setGithubLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden p-4">
      <style jsx>{`
        .login-btn {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          position: relative;
          overflow: hidden;
        }
        .login-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transition: left 0.5s;
        }
        .login-btn:hover::before {
          left: 100%;
        }
      `}</style>
      <div className="z-10 w-full max-w-6xl">
        <div className="bg-secondary/50 overflow-hidden rounded-[40px] shadow-2xl">
          <div className="grid min-h-[700px] lg:grid-cols-2">
            {/* Left Side */}
            <div className="brand-side relative m-4 rounded-3xl bg-[url('https://cdn.midjourney.com/299f94f9-ecb9-4b26-bead-010b8d8b01d9/0_0.webp?w=800&q=80')] bg-cover p-12 text-white">
              <div>
                <div className="mb-12 text-lg font-semibold uppercase">
                  ObitoX
                </div>
                <h1 className="mb-4 text-6xl font-medium">
                  One Simple SDK, Any Provider
                </h1>
                <p className="mb-12 text-xl opacity-80">
                  Join thousands of developers who trust ObitoX to manage, secure, and scale their APIs
                </p>

                <div className="space-y-6">
                  {[
                    {
                      icon: <Zap size={16} />,
                      title: 'Lightning Fast',
                      desc: 'Multi-provider upload orchestration',
                    },
                    {
                      icon: <Shield size={16} />,
                      title: 'Enterprise Security',
                      desc: 'Rate limiting, abuse detection & API keys',
                    },
                    {
                      icon: <Globe size={16} />,
                      title: 'Multi-Cloud Storage',
                      desc: 'Supabase, R2, S3, Uploadcare support',
                    },
                    {
                      icon: <Lock size={16} />,
                      title: 'Production Ready',
                      desc: '99.95%+ uptime SLA guaranteed',
                    },
                  ].map(({ icon, title, desc }, i) => (
                    <div
                      key={i}
                      className="feature-item animate-fadeInUp flex items-center"
                      style={{ animationDelay: `${0.2 * (i + 1)}s` }}
                    >
                      <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur-sm">
                        {icon}
                      </div>
                      <div>
                        <div className="font-semibold">{title}</div>
                        <div className="text-sm opacity-70">{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex flex-col justify-center p-12">
              <div className="mx-auto w-full max-w-md">
                <div className="mb-8 text-center">
                  <h2 className="text-3xl font-light uppercase">
                    Get Started
                  </h2>
                  <p className="mt-2 text-sm text-stone-600">
                    Sign in with your preferred provider to continue
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="relative text-center text-sm text-stone-500">
                    <div className="absolute inset-0 flex items-center">
                      <div className="border-border w-full border-t"></div>
                    </div>
                    <span className="relative px-2">Continue with</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={googleLoading || githubLoading}
                      className="border-border bg-secondary text-foreground hover:bg-secondary/80 flex items-center justify-center rounded-lg border px-4 py-2.5 text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {googleLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 256 262"
                          >
                            <path
                              fill="#4285f4"
                              d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                            />
                            <path
                              fill="#34a853"
                              d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                            />
                            <path
                              fill="#fbbc05"
                              d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                            />
                            <path
                              fill="#eb4335"
                              d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                            />
                          </svg>
                          <span className="ml-2">Google</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleGithubLogin}
                      disabled={googleLoading || githubLoading}
                      className="border-border bg-secondary text-foreground hover:bg-secondary/80 flex items-center justify-center rounded-lg border px-4 py-2.5 text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {githubLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                            />
                          </svg>
                          <span className="ml-2">GitHub</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
