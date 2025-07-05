require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Voice ID mapping
const voiceMap = {
  "TM:default": "EXAVITQu4vr4xnSDxMaL", // Replace with real voice_id from ElevenLabs
  "TM:drake": "EXAVITQu4vr4xnSDxMaL",
  "TM:kanye": "EXAVITQu4vr4xnSDxMaL",
  "TM:obama": "EXAVITQu4vr4xnSDxMaL",
  "TM:mrbeast": "EXAVITQu4vr4xnSDxMaL",
  "TM:elon": "EXAVITQu4vr4xnSDxMaL",
  "TM:trump": "EXAVITQu4vr4xnSDxMaL",
  "TM:freeman": "EXAVITQu4vr4xnSDxMaL",
  "TM:biden": "EXAVITQu4vr4xnSDxMaL",
  "TM:tate": "EXAVITQu4vr4xnSDxMaL",
  "TM:rock": "EXAVITQu4vr4xnSDxMaL",
  "TM:adele": "EXAVITQu4vr4xnSDxMaL",
  "TM:taylor": "EXAVITQu4vr4xnSDxMaL",
  "TM:beyonce": "EXAVITQu4vr4xnSDxMaL",
  "TM:cardi": "EXAVITQu4vr4xnSDxMaL",
  "TM:nicki": "EXAVITQu4vr4xnSDxMaL",
  "TM:rihanna": "EXAVITQu4vr4xnSDxMaL",
  "TM:angelina": "EXAVITQu4vr4xnSDxMaL",
  "TM:emma": "EXAVITQu4vr4xnSDxMaL",
  "TM:queen": "EXAVITQu4vr4xnSDxMaL",
  "TM:oprah": "EXAVITQu4vr4xnSDxMaL"
};

// ElevenLabs API key
const elevenApiKey = process.env.ELEVENLABS_API_KEY;

app.post("/api/tts", async (req, res) => {
  const { text, voiceId } = req.body;
  const actualVoiceId = voiceMap[voiceId] || voiceMap["TM:default"];

  if (!text || !actualVoiceId) {
    return res.status(400).json({ error: "Missing text or voice ID" });
  }

  try {
    const response = await axios({
      method: "POST",
      url: `https://api.elevenlabs.io/v1/text-to-speech/${actualVoiceId}`,
      headers: {
        "xi-api-key": elevenApiKey,
        "Content-Type": "application/json"
      },
      responseType: "arraybuffer",
      data: {
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.3,
          similarity_boost: 0.7
        }
      }
    });

    const fileName = uuidv4() + ".mp3";
    const filePath = path.join(__dirname, fileName);
    fs.writeFileSync(filePath, response.data);
    res.sendFile(filePath, () => {
      fs.unlinkSync(filePath); // delete after sending
    });
  } catch (err) {
    console.error("❌ TTS Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate voice" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
