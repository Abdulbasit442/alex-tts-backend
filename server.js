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

// Inside server.js or wherever you map voice IDs:
const defaultVoiceId = 'EXAVITQu4vr4xnSDxMaL'; // Rachel (free plan)

const voiceMap = {
  'TM:default': defaultVoiceId,
  'TM:drake': defaultVoiceId,
  'TM:kanye': defaultVoiceId,
  'TM:obama': defaultVoiceId,
  'TM:mrbeast': defaultVoiceId,
  'TM:elon': defaultVoiceId,
  'TM:trump': defaultVoiceId,
  'TM:freeman': defaultVoiceId,
  'TM:biden': defaultVoiceId,
  'TM:tate': defaultVoiceId,
  'TM:rock': defaultVoiceId,
  'TM:adele': defaultVoiceId,
  'TM:taylor': defaultVoiceId,
  'TM:beyonce': defaultVoiceId,
  'TM:cardi': defaultVoiceId,
  'TM:nicki': defaultVoiceId,
  'TM:rihanna': defaultVoiceId,
  'TM:angelina': defaultVoiceId,
  'TM:emma': defaultVoiceId,
  'TM:queen': defaultVoiceId,
  'TM:oprah': defaultVoiceId,
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
