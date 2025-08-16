export const formatTextWithLineBreaks = (text: string, maxLineLength = 50) => {
  if (!text) return text;
  
  // Split by existing newlines first to preserve intentional line breaks
  const paragraphs = text.split('\n');
  const formattedParagraphs: string[] = [];
  
  paragraphs.forEach((paragraph) => {
    if (!paragraph.trim()) {
      // Preserve empty lines
      formattedParagraphs.push('');
      return;
    }
    
    const words = paragraph.split(/\s+/).filter(word => word.length > 0);
    let currentLine = '';
    
    words.forEach((word, index) => {
      // Handle extra long words by breaking them
      if (word.length > maxLineLength) {
        // First, add current line if it has content
        if (currentLine.trim()) {
          formattedParagraphs.push(currentLine.trim());
          currentLine = '';
        }
        
        // Break the long word into chunks
        for (let i = 0; i < word.length; i += maxLineLength) {
          const chunk = word.slice(i, i + maxLineLength);
          formattedParagraphs.push(chunk);
        }
        return;
      }
      
      // Calculate length if we add this word (including space)
      const spaceNeeded = currentLine.length > 0 ? 1 : 0;
      const potentialLength = currentLine.length + spaceNeeded + word.length;
      
      if (potentialLength > maxLineLength && currentLine.trim()) {
        // Current line would be too long, start new line
        formattedParagraphs.push(currentLine.trim());
        currentLine = word;
      } else {
        // Add word to current line
        if (currentLine.length > 0) {
          currentLine += ' ';
        }
        currentLine += word;
      }
      
      // If this is the last word, add the current line
      if (index === words.length - 1 && currentLine.trim()) {
        formattedParagraphs.push(currentLine.trim());
      }
    });
  });
  
  return formattedParagraphs.join('\n');
};