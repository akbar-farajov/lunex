const AZ_SYMBOL_MAP: [RegExp, string][] = [
  [/°C/g, " dərəcə Selsi"],
  [/°F/g, " dərəcə Farenheyt"],
  [/°/g, " dərəcə"],
  [/(\d)\s*%/g, "$1 faiz"],
  [/%/g, " faiz"],
  [/km\/h/gi, "kilometr saat"],
  [/km\/s/gi, "kilometr saniyə"],
  [/m\/s/gi, "metr saniyə"],
  [/km²/g, "kvadrat kilometr"],
  [/m²/g, "kvadrat metr"],
  [/km/g, "kilometr"],
  [/mm/g, "millimetr"],
  [/cm/g, "santimetr"],
  [/mg/g, "milliqram"],
  [/kg/g, "kiloqram"],
  [/ml/g, "millilitr"],
  [/hPa/g, "hektopaskal"],
  [/UV/g, "ultrabənövşəyi"],
  [/CO₂/g, "karbon dioksid"],
  [/&/g, " və "],
  [/\+/g, " üstəgəl "],
  [/=/g, " bərabərdir "],
  [/</g, " kiçikdir "],
  [/>/g, " böyükdür "],
];

function replaceSymbolsForSpeech(text: string): string {
  let result = text;
  for (const [pattern, replacement] of AZ_SYMBOL_MAP) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

export function cleanTextForSpeech(text: string): string {
  let cleaned = text;

  cleaned = cleaned.replace(/^#{1,6}\s+/gm, "");

  cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, "$1");
  cleaned = cleaned.replace(/__(.*?)__/g, "$1");

  cleaned = cleaned.replace(/\*(.*?)\*/g, "$1");
  cleaned = cleaned.replace(/_(.*?)_/g, "$1");

  cleaned = cleaned.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");

  cleaned = cleaned.replace(/!\[([^\]]*)\]\([^\)]+\)/g, "");

  cleaned = cleaned.replace(/```[\s\S]*?```/g, "");
  cleaned = cleaned.replace(/`([^`]+)`/g, "$1");

  cleaned = cleaned.replace(/^[\s]*[-*+]\s+/gm, "");
  cleaned = cleaned.replace(/^[\s]*\d+\.\s+/gm, "");

  cleaned = cleaned.replace(/^>\s+/gm, "");

  cleaned = cleaned.replace(/^[-*]{3,}$/gm, "");

  cleaned = cleaned.replace(
    /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu,
    ""
  );

  cleaned = replaceSymbolsForSpeech(cleaned);

  cleaned = cleaned.replace(/\s+/g, " ");
  cleaned = cleaned.replace(/\n\s*\n/g, "\n");
  cleaned = cleaned.trim();

  return cleaned;
}
