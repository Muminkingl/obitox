'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface TextEffectProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
}

export const TextEffect = ({ as: Component = 'div', className, children, ...props }: TextEffectProps) => {
  return (
    <Component className={cn(className)} {...props}>
      {children}
    </Component>
  )
}
