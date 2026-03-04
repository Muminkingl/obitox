'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export const AnimatedGroup = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  )
}
