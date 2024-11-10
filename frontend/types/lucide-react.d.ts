declare module 'lucide-react' {
  import { FC, SVGProps } from 'react'
  
  interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number | string
    color?: string
    strokeWidth?: number | string
  }

  type Icon = FC<IconProps>

  // Export all icons used in your project
  export const User: Icon
  export const CreditCard: Icon
  export const LogOut: Icon
  export const Menu: Icon
  export const X: Icon
  export const Eye: Icon
  export const EyeOff: Icon
  export const AlertCircle: Icon
  export const Check: Icon
  export const Loader2: Icon
  export const Facebook: Icon
  export const Instagram: Icon
  export const MessageCircle: Icon
  export const Star: Icon
  export const CheckCircle2: Icon
  export const Leaf: Icon
  export const Heart: Icon
  export const Users: Icon
  export const Shield: Icon
  export const Clock: Icon
  export const Zap: Icon
  export const Brain: Icon
  export const Sun: Icon
  export const Sunrise: Icon
  export const Sunset: Icon
  export const Moon: Icon
  export const Baby: Icon
  export const Dumbbell: Icon
  export const Flame: Icon
  export const Bell: Icon
  export const HelpCircle: Icon
  export const ChevronLeft: Icon
  export const ChevronRight: Icon
}
