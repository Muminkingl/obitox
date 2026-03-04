'use client';

import * as React from 'react';
import { cn } from "@/lib/utils";
import { CheckIcon } from 'lucide-react';

// Types for our stepper
interface StepProps {
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
}

interface DomainStepperProps {
  steps: StepProps[];
  currentStep: number;
  className?: string;
}

export function DomainStepper({ steps, currentStep, className }: DomainStepperProps) {
  return (
    <nav className={cn("flex w-full justify-between", className)}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const status = 
          stepNumber < currentStep ? 'completed' : 
          stepNumber === currentStep ? 'current' : 
          'upcoming';

        return (
          <React.Fragment key={step.title}>
            {/* Step */}
            <div className="flex flex-col items-center">
              {/* Step indicator */}
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                status === 'completed' ? "bg-emerald-600 border-emerald-600 text-white" : 
                status === 'current' ? "border-emerald-600 text-emerald-600" :
                "border-gray-400 text-gray-400"
              )}>
                {status === 'completed' ? (
                  <CheckIcon className="h-5 w-5" />
                ) : (
                  <span>{stepNumber}</span>
                )}
              </div>
              
              {/* Step title and description */}
              <div className="mt-2 text-center">
                <div className={cn(
                  "text-sm font-medium", 
                  status === 'completed' || status === 'current' 
                    ? "text-white" 
                    : "text-gray-400"
                )}>
                  {step.title}
                </div>
                <div className={cn(
                  "text-xs", 
                  status === 'completed' || status === 'current' 
                    ? "text-gray-400" 
                    : "text-gray-500"
                )}>
                  {step.description}
                </div>
              </div>
            </div>
            
            {/* Connector line between steps */}
            {index < steps.length - 1 && (
              <div className="flex-1 relative top-5">
                <div className={cn(
                  "h-0.5 w-full",
                  stepNumber < currentStep ? "bg-emerald-600" : "bg-gray-300"
                )} />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
