import { NextApiRequest, NextApiResponse } from "next";

// Voice presets matching the agent's voices.json
const VOICE_PRESETS = {
  presets: {
    Fin: { voice_id: "i7EudNFRpwgFCJ3YQ0wc", description: "Fin's voice" },
    "Cowboy Grandad": { voice_id: "NOpBlnGInO9m6vDvFkFC", description: "Cowboy grandad" },
    Monster: { voice_id: "wXvR48IpOq9HACltTmt7", description: "Monster voice" },
    Cocnis: { voice_id: "EQx6HGDYjkDpcli6vorJ", description: "Cocnis voice" },
    "Mr Robot": { voice_id: "ZEcx3Wdpj4EvM8PltzHY", description: "Mr Robot" },
    AmeriDJ: { voice_id: "CeNX9CMwmxDxUF5Q2Inm", description: "American DJ" },
    "Mr 1940s": { voice_id: "LAVBpjk22aEukDt0B9AD", description: "1940s style voice" },
  },
  default: "Cowboy Grandad",
  models: {
    "Turbo v2.5": "eleven_turbo_v2_5",
    "Flash v2.5": "eleven_flash_v2_5",
    v3: "eleven_v3",
  },
  default_model: "Turbo v2.5",
  agent_models: {
    "Gemini Flash": "google/gemini-3-flash-preview",
    "Gemini Pro": "google/gemini-3.1-pro-preview",
    "Claude Opus": "anthropic/claude-opus-4-6",
    "Claude Sonnet": "anthropic/claude-sonnet-4-6",
    "Kimi": "openrouter/moonshotai/kimi-k2.5",
  },
  default_agent_model: "google/gemini-3-flash-preview",
};

export default function handleVoices(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(VOICE_PRESETS);
}
