import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <Link href="/explore" className="text-2xl font-semibold tracking-tight mb-8">
        elev8
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
