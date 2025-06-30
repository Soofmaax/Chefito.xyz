// Type definitions for React JSX elements
declare module 'react' {
  export interface ReactElement {}
  export function useState<T>(initial: T): [T, (value: T) => void];
  export function useEffect(...args: any[]): void;
  export function useRef<T>(init?: T): { current: T };
  export function useCallback<T extends (...args: any[]) => any>(fn: T, deps: any[]): T;
}

declare namespace React {
  type ReactElement = any;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
    interface Element extends React.ReactElement {}
    interface FormEvent<T = any> {}
    interface ChangeEvent<T = any> {}
  }
}

export {};