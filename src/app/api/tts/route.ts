const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID =
  process.env.ELEVENLABS_VOICE_ID ?? "21m00Tcm4TlvDq8ikWAM";
const ELEVENLABS_MODEL_ID =
  process.env.ELEVENLABS_MODEL_ID ?? "eleven_multilingual_v2";

export async function POST(req: Request) {
  if (!ELEVENLABS_API_KEY) {
    return new Response(
      JSON.stringify({ error: "ElevenLabs API key is not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const { text } = (await req.json()) as { text?: string };

  if (!text || !text.trim()) {
    return new Response(JSON.stringify({ error: "Text is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const trimmed = text.slice(0, 5000);

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text: trimmed,
          model_id: ELEVENLABS_MODEL_ID,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      console.error(
        `ElevenLabs TTS error: ${response.status} - ${errorText}`
      );
      return new Response(
        JSON.stringify({ error: "Text-to-speech generation failed" }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("ElevenLabs TTS request failed:", error);
    return new Response(
      JSON.stringify({ error: "Text-to-speech service unavailable" }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }
}
