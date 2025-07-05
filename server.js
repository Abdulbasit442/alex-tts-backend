require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allow requests from any origin (or restrict if you want)
app.use(
  cors({
    origin: "*", // change to ["http://127.0.0.1:5500", "https://your-frontend.com"] if needed
  })
);

app.use(express.json());
app.use(express.static("public"));

// ElevenLabs API Key
const ELEVEN_API_KEY = process.env.ELEVEN_API_KEY;

// Default voice if none provided
const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel

// Map your fake celebrity voices to available free voice IDs
const voiceMap = {
  "TM:default": "21m00Tcm4TlvDq8ikWAM", // Rachel
  "TM:drake": "21m00Tcm4TlvDq8ikWAM",
  "TM:kanye": "AZnzlk1XvdvUeBnXmlld", // Domi
  "TM:obama": "EXAVITQu4vr4xnSDxMaL", // Bella
  "TM:mrbeast": "MF3mGyEYCl7XYWbV9V6O",
  "TM:elon": "21m00Tcm4TlvDq8ikWAM",
  "TM:trump": "AZnzlk1XvdvUeBnXmlld",
  "TM:freeman": "EXAVITQu4vr4xnSDxMaL",
  "TM:biden": "MF3mGyEYCl7XYWbV9V6O",
  "TM:tate": "EXAVITQu4vr4xnSDxMaL",
  "TM:rock": "21m00Tcm4TlvDq8ikWAM",

  "TM:adele": "EXAVITQu4vr4xnSDxMaL",
  "TM:taylor": "AZnzlk1XvdvUeBnXmlld",
  "TM:beyonce": "MF3mGyEYCl7XYWbV9V6O",
  "TM:cardi": "AZnzlk1XvdvUeBnXmlld",
  "TM:nicki": "21m00Tcm4TlvDq8ikWAM",
  "TM:rihanna": "EXAVITQu4vr4xnSDxMaL",
  "TM:angelina": "MF3mGyEYCl7XYWbV9V6O",
  "TM:emma": "AZnzlk1XvdvUeBnXmlld",
  "TM:queen": "EXAVITQu4vr4xnSDxMaL",
  "TM:oprah": "21m00Tcm4TlvDq8ikWAM",
};

// POST /api/tts - Generate speech
app.post("/api/tts", async (req, res) => {
  try {
    const { text, voiceId } = req.body;

    const resolvedVoice = voiceMap[voiceId] || DEFAULT_VOICE_ID;

    const response = await axios({
      method: "POST",
      url: `https://api.elevenlabs.io/v1/text-to-speech/${resolvedVoice}`,
      headers: {
        "xi-api-key": ELEVEN_API_KEY,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
      },
      data: {
        text: text || "Hello, world!",
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75,
        },
      },
      responseType: "arraybuffer",
    });

    const audioPath = path.join(__dirname, "public", "output.mp3");
    fs.writeFileSync(audioPath, response.data);
    res.json({ success: true, url: "/output.mp3" });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ success: false, message: "Failed to generate voice." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
