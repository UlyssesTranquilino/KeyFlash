import { WpmProvider } from "@/app/context/WpmContext";
import { FlashcardContextProvider } from "@/app/context/FlashcardContext";
import FlashcardPageClient from "@/components/ui/flashcard/FlashcardPageClient";

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  return (
    <WpmProvider>
      <FlashcardContextProvider>
        <FlashcardPageClient slug={slug} />
      </FlashcardContextProvider>
    </WpmProvider>
  );
}
