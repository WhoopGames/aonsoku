import { TooltipPortal } from '@radix-ui/react-tooltip'
import { ReactNode } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip'

interface TooltipContent {
  children: ReactNode
  text: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'center' | 'end' | 'start'
}

export function SimpleTooltip({
  children,
  text,
  side = 'top',
  align = 'center',
}: TooltipContent) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipPortal>
          <TooltipContent side={side} avoidCollisions={false} align={align}>
            <p className="font-normal">{text}</p>
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  )
}
