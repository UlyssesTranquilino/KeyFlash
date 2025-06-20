import { useEffect, useState } from "react";

export function useTypingEffect(text: string, speed = 50) {
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    setTypedText("");

    let i = 0;
    const interval = setInterval(() => {
      setTypedText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return typedText;
}
