
interface GeminiConfig {
  temperature: number;
  topK: number;
  topP: number;
  maxOutputTokens: number;
}

const defaultConfig: GeminiConfig = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 1024,
};

export class GeminiService {
  private apiKey: string;
  private baseUrl = "https://generativelanguage.googleapis.com/v1beta/models";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateContent(prompt: string, config: Partial<GeminiConfig> = {}): Promise<string> {
    const finalConfig = { ...defaultConfig, ...config };
    const apiUrl = `${this.baseUrl}/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
    
    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: finalConfig,
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error:", errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("No response from Gemini API");
    }
  }

  async generateQuote(): Promise<string> {
    return this.generateContent(
      "Buatlah kutipan inspiratif yang memotivasi dan memberikan semangat. Kutipan harus dalam bahasa Indonesia, singkat tapi bermakna mendalam."
    );
  }

  async generateJoke(): Promise<string> {
    return this.generateContent(
      "Buatlah lelucon yang lucu dan menghibur dalam bahasa Indonesia. Lelucon harus bersih, tidak menyinggung, dan cocok untuk semua umur."
    );
  }

  async generateRecipe(): Promise<string> {
    return this.generateContent(
      "Buatlah resep masakan Indonesia yang sederhana dan mudah dibuat. Sertakan bahan-bahan dan langkah-langkah yang jelas."
    );
  }

  async generateWritingAssistance(topic: string): Promise<string> {
    return this.generateContent(
      `Berikan bantuan menulis yang komprehensif untuk topik: "${topic}". Sertakan outline, tips, dan saran praktis untuk menulis dengan baik.`
    );
  }

  async generateCreativeText(prompt: string): Promise<string> {
    return this.generateContent(
      `Buatlah konten kreatif dan menarik berdasarkan prompt berikut: ${prompt}`
    );
  }
}
