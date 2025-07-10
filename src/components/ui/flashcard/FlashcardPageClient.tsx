"use client";

import { createClient } from "../../../../utils/supabase/server";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { getFlashcard } from "../../../../utils/flashcard/flashcard";
import { Button } from "@/components/ui/button";

const FlashcardPageClient = ({ slug }: { slug: string }) => {
  const { user } = useAuth();
  const id = slug.split("-")[0];
  const [flashcard, setFlashcard] = useState<any>({});
  const [copyFlashcardData, setCopyFlashcardData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFlashcard = async () => {
      if (user?.id) {
        setLoading(true);
        const { data } = await getFlashcard(user.id, id);
        console.log(data);
        setLoading(false);
        setFlashcard(data);
        setCopyFlashcardData(data);
      }
    };
    fetchFlashcard();
  }, [user, id]);

  return (
    <div>
      {!loading ? (
        <div className="mt-4 flex flex-col gap-5 overflow-scroll max-h-100">
          <div className="flex items-center justify-around gap-9 ">
            <h1>Question</h1>
            <h1>Answer</h1>
          </div>
          {copyFlashcardData?.terms?.map((card: any, index: number) => (
            <div
              key={card.id}
              className="flex flex-col  relative bg-gray-900/30"
            >
              {/* {copyFlashcardData.length > 1 && (
              <button
                onClick={() => handleDelete(card.id)}
                className="absolute  hover:text-red-400 text-gray-500 self-end p-1"
              >
                <Trash className="scale-70" />
              </button>
            )} */}
              <div className="flex items-center justify-around gap-3 sm:gap-5 ">
                <div className="bg-gray-900 rounded-sm w-full h-full p-2 sm:p-4 min-h-30 md:min-h-40">
                  <textarea
                    value={card.question}
                    onInput={(e) => {
                      e.currentTarget.style.height = "auto";
                      e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                    }}
                    onChange={(e) => {
                      setCopyFlashcardData((prev: any) => {
                        return prev.map((item: object, idx: number) => {
                          if (idx === index) {
                            return { ...item, question: e.target.value };
                          } else {
                            return item;
                          }
                        });
                      });
                    }}
                    className="h-full w-full bg-gray-900 resize-none overflow-hidden rounded-sm p-2 focus:outline-0"
                  />
                </div>

                <div className="bg-gray-900 rounded-sm w-full h-full p-2 sm:p-4 min-h-30 md:min-h-40">
                  <textarea
                    value={card.answer}
                    onInput={(e) => {
                      e.currentTarget.style.height = "auto";
                      e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                    }}
                    onChange={(e) => {
                      setCopyFlashcardData((prev: any) => {
                        return prev.map((item: object, idx: number) => {
                          if (idx === index) {
                            return { ...item, answer: e.target.value };
                          } else {
                            return item;
                          }
                        });
                      });
                    }}
                    className="h-full w-full bg-gray-900 resize-none overflow-hidden rounded-sm p-2 focus:outline-0"
                  />
                </div>
              </div>
            </div>
          ))}
          {/* 
          <Button
            onClick={() => {
              setCopyFlashcardData((prev: any) => [
                ...prev,
                {
                  id: Date.now(),
                  question: "",
                  answer: "",
                },
              ]);
            }}
            className="h-12 border-2 border-dashed bg-gray-900/20 hover:bg-gray-800/30 text-gray-200 w-1/2 mx-auto p-3 mt-2"
          >
            Add Card
          </Button> */}
        </div>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
};

export default FlashcardPageClient;
