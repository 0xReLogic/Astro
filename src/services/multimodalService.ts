
export class MultimodalService {
  private geminiApiKey: string;

  constructor(geminiApiKey: string) {
    this.geminiApiKey = geminiApiKey;
  }

  async processVoiceMessage(audioBuffer: Buffer): Promise<string> {
    // Convert voice to text using Gemini API
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiApiKey}`;
    
    const requestBody = {
      contents: [{
        parts: [{
          text: "Transkripsi audio ini ke dalam teks bahasa Indonesia yang jelas dan benar."
        }, {
          inline_data: {
            mime_type: "audio/ogg",
            data: audioBuffer.toString('base64')
          }
        }]
      }]
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Voice processing error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  async analyzeImage(imageBuffer: Buffer, mimeType: string, prompt: string = "Deskripsikan gambar ini secara detail"): Promise<string> {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiApiKey}`;
    
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }, {
          inline_data: {
            mime_type: mimeType,
            data: imageBuffer.toString('base64')
          }
        }]
      }]
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Image analysis error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  async generateImageVariation(prompt: string, style: string = "realistic"): Promise<string> {
    // Enhanced image generation with style options
    const enhancedPrompt = `${prompt}, style: ${style}, high quality, detailed`;
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiApiKey}`;
    
    const requestBody = {
      contents: [{
        parts: [{
          text: `Buatlah deskripsi gambar yang sangat detail untuk prompt: "${enhancedPrompt}". Sertakan detail warna, komposisi, pencahayaan, dan mood.`
        }]
      }]
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Image generation error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }
}
