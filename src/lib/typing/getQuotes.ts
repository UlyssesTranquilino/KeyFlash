import axios from "axios";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

type Quote = {
  content: string;
  author: string;
  category: string | null;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getRandomQuote() {
  const quotes: Quote[] = [];

  for (let i = 0; i < 100; i++) {
    try {
     const { data } = await axios.get<
        [{ quote: string; author: string; category?: string }]
      >("https://api.api-ninjas.com/v1/quotes", {
        headers: { "X-Api-Key": process.env.NEXT_PUBLIC_NINJAS_KEY! },
      });

      if (data && data.length > 0) {
        quotes.push({
          content: data[0].quote,
          author: data[0].author,
          category: data[0].category || null,
        });
      }

      await new Promise((resolve) => setTimeout(resolve, 500)); // Delay to avoid hitting API rate limits
    } catch (err: any) {
      console.error(`Error fetching quote ${err.message}`);
    }
  }

  return quotes;
}

export const insertQuotes = async () => {
  const quotes = await getRandomQuote();

  const { data, error } = await supabase.from("quotes").insert(quotes);

  if (error) {
    console.error("Error inserting quotes:", error);
  } 
};
