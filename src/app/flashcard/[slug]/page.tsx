import { createClient } from "../../../../utils/supabase/server";

const FlashcardPage = ({ params }: { params: { slug: string } }) => {
  const id = params.slug.split("-")[0];
  return <div>page</div>;
};

export default FlashcardPage;
