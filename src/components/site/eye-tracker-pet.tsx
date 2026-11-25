import { Watcher } from "@/components/creative/watcher";

/**
 * The site-wide pet: Bencho's eye tracker, pinned to the corner and watching
 * the whole page. It is decorative, so the wrapper stays out of the flow and
 * only the ball itself takes the pointer.
 */
export function EyeTrackerPet() {
  return (
    <div className="eye-pet">
      <Watcher
        follow={74}
        bounce={34}
        size={96}
        shape="Cube"
        eyes="Slant"
        within="body"
      />
    </div>
  );
}
