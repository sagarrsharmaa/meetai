import { createAvatar } from "@dicebear/core";
import { botttsNeutral, initials } from "@dicebear/collection";

interface Props {
  seed: string;
  variant: "botttsNeutral" | "initials";
}

/**
 * Deterministic avatar as a data URI. Used both by <GeneratedAvatar /> and by
 * the server when upserting users into Stream (which needs a plain URL/URI).
 */
export const generateAvatarUri = ({ seed, variant }: Props) => {
  const avatar =
    variant === "botttsNeutral"
      ? createAvatar(botttsNeutral, { seed })
      : createAvatar(initials, { seed, fontWeight: 500, fontSize: 42 });

  return avatar.toDataUri();
};
