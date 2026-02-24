import { getCommunityBySlug } from "@/lib/queries";
import { notFound } from "next/navigation";
import NewThreadForm from "../../../../components/new-thread-form";

export default async function NewThreadPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const community = await getCommunityBySlug(slug);
  if (!community) notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <p className="text-sm text-muted mb-1">
          Posting in
        </p>
        <h1 className="text-2xl font-semibold">{community.name}</h1>
      </div>

      <NewThreadForm community={community} />
    </div>
  );
}
