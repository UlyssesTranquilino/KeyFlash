import { WpmProvider } from "@/app/context/WpmContext";
import { TextContextProvider } from "@/app/context/TextContext";
import TextPageClient from "@/components/ui/text/TextPageClient";
import { AddTextProvider } from "@/app/context/AddTextContext";
import { TimerProvider } from "@/app/context/TimerContext";
import { QuoteProvider } from "@/app/context/QuoteContext";

export default async function Page({ params }: { params: { slug: string } }) {
  return (
    <QuoteProvider>
      <TimerProvider>
        <AddTextProvider>
          <WpmProvider>
            <TextContextProvider>
              <TextPageClient slug={params.slug} />
            </TextContextProvider>
          </WpmProvider>
        </AddTextProvider>
      </TimerProvider>
    </QuoteProvider>
  );
}
