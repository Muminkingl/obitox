'use client';

import { Logo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { EmailInput } from '@/components/email-input';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { login } from './actions';
import { loginWithGoogle } from './googleAuth';
import Alert from '@/components/alert';
import { SimplePasswordInput } from '@/components/simple-password-input';
import { useState, useEffect } from 'react';
import { Loader2, CircleCheckIcon } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing In...
        </>
      ) : (
        'Sign In'
      )}
    </Button>
  );
}

function SuccessAlert({ message }: { message: string }) {
  return (
    <div className="border-border rounded-md border px-4 py-3 bg-emerald-50 border-emerald-200">
      <p className="text-sm text-emerald-700">
        <CircleCheckIcon
          className="me-3 -mt-0.5 inline-flex text-emerald-500"
          size={16}
          aria-hidden="true"
        />
        {message}
      </p>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [state, action] = useActionState(login, null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const searchParams = useSearchParams();
  const success = searchParams.get('success');

  // Handle successful login and redirect
  useEffect(() => {
    if (state?.success && state?.redirectTo) {
      // Successful login, redirect to dashboard
      router.push(state.redirectTo);
    }
  }, [state, router]);

  // Success message based on URL parameter
  const getSuccessMessage = () => {
    switch (success) {
      case 'account_created':
        return 'Account created successfully! You can now sign in.';
      default:
        return null;
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      const result = await loginWithGoogle();
      // If result contains a URL, we handle it client-side
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

  const successMessage = getSuccessMessage();

  return (
    <section className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-transparent">
      <form
        action={action}
        className="bg-muted m-auto h-fit w-full max-w-md overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <div className="text-center">
            <Link
              href="/"
              aria-label="go home"
              className="mx-auto block w-fit">
              <Logo />
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold">
              Sign In to Tailark
            </h1>
            <p className="text-sm">Welcome back! Sign in to continue</p>
          </div>

          <div className="mt-6 space-y-6">
            {successMessage && (
              <SuccessAlert message={successMessage} />
            )}

            <EmailInput />

            <SimplePasswordInput />

            <SubmitButton />

            {state?.type === 'error' && (
              state.errors ? (
                <Alert message="Please correct the errors in the form." />
              ) : (
                <Alert message={state.message || "An error occurred during sign in."} />
              )
            )}
          </div>

          <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <hr className="border-dashed" />
            <span className="text-muted-foreground text-xs">
              Or continue With
            </span>
            <hr className="border-dashed" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={googleLoading}>
              {googleLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="0.98em"
                  height="1em"
                  viewBox="0 0 256 262"
                  className="mr-2">
                  <path
                    fill="#4285f4"
                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                  <path
                    fill="#34a853"
                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                  <path
                    fill="#fbbc05"
                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"></path>
                  <path
                    fill="#eb4335"
                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
                </svg>
              )}
              <span>Google</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 256 256"
                className="mr-2">
                <path
                  fill="#f1511b"
                  d="M121.666 121.666H0V0h121.666z"></path>
                <path
                  fill="#80cc28"
                  d="M256 121.666H134.335V0H256z"></path>
                <path
                  fill="#00adef"
                  d="M121.663 256.002H0V134.336h121.663z"></path>
                <path
                  fill="#fbbc09"
                  d="M256 256.002H134.335V134.336H256z"></path>
              </svg>
              <span>Microsoft</span>
            </Button>
          </div>
        </div>

        <div className="p-3">
          <p className="text-accent-foreground text-center text-sm">
            Don&apos;t have an account ?
            <Button
              asChild
              variant="link"
              className="px-2">
              <Link href="/signup">Create account</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}