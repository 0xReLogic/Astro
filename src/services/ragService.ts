
export class RAGService {
  private geminiApiKey: string;

  constructor(geminiApiKey: string) {
    this.geminiApiKey = geminiApiKey;
  }

  async searchWeb(query: string): Promise<string> {
    try {
      // Using DuckDuckGo Instant Answer API (free alternative)
      const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
      
      const response = await fetch(searchUrl);
      if (!response.ok) {
        throw new Error(`Search API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Extract relevant information
      let searchContext = "";
      if (data.Abstract) {
        searchContext += `Abstract: ${data.Abstract}\n`;
      }
      if (data.RelatedTopics && data.RelatedTopics.length > 0) {
        searchContext += "Related Topics:\n";
        data.RelatedTopics.slice(0, 3).forEach((topic: any, index: number) => {
          if (topic.Text) {
            searchContext += `${index + 1}. ${topic.Text}\n`;
          }
        });
      }
      
      return searchContext || "Tidak ada informasi yang ditemukan.";
    } catch (error) {
      console.error("Search error:", error);
      return "Maaf, terjadi kesalahan saat mencari informasi.";
    }
  }

  async enhanceWithWebContext(prompt: string): Promise<string> {
    // Search for relevant context
    const searchContext = await this.searchWeb(prompt);
    
    // Generate enhanced response with context
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiApiKey}`;
    
    const enhancedPrompt = `
    Konteks dari pencarian web:
    ${searchContext}
    
    Berdasarkan konteks di atas, jawab pertanyaan atau buatlah konten untuk: ${prompt}
    
    Pastikan jawaban akurat dan berdasarkan informasi terkini.
    `;
    
    const requestBody = {
      contents: [{
        parts: [{
          text: enhancedPrompt
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
      throw new Error(`RAG generation error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  async getWeatherInfo(location: string): Promise<string> {
    try {
      // Using OpenWeatherMap API (you'll need to add API key to env)
      const apiKey = process.env.OPENWEATHER_API_KEY;
      if (!apiKey) {
        return "API key cuaca tidak tersedia. Silakan atur OPENWEATHER_API_KEY.";
      }
      
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric&lang=id`;
      
      const response = await fetch(weatherUrl);
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return `
Cuaca di ${data.name}:
- Temperature: ${data.main.temp}°C (feels like ${data.main.feels_like}°C)
- Kondisi: ${data.weather[0].description}
- Kelembaban: ${data.main.humidity}%
- Tekanan: ${data.main.pressure} hPa
- Kecepatan angin: ${data.wind.speed} m/s
      `.trim();
    } catch (error) {
      console.error("Weather error:", error);
      return "Maaf, tidak dapat mengambil informasi cuaca saat ini.";
    }
  }
}
