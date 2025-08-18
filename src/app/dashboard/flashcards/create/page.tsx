
// app/dashboard/flashcards/create/page.tsx
import { Suspense } from "react";
import FlashcardCreate from "@/components/ui/flashcard/FlashcardCreate";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FlashcardCreate />
    </Suspense>
  );
}
