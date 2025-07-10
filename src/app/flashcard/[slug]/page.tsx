import FlashcardPageClient from "@/components/ui/flashcard/FlashcardPageClient";

export default function Page({ params }: { params: { slug: string } }) {
  return <FlashcardPageClient slug={params.slug} />;
}
