import type { CastingAction, CastingState } from "@/types/talent";

/**
 * Reducer puro del CastingContext, extraido para testabilidad sin React.
 *
 * Reglas de negocio invariantes:
 * - ADD: no duplicados (idempotente sobre la misma seleccion).
 * - REMOVE: tambien limpia exclusivos (no puedes ser exclusivo si no estas
 *   en la shortlist).
 * - TOGGLE_EXCLUSIVE: solo si esta en shortlist; idempotente; el cap de
 *   maxExclusive lo enforza el caller (CastingProvider) antes de
 *   despachar — el reducer no conoce limites.
 * - HYDRATE: sobrescribe state desde sessionStorage al montar.
 * - RESET: estado vacio.
 */
export const EMPTY_STATE: CastingState = {
  shortlist: [],
  exclusives: new Set<string>(),
};

export function castingReducer(
  state: CastingState,
  action: CastingAction
): CastingState {
  switch (action.type) {
    case "ADD": {
      if (state.shortlist.includes(action.code)) return state;
      return { ...state, shortlist: [...state.shortlist, action.code] };
    }
    case "REMOVE": {
      if (!state.shortlist.includes(action.code)) return state;
      const nextExclusives = new Set(state.exclusives);
      nextExclusives.delete(action.code);
      return {
        shortlist: state.shortlist.filter((c) => c !== action.code),
        exclusives: nextExclusives,
      };
    }
    case "TOGGLE_EXCLUSIVE": {
      if (!state.shortlist.includes(action.code)) return state;
      const nextExclusives = new Set(state.exclusives);
      if (nextExclusives.has(action.code)) {
        nextExclusives.delete(action.code);
      } else {
        nextExclusives.add(action.code);
      }
      return { ...state, exclusives: nextExclusives };
    }
    case "HYDRATE": {
      return {
        shortlist: action.payload.shortlist,
        exclusives: new Set(action.payload.exclusives),
      };
    }
    case "RESET":
      return { shortlist: [], exclusives: new Set<string>() };
    default:
      return state;
  }
}
