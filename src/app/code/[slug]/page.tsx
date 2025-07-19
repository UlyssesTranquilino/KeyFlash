import { WpmProvider } from "@/app/context/WpmContext";
import CodePageClient from "@/components/ui/code/CodePageClient";
export default async function Page({ params }: { params: { slug: string } }) {
  return (
    <WpmProvider>
      <CodePageClient slug={params.slug} />
    </WpmProvider>
  );
}
