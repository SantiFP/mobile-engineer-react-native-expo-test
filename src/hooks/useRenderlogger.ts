// Hook auxiliar para debuggear renders durante desarrollo
import { useRef } from 'react';

export function useRenderLogger(name: string) {
  const renders = useRef(0);
  renders.current++;
  console.log(`${name} se renderizó ${renders.current} veces`);
}
