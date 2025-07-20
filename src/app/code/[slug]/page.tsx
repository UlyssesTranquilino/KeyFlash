import { WpmProvider } from "@/app/context/WpmContext";
import CodePageClient from "@/components/ui/code/CodePageClient";
import { TimerProvider } from "@/app/context/TimerContext";
import { QuoteProvider } from "@/app/context/QuoteContext";

export default async function Page({ params }: { params: { slug: string } }) {
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
