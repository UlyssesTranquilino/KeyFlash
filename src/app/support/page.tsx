"use client";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { X, ChevronsUpDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

export const supportFaqs = [
  {
    section: "🛠️ Getting Started",
    faqs: [
      {
        question: "How do I use KeyFlash without an account?",
        answer:
          "Start by selecting a typing mode — Random, Custom, or Flashcard. No account is required to try it out.",
      },
      {
        question: "Is KeyFlash free to use?",
        answer:
          "Yes, you can use KeyFlash for free with core features like flashcards, typing modes, and saving your progress.",
      },
    ],
  },
  {
    section: "✍️ Typing Modes",
    faqs: [
      {
        question: "What typing modes are available?",
        answer:
          "You can choose from Random Typing, Random Words, Quotes, Flashcards, Custom Texts, Custom Code, or DSA Code Snippets.",
      },
      {
        question: "What is Flashcard Typing Mode?",
        answer:
          "In Flashcard mode, you type your answers instead of just reading them — perfect for memorizing definitions or concepts.",
      },
    ],
  },
  {
    section: "💾 Creating & Uploading",
    faqs: [
      {
        question: "How do I create flashcards?",
        answer:
          "Click 'Create' → Select 'Flashcard' → You can manually enter or upload a .txt file in the format: question - answer.",
      },
      {
        question: "Can I upload text or code files?",
        answer:
          "Yes. When creating a text or code session, you can upload a .txt file or paste content directly.",
      },
      {
        question: "What details are needed for code uploads?",
        answer:
          "Only the title and code are required. You can optionally provide a description, difficulty, language, and time/space complexity.",
      },
    ],
  },
  {
    section: "👤 Accounts",
    faqs: [
      {
        question: "What can I do with a free account?",
        answer:
          "With a free account, you can create and save flashcards, custom texts, or code, and track your typing performance.",
      },
      {
        question: "Is my data saved?",
        answer:
          "Yes, when logged in, your flashcards, texts, and code snippets are saved.",
      },
    ],
  },
  {
    section: "💎 Pro & Billing",
    faqs: [
      {
        question: "What is included in the Pro plan?",
        answer:
          "KeyFlash Pro removes ads, unlocks unlimited flashcards, texts, and code snippets, and gives you priority access to new features.",
      },
      {
        question: "How much does Pro cost?",
        answer:
          "Right now, we're offering an Early Access Lifetime Deal for just $4.99 — one-time payment, no subscription. This price may increase in the future.",
      },
      {
        question: "Do I need Pro to use the app?",
        answer:
          "No — core features are free forever. But with a free account, you're limited to 5 flashcards, 5 custom texts, and 5 code snippets. Pro removes these limits and ads.",
      },
    ],
  },
  {
    section: "💬 Feedback & Support",
    faqs: [
      {
        question: "How can I submit feedback or report bugs?",
        answer:
          "You can use the 'Send Feedback' button in the dashboard or message us directly through the support page.",
      },
      {
        question: "I have suggestions — where can I send them?",
        answer:
          "We’d love to hear them! Reach out via the contact form on the support page or through the feedback tab in your dashboard.",
      },
    ],
  },
];

const SupportPage = () => {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchText);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(handler); // cleanup on next effect call
  }, [searchText]);

  const FAQItem = ({
    question,
    answer,
  }: {
    question: string;
    answer: string;
  }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="flex flex-col gap-2"
      >
        <CollapsibleTrigger asChild>
          <div className="bg-gray-900/70 hover:bg-gray-900 cursor-pointer p-3 flex items-center justify-between gap-4 px-4">
            <h4 className="text-sm lg:text-base font-medium">{question}</h4>

            <Button variant="ghost" size="icon" className="size-8">
              <ChevronsUpDown />
              <span className="sr-only">Toggle</span>
            </Button>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="flex flex-col gap-2">
          <div className="rounded-md border px-6 py-2 font-mono text-sm lg:text-base">
            {answer}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const filteredFaqs = supportFaqs
    .map((section) => ({
      ...section,
      faqs: section.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          faq.answer.toLowerCase().includes(debouncedSearch.toLowerCase())
      ),
    }))
    .filter((section) => section.faqs.length > 0);

  return (
    <div className="px-2 max-w-[900px] mx-auto mb-30">
      <div className="-mt-10 h-70 md:h-100 px-3  relative flex flex-col items-center justify-center  gap-10 overflow-hidden">
        <h1 className="text-xl md:text-2xl lg:text-4xl ">How can we help?</h1>

        <div className="relative w-full max-w-[700px] mx-auto">
          <Input
            id="search"
            type="text"
            placeholder="Search "
            required
            className="input-glow !bg-gray-900/30 w-full   max-w-200 text-sm"
            value={searchText}
            onChange={handleSearch}
          />
          {searchText && (
            <button
              onClick={() => setSearchText("")}
              className="absolute right-3 top-1 rounded-full hover:bg-gray-800 cursor-pointer"
            >
              <X className="scale-75" />
            </button>
          )}
        </div>

        <div className="absolute  -right-6 lg:-right-20 -z-1 size-55 md:size-75 lg:size-120 rounded-full bg-radial-[at_50%_50%] from-blue-500/30 to-black to-70%"></div>
      </div>

      <div className="flex flex-col gap-10 relative ">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((section) => (
            <div key={section.section}>
              <h1 className="md:text-lg font-semibold mb-5">
                {section.section}
              </h1>
              <div className="flex flex-col gap-4">
                {section.faqs.map((faq) => (
                  <div key={faq.question} className="w-full">
                    <FAQItem question={faq.question} answer={faq.answer} />
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <p>No results found for "{searchText}"</p>
          </div>
        )}

        <div className="absolute bottom-30 left-0 -z-1 size-55 md:size-95 lg:size-200 lg:left-20 rounded-full bg-radial-[at_50%_50%] from-blue-500/20 to-black to-70%"></div>
      </div>
    </div>
  );
};

export default SupportPage;
