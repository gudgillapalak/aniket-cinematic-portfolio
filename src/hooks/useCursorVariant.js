import { useCallback, useContext } from "react";
import { CursorContext } from "../components/cinematic/CursorProvider.jsx";

// Lets any component tell the custom cursor what label/state to show
// on hover, e.g. useCursorVariant()("PLAY") on a video card.
export function useCursorVariant() {
  const ctx = useContext(CursorContext);

  return useCallback(
    (label) => ({
      onMouseEnter: () => ctx?.setVariant(label),
      onMouseLeave: () => ctx?.setVariant(null),
    }),
    [ctx]
  );
}
