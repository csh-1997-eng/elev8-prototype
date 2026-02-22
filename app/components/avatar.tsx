type AvatarProps = {
  name: string | null;
  url?: string | null;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-16 h-16 text-lg",
};

export default function Avatar({ name, url, size = "md" }: AvatarProps) {
  const initials = (name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (url) {
    return (
      <img
        src={url}
        alt={name || "Avatar"}
        className={`${sizes[size]} rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} rounded-full bg-accent/10 text-accent font-semibold flex items-center justify-center`}
    >
      {initials}
    </div>
  );
}
