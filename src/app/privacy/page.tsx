"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";

export const privacySections = [
  {
    section: "🔒 Data Collection",
    faqs: [
      {
        question: "What data does KeyFlash collect?",
        answer:
          "We collect only the data necessary for the app to function, such as your account info if you sign up, and any content you create like flashcards, custom texts, or code snippets.",
      },
      {
        question: "Do you track my typing activity?",
        answer:
          "Typing performance and progress are tracked only locally unless you are logged in, in which case it is saved to your account to provide progress tracking and history.",
      },
    ],
  },
  {
    section: "🛡️ Data Usage",
    faqs: [
      {
        question: "How is my data used?",
        answer:
          "Your data is used to provide the features of KeyFlash, improve user experience, and allow you to sync and retrieve your content across devices.",
      },
      {
        question: "Do you share my data with third parties?",
        answer:
          "We do not sell or share your personal data with third parties. Only anonymized usage analytics may be used to improve the app.",
      },
    ],
  },
  {
    section: "📁 Account & Storage",
    faqs: [
      {
        question: "Can I delete my account?",
        answer:
          "Yes. You can delete your account from the account settings page, which will remove all your saved data permanently.",
      },
      {
        question: "Where is my data stored?",
        answer:
          "All saved data is stored securely on Supabase servers in encrypted form.",
      },
    ],
  },
];

const PrivacyPage = () => {
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

  return (
    <div className="px-2 max-w-[900px] mx-auto mb-30">
      <div className=" mt-2 h-20 md:h-100 px-3 relative flex flex-col items-center justify-center gap-10 overflow-hidden">
        <h1 className="text-xl md:text-2xl lg:text-4xl">Privacy Policy</h1>
        <div className="absolute -right-6 lg:-right-20 -z-1 size-55 md:size-75 lg:size-120 rounded-full bg-radial-[at_50%_50%] from-blue-500/30 to-black to-70%"></div>
      </div>

      <div className="flex flex-col gap-10 relative">
        {privacySections.map((section) => (
          <div key={section.section}>
            <h1 className="md:text-lg font-semibold mb-5">{section.section}</h1>
            <div className="flex flex-col gap-4">
              {section.faqs.map((faq) => (
                <FAQItem
                  key={faq.question}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPage;
