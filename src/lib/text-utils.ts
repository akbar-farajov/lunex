export function cleanTextForSpeech(text: string): string {
  let cleaned = text;

  // Remove markdown headers (###, ##, #)
  cleaned = cleaned.replace(/^#{1,6}\s+/gm, "");

  // Remove markdown bold (**text** or __text__)
  cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, "$1");
  cleaned = cleaned.replace(/__(.*?)__/g, "$1");

  // Remove markdown italic (*text* or _text_)
  cleaned = cleaned.replace(/\*(.*?)\*/g, "$1");
  cleaned = cleaned.replace(/_(.*?)_/g, "$1");

  // Remove markdown links [text](url)
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");

  // Remove markdown images ![alt](url)
  cleaned = cleaned.replace(/!\[([^\]]*)\]\([^\)]+\)/g, "");

  // Remove markdown code blocks ```code``` and `code`
  cleaned = cleaned.replace(/```[\s\S]*?```/g, "");
  cleaned = cleaned.replace(/`([^`]+)`/g, "$1");

  // Remove markdown lists (-, *, +, 1.)
  cleaned = cleaned.replace(/^[\s]*[-*+]\s+/gm, "");
  cleaned = cleaned.replace(/^[\s]*\d+\.\s+/gm, "");

  // Remove markdown blockquotes (>)
  cleaned = cleaned.replace(/^>\s+/gm, "");

  // Remove markdown horizontal rules (---, ***)
  cleaned = cleaned.replace(/^[-*]{3,}$/gm, "");

  // Remove emojis (Unicode emoji ranges)
  cleaned = cleaned.replace(
    /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu,
    ""
  );

  // Remove extra whitespace and normalize
  cleaned = cleaned.replace(/\s+/g, " ");
  cleaned = cleaned.replace(/\n\s*\n/g, "\n");
  cleaned = cleaned.trim();

  return cleaned;
}
