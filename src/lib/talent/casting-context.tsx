"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import type { CastingState } from "@/types/talent";
import { castingReducer, EMPTY_STATE } from "./casting-reducer";

/**
 * Casting context — tracks the client's shortlist + exclusives for a single project.
 *
 * Persistido en sessionStorage (NO localStorage) para que el casting sobreviva
 * navegacion y reload dentro de la pestana, pero se limpie al cerrar el navegador.
 *
 * Una instancia por projectSlug — el storage key incluye el slug.
 *
 * El reducer puro vive en `casting-reducer.ts` (testeado en unit tests sin React).
 */

interface ProjectLimits {
  maxTalents: number;
  maxExclusive: number;
}

interface CastingContextValue {
  state: CastingState;
  limits: ProjectLimits;
  /** True cuando shortlist alcanzo maxTalents. */
  isFull: boolean;
  /** True cuando exclusives alcanzo maxExclusive. */
  isExclusiveFull: boolean;
  isInShortlist: (code: string) => boolean;
  isExclusive: (code: string) => boolean;
  canAddMore: () => boolean;
  canMakeMoreExclusive: () => boolean;
  add: (code: string) => boolean;
  remove: (code: string) => void;
  toggleExclusive: (code: string) => boolean;
  reset: () => void;
}

const CastingContext = createContext<CastingContextValue | null>(null);

interface CastingProviderProps {
  projectSlug: string;
  maxTalents: number;
  maxExclusive: number;
  children: React.ReactNode;
}

/**
 * Lee sessionStorage de forma sincrónica al montar el provider. SSR-safe:
 * en server retorna EMPTY_STATE, en client lee el snapshot. El layout
 * tiene suppressHydrationWarning, así que un mismatch transitorio en la
 * primera pintada no genera warning.
 */
function initFromStorage(storageKey: string): CastingState {
  if (typeof window === "undefined") return EMPTY_STATE;
  try {
    const raw = window.sessionStorage.getItem(storageKey);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw) as {
      shortlist?: unknown;
      exclusives?: unknown;
    };
    const shortlist = Array.isArray(parsed.shortlist)
      ? parsed.shortlist.filter((c): c is string => typeof c === "string")
      : [];
    const exclusives = Array.isArray(parsed.exclusives)
      ? parsed.exclusives.filter((c): c is string => typeof c === "string")
      : [];
    return { shortlist, exclusives: new Set(exclusives) };
  } catch {
    return EMPTY_STATE;
  }
}

export function CastingProvider({
  projectSlug,
  maxTalents,
  maxExclusive,
  children,
}: CastingProviderProps) {
  const storageKey = `casting:${projectSlug}`;
  // useReducer's third arg is a lazy initializer (runs once, before paint).
  const [state, dispatch] = useReducer(
    castingReducer,
    storageKey,
    initFromStorage
  );
  // Skip the very first persist tick to avoid overwriting freshly-hydrated
  // data with itself (a harmless no-op, but spares a sessionStorage write).
  const firstRunRef = useRef(true);

  // Persiste cada cambio.
  useEffect(() => {
    if (firstRunRef.current) {
      firstRunRef.current = false;
      return;
    }
    if (typeof window === "undefined") return;
    try {
      window.sessionStorage.setItem(
        storageKey,
        JSON.stringify({
          shortlist: state.shortlist,
          exclusives: Array.from(state.exclusives),
        })
      );
    } catch {
      // ignore quota errors
    }
  }, [state, storageKey]);

  const isInShortlist = useCallback(
    (code: string) => state.shortlist.includes(code),
    [state.shortlist]
  );

  const isExclusive = useCallback(
    (code: string) => state.exclusives.has(code),
    [state.exclusives]
  );

  const isFull = state.shortlist.length >= maxTalents;
  const isExclusiveFull = state.exclusives.size >= maxExclusive;

  const canAddMore = useCallback(() => !isFull, [isFull]);
  const canMakeMoreExclusive = useCallback(
    () => !isExclusiveFull,
    [isExclusiveFull]
  );

  const add = useCallback(
    (code: string): boolean => {
      if (state.shortlist.includes(code)) return true;
      if (isFull) return false;
      dispatch({ type: "ADD", code });
      return true;
    },
    [state.shortlist, isFull]
  );

  const remove = useCallback((code: string) => {
    dispatch({ type: "REMOVE", code });
  }, []);

  const toggleExclusive = useCallback(
    (code: string): boolean => {
      const alreadyExclusive = state.exclusives.has(code);
      if (!alreadyExclusive && state.exclusives.size >= maxExclusive) {
        return false;
      }
      dispatch({ type: "TOGGLE_EXCLUSIVE", code });
      return true;
    },
    [state.exclusives, maxExclusive]
  );

  const reset = useCallback(() => dispatch({ type: "RESET" }), []);

  const limits = useMemo<ProjectLimits>(
    () => ({ maxTalents, maxExclusive }),
    [maxTalents, maxExclusive]
  );

  const value = useMemo<CastingContextValue>(
    () => ({
      state,
      limits,
      isFull,
      isExclusiveFull,
      isInShortlist,
      isExclusive,
      canAddMore,
      canMakeMoreExclusive,
      add,
      remove,
      toggleExclusive,
      reset,
    }),
    [
      state,
      limits,
      isFull,
      isExclusiveFull,
      isInShortlist,
      isExclusive,
      canAddMore,
      canMakeMoreExclusive,
      add,
      remove,
      toggleExclusive,
      reset,
    ]
  );

  return (
    <CastingContext.Provider value={value}>{children}</CastingContext.Provider>
  );
}

export function useCasting(): CastingContextValue {
  const ctx = useContext(CastingContext);
  if (!ctx) {
    throw new Error("useCasting must be used inside <CastingProvider>");
  }
  return ctx;
}
