# ByteMentor – AI Coding Tutor

A modern, AI-powered coding tutor built with vanilla JavaScript and the Groq API. Four specialized learning modes to match any skill level.

## 🚀 Quick Start

### 1. Clone & Setup
```bash
git clone https://github.com/dxvina28-web/bytementor.com.git
cd bytementor.com
```

### 2. Get Your Groq API Key
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up / log in
3. Navigate to **API Keys**
4. Create a new API key

### 3. Set Your API Key

**Option A: Development (Local Storage)**
Open DevTools (F12) and run:
```javascript
setGroqApiKey("gsk_your_key_here")
```

**Option B: Production (Environment Variable)**
Create a `.env` file:
```
GROQ_API_KEY=gsk_your_key_here
```

### 4. Run Locally
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Then visit: http://localhost:8000
```

## 📚 Features

### Four Learning Modes

- **Beginner Mode**: Step-by-step explanations with analogies
- **Intermediate Mode**: Best practices, code reviews, and hints
- **Exam Prep Mode**: Timed challenges and strict marking
- **Debug Mode**: Error analysis and code fixes

## 🛠 Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **AI API**: Groq (Mixtral 8x7B model)
- **Hosting**: Static files (GitHub Pages, Vercel, Netlify, etc.)

## 🔒 Security

⚠️ **IMPORTANT**: Never commit your API key to version control.

- `.env` files are in `.gitignore`
- API keys should be stored securely
- Consider using a backend proxy in production

## 📁 File Structure

```
bytementor.com/
├── index.html          # Landing page
├── chat.html           # Chat interface
├── chat.js             # Chat logic & AI integration
├── config.js           # Configuration & API setup
├── .env.example        # Template for environment variables
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## 🚀 Deployment

### GitHub Pages
1. Push to GitHub
2. Go to **Settings → Pages**
3. Set branch to `main` and save
4. Visit `https://your-username.github.io/bytementor.com`

### Vercel / Netlify
1. Connect your GitHub repo
2. Add environment variable: `GROQ_API_KEY`
3. Deploy!

## 🤝 Contributing

Found a bug? Want to improve ByteMentor?
1. Fork the repo
2. Create a feature branch
3. Submit a pull request

## 📝 License

MIT License – feel free to use and modify!

## 🎯 Roadmap

- [ ] User accounts & progress tracking
- [ ] More AI models (GPT-4o, Claude)
- [ ] Coding challenges library
- [ ] Streak counter & achievements
- [ ] 1-on-1 tutor bookings
- [ ] Mobile app

---

**Built with ❤️ by the ByteMentor team**
