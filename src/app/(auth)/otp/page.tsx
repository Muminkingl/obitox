"use client"

import { useId, useState } from "react"
import { OTPInput, SlotProps } from "input-otp"
import { MinusIcon, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/icons/logo"
import Link from "next/link"
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { verifyOTP, resendOTP } from './actions';
import { useSearchParams } from 'next/navigation';
import Alert from '@/components/alert';
import { Button } from "@/components/ui/button"

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <OTPInput
      autoFocus
      disabled={pending}
      name="code"
      containerClassName="flex items-center gap-3 has-disabled:opacity-50"
      maxLength={6}
      render={({ slots }) => (
        <>
          <div className="flex">
            {slots.slice(0, 3).map((slot, idx) => (
              <Slot key={idx} {...slot} />
            ))}
          </div>

          <div className="text-muted-foreground/80">
            <MinusIcon
              size={16}
              aria-hidden="true"
            />
          </div>

          <div className="flex">
            {slots.slice(3).map((slot, idx) => (
              <Slot key={idx} {...slot} />
            ))}
          </div>
        </>
      )}
    />
  );
}

export default function OtpPage() {
  const id = useId();
  const [state, action] = useActionState(verifyOTP, null);
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const custom = searchParams.get('custom') || 'false';
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const handleResendOTP = async () => {
    if (resending || !email) return;
    
    setResending(true);
    setResendMessage(null);
    
    try {
      const result = await resendOTP(email, custom);
      
      if (result && 'success' in result) {
        setResendMessage({
          type: 'success',
          message: 'A new verification code has been sent to your email'
        });
      } else if (result && 'type' in result && result.type === 'error') {
        setResendMessage({
          type: 'error',
          message: result.message || 'Failed to resend code'
        });
      }
    } catch (error) {
      setResendMessage({
        type: 'error',
        message: 'Failed to resend verification code'
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <section className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-transparent">
      <form
        action={action}
        id={id}
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
              Verify Your Email
            </h1>
            <p className="text-sm">
              Please enter the OTP sent to your email
            </p>
          </div>

          <div className="mt-6 space-y-6">
            <div className="flex justify-center">
              <SubmitButton />
            </div>
            <input
              type="hidden"
              name="email"
              value={email}
            />
            <input
              type="hidden"
              name="custom"
              value={custom}
            />

            {state?.type === 'error' && (
              <Alert message={state.message || "Invalid verification code."} />
            )}
            
            {resendMessage && (
              <Alert 
                message={resendMessage.message} 
              />
            )}
          </div>
        </div>

        <div className="p-3">
          <p className="text-accent-foreground text-center text-sm">
            Didn&apos;t receive the code?
            <Button
              type="button"
              variant="link"
              onClick={handleResendOTP}
              disabled={resending}
              className="px-2">
              {resending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Resend'
              )}
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}

function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        'border-input bg-background text-foreground relative -ms-px flex size-9 items-center justify-center border font-medium shadow-xs transition-[color,box-shadow] first:ms-0 first:rounded-s-md last:rounded-e-md',
        { 'border-ring ring-ring/50 z-10 ring-[3px]': props.isActive }
      )}>
      {props.char !== null && <div>{props.char}</div>}
    </div>
  );
}