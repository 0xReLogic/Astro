# Bot Telegram AI Generatif dengan Bun.js

![Bun.js](https://img.shields.io/badge/Bun.js-black?style=for-the-badge&logo=bun&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Telegram Bot](https://img.shields.io/badge/Telegram-Bot-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

Bot Telegram canggih yang menghasilkan konten kreatif menggunakan AI generatif, dibangun dengan Bun.js untuk performa optimal dan arsitektur modular.

## Features

### Core AI Features
- **Generasi Teks Kreatif**: Membuat cerita, puisi, atau teks kreatif lainnya
- **Kutipan Inspiratif**: Quote motivasi harian yang dibuat AI
- **Lelucon**: Humor yang bersih dan menghibur
- **Resep Masakan**: Resep Indonesia yang mudah dibuat
- **Asisten Menulis**: Bantuan untuk menulis artikel dan konten
- **Translation**: Terjemahan multi-bahasa dengan AI
- **Code Review**: Review kode programming dengan feedback konstruktif
- **Code Explanation**: Penjelasan detail cara kerja kode

### Advanced Multimodal Features
- **Voice Processing**: Transkripsi pesan suara dan respons AI
- **Image Analysis**: Analisis gambar dengan AI vision
- **Web Search Integration (RAG)**: Pencarian informasi real-time dari web
- **Weather Information**: Info cuaca terkini dari berbagai lokasi

### Technical Features
- **Menu Interaktif**: Inline keyboard untuk navigasi mudah
- **Rate Limiting**: Perlindungan dari spam
- **Error Handling**: Penanganan error yang robust
- **Session Management**: Context memory untuk percakapan
- **Request Logging**: Monitoring aktivitas bot
- **Analytics Dashboard**: Metrik penggunaan dan performa bot
- **Owner Commands**: Command khusus untuk admin

## Demo

### Screenshot Bot
Contoh interaksi dengan bot:
```
User: /start
Bot: [Menu interaktif dengan tombol-tombol fitur]

User: /teks cerita tentang kucing astronot
Bot: [Cerita kreatif AI tentang kucing astronot]

User: /resep
Bot: [Resep masakan Indonesia yang dihasilkan AI]
```

## Perintah Bot

### User Commands
- `/start` - Mulai menggunakan bot dengan menu interaktif
- `/help` - Menampilkan bantuan
- `/teks [prompt]` - Membuat teks kreatif
- `/quotes` - Kutipan inspiratif harian
- `/jokes` - Lelucon lucu
- `/resep` - Resep masakan random
- `/inspire` - Quote motivasi
- `/writer [topik]` - Asisten menulis
- `/translate [teks]` - Terjemahkan teks ke berbagai bahasa
- `/review [kode]` - Review kode programming
- `/explain [kode]` - Jelaskan cara kerja kode
- `/search [query]` - Cari informasi dari web dengan RAG
- `/weather [lokasi]` - Informasi cuaca real-time
- `/info` - Informasi bot
- `/stats` - Statistik penggunaan

### Multimodal Features
- **Voice Messages** - Kirim pesan suara untuk transkripsi dan respons AI
- **Image Analysis** - Kirim gambar untuk analisis dan deskripsi AI
- **Web Search Integration** - Bot bisa mencari informasi terkini dari web

### Owner Commands
- `/debug` - Informasi debug sistem
- `/analytics` - Dashboard analytics lengkap

## Quick Start

### Prerequisites
- Bun.js runtime
- Telegram Bot Token dari @BotFather
- Gemini API Key dari Google AI Studio

### Installation

1. **Clone repository**:
   ```bash
   git clone https://github.com/0xReLogic/telegram-ai-bot
   cd telegram-ai-bot
   ```

2. **Install dependencies**:
   ```bash
   bun install
   ```

3. **Setup environment variables** (lihat .env.example):
   ```bash
   cp .env.example .env
   # Edit .env dan isi dengan API keys Anda
   ```

4. **Jalankan bot**:
   ```bash
   bun run dev
   ```

## Environment Variables

```env
# Required: Get from @BotFather on Telegram
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# Required: Get from Google AI Studio
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Comma-separated list of owner user IDs
OWNER_IDS=123456789,987654321

# Optional: For webhook mode in production
WEBHOOK_URL=https://your-domain.com/webhook

# Optional: Set to "production" for webhook mode
NODE_ENV=development
```

## Deployment

### Replit Deployment (Recommended)
1. Fork repository ke Replit
2. Set environment variables di Replit Secrets
3. Deploy menggunakan Replit Deployments

### Alternative Options
- **Docker**: `docker build -t telegram-bot . && docker run telegram-bot`
- **Manual Server**: Upload files, install Bun.js, run `bun run dev`

## Architecture

```
src/
├── commands/          # Command handlers
├── middleware/        # Rate limiting, logging, error handling
├── services/         # External API integrations (Gemini)
└── utils/            # Utilities dan keyboards
```

### Key Features
- **Modular Architecture**: Kode yang terorganisir dan maintainable
- **TypeScript**: Type-safe development
- **Error Handling**: Comprehensive error management
- **Rate Limiting**: Protection against spam
- **Session Management**: User context memory
- **Logging**: Request monitoring dan debugging

## API Integration

Bot ini mendukung:
- **Gemini 1.5 Flash** (Google AI Studio) - Primary
- **OpenAI GPT** - Alternative
- **Hugging Face** - Future enhancement

## Performance

- **Runtime**: Bun.js untuk startup yang cepat
- **Memory**: Optimized untuk low memory usage
- **Scalability**: Modular design untuk easy scaling

## Development

### Code Quality
```bash
# Type checking
bunx tsc --noEmit

# Linting (if configured)
bunx eslint src/

# Testing (if configured)
bunx vitest
```

### Adding New Features
1. Create handler di `src/commands/`
2. Add middleware jika diperlukan
3. Update keyboard di `src/utils/keyboards.ts`
4. Register command di `index.ts`

## Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push branch: `git push origin feature-name`
5. Submit Pull Request

## Troubleshooting

### Common Issues
- **Bot tidak respond**: Check TELEGRAM_BOT_TOKEN
- **AI tidak generate**: Check GEMINI_API_KEY
- **Rate limit error**: Wait atau adjust rate limit settings
- **Memory issues**: Check memory usage dengan `/debug`

### Debug Mode
Owner bisa menggunakan `/debug` untuk melihat:
- Memory usage
- System information
- Error logs
- Performance metrics

## Roadmap

- [x] Setup basic bot structure
- [x] Implementasi Gemini API
- [x] Menu interaktif
- [x] Rate limiting dan error handling
- [x] Session management
- [x] Modular architecture
- [ ] Image generation dengan DALL-E
- [ ] Voice message support
- [ ] Advanced conversation memory
- [ ] Analytics dashboard
- [ ] Multi-language support

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

Jika ada pertanyaan atau issues:
1. Check [Issues](https://github.com/0xReLogic/telegram-ai-bot/issues)
2. Create new issue dengan template yang sesuai
3. Contact Developer:
   - Email: hi@0xrelogic.my.id
   - Telegram: @relogic
   - WhatsApp: +65 9095 7469

---

**Dibuat dengan ❤️ menggunakan Bun.js, grammY, dan Gemini AI**

### Stats
![GitHub stars](https://img.shields.io/github/stars/0xReLogic/telegram-ai-bot?style=social)
![GitHub forks](https://img.shields.io/github/forks/0xReLogic/telegram-ai-bot?style=social)
![GitHub issues](https://img.shields.io/github/issues/0xReLogic/telegram-ai-bot)