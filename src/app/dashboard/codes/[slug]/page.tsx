import { WpmProvider } from "@/app/context/WpmContext";
import CodePageClient from "@/components/ui/code/CodePageClient";
import { TimerProvider } from "@/app/context/TimerContext";
import { QuoteProvider } from "@/app/context/QuoteContext";

interface PageProps {
  params: {
    slug: string;
  };
}

export default function Page({ params }: PageProps) {
  const { slug } = params;

  return (
    <QuoteProvider>
      <TimerProvider>
        <WpmProvider>
          <CodePageClient slug={slug} />
        </WpmProvider>
      </TimerProvider>
    </QuoteProvider>
  );
}
