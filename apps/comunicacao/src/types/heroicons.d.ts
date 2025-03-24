declare module '@heroicons/react/outline' {
  import { ComponentType, SVGProps } from 'react';

  export interface IconProps extends SVGProps<SVGSVGElement> {
    className?: string;
  }

  export const SearchIcon: ComponentType<IconProps>;
  export const ChevronLeftIcon: ComponentType<IconProps>;
  export const ChevronRightIcon: ComponentType<IconProps>;
  export const PaperAirplaneIcon: ComponentType<IconProps>;
} 