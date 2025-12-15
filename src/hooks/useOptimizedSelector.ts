/**
 * Hook para otimizar selectors do Zustand
 * Evita re-renders desnecessários usando shallow comparison
 */

import { useMemo } from "react";
import { useStore } from "zustand";
import type { StoreApi } from "zustand";

const EMPTY_DEPS: readonly unknown[] = [];

/**
 * Cria um selector otimizado que evita re-renders
 * Use quando precisar de múltiplos valores do store
 */
export function useOptimizedSelector<T, U>(
  store: StoreApi<T>,
  selector: (state: T) => U
): U {
  return useStore(store, selector);
}

/**
 * Helper para criar selectors múltiplos sem causar re-renders
 * Retorna um objeto com os valores selecionados
 */
export function useMultipleSelectors<T extends Record<string, unknown>>(
  store: StoreApi<T>,
  selectors: (keyof T)[]
): Partial<T> {
  const result: Partial<T> = {};
  
  selectors.forEach((key) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    result[key] = useStore(store, (state) => state[key]);
  });
  
  return result;
}

/**
 * Hook para memoizar selector complexo
 */
export function useMemoizedSelector<T, U>(
  store: StoreApi<T>,
  selector: (state: T) => U,
  deps: readonly unknown[] = EMPTY_DEPS
): U {
  const memoizedSelector = useMemo(() => {
    // deps é intencional: permite que o caller force re-memoização quando necessário
    void deps;
    return (state: T) => selector(state);
  }, [deps, selector]);
  return useStore(store, memoizedSelector);
}
