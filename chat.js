const SYSTEM_PROMPTS = {
  beginner: `You are ByteMentor, a friendly and patient AI coding tutor for absolute beginners. Your personality is warm, encouraging, and structured.

Rules:
- NEVER just give the answer. Always guide the user step-by-step like a real teacher.
- On the very first message, ask what programming language they want to learn and their experience level, then offer a personalised learning plan.
- After they choose, generate a clear 5-10 step learning roadmap and ask if they want to start.
- Each lesson should include: a simple explanation, an example, and a small task for the user to try.
- When the user submits code, check it carefully: highlight exactly where errors are, explain WHY it's wrong, show the corrected version, and give improvement tips.
- Use encouraging language. Celebrate small wins. Never make the user feel bad for mistakes.
- Keep explanations simple — explain like the user is 10 years old.`,

  intermediate: `You are ByteMentor, an AI coding tutor for intermediate developers. You give hints rather than full answers.

Rules:
- Guide users to discover solutions themselves through targeted questions and hints.
- When reviewing code, explain mistakes and suggest improvements without just rewriting everything.
- Introduce best practices, patterns, and cleaner approaches.
- Push the user to think deeper: "Why do you think this works?" or "What happens if the input is empty?"
- Generate coding challenges that stretch their current abilities.`,

  exam: `You are ByteMentor in Exam Preparation mode. You behave like a strict but fair examiner and marker.

Rules:
- Set timed coding challenges at GCSE, A-level, or University difficulty.
- Mark answers harshly and precisely — point out every error and inefficiency.
- Provide a score and detailed feedback on what was correct and what was wrong.
- Ask follow-up questions to test deeper understanding.
- Do not help or give hints during the exam phase — only after marking.`,

  debug: `You are ByteMentor in Debug mode. You are a specialist at finding and explaining code errors.

Rules:
- When the user pastes code, immediately identify ALL bugs and errors.
- Highlight exactly which line(s) are wrong and explain why.
- Show the corrected version of the code.
- Explain what caused each bug so the user understands and doesn't repeat it.
- Give tips on how to avoid similar bugs in future.
- Also suggest any code improvements or optimisations beyond just fixing bugs.`
};

const SUGGESTIONS = [
  "Explain variables in Python",
  "Debug my JavaScript code",
  "Teach me about arrays",
  "Review my React component"
];

let currentMode = 'beginner';
let messages = [];
let isLoading = false;

function initChat() {
  showEmpty();
  setupEventListeners();
}

function setupEventListeners() {
  const input = document.getElementById('inputBox');
  const sendBtn = document.getElementById('sendBtn');
  input.addEventListener('input', (e) => {
    sendBtn.disabled = e.target.value.trim() === '';
  });
}

function showEmpty() {
  const inner = document.getElementById('messagesInner');
  inner.innerHTML = `
    <div class="empty">
      <div class="empty-icon">💭</div>
      <h2>What would you like to learn?</h2>
      <p>I'm ByteMentor, your AI coding tutor. Pick a mode and start coding.</p>
      <div class="suggestions">
        ${SUGGESTIONS.map(s => `<button class="sug-btn" onclick="sendSuggestion('${s}')">${s}</button>`).join('')}
      </div>
    </div>
  `;
}

function sendSuggestion(text) {
  document.getElementById('inputBox').value = text;
  sendMessage();
}

function autoResize(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
}

function handleKey(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}

async function sendMessage() {
  if (!GROQ_API_KEY) {
    alert('Please set your Groq API key first. Use: setGroqApiKey("your-key-here")');
    return;
  }

  const input = document.getElementById('inputBox');
  const text = input.value.trim();
  if (!text || isLoading) return;
  
  input.value = '';
  document.getElementById('sendBtn').disabled = true;
  
  addMessage('user', text);
  showTyping();
  isLoading = true;

  try {
    const response = await callGroqAPI(text);
    removeTyping();
    addMessage('assistant', response);
  } catch (error) {
    removeTyping();
    addMessage('assistant', `Error: ${error.message}`);
  } finally {
    isLoading = false;
    document.getElementById('sendBtn').disabled = true;
  }
}

async function callGroqAPI(userMessage) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'mixtral-8x7b-32768',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPTS[currentMode]
        },
        ...messages.map(m => ({
          role: m.role,
          content: m.text
        })),
        {
          role: 'user',
          content: userMessage
        }
      ],
      temperature: 0.7,
      max_tokens: 1024,
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'API Error');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

function addMessage(role, text) {
  messages.push({ role, text });
  
  const inner = document.getElementById('messagesInner');
  if (inner.querySelector('.empty')) {
    inner.innerHTML = '';
  }
  
  const row = document.createElement('div');
  row.className = `msg-row ${role}`;
  
  const bubble = document.createElement('div');
  bubble.className = `bubble ${role}`;
  
  if (text.includes('```')) {
    const parts = text.split('```');
    bubble.innerHTML = parts.map((part, i) => {
      if (i % 2 === 0) {
        return `<p>${part}</p>`;
      } else {
        const lines = part.trim().split('\n');
        const lang = lines[0] || 'code';
        const code = lines.slice(1).join('\n');
        return `<div class="code-block"><div class="code-label">${lang}</div><pre><code>${escapeHtml(code)}</code></pre></div>`;
      }
    }).join('');
  } else {
    bubble.textContent = text;
  }
  
  row.appendChild(bubble);
  inner.appendChild(row);
  document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
}

function showTyping() {
  const inner = document.getElementById('messagesInner');
  const row = document.createElement('div');
  row.className = 'msg-row assistant';
  row.id = 'typing-indicator';
  
  const typing = document.createElement('div');
  typing.className = 'typing';
  typing.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  
  row.appendChild(typing);
  inner.appendChild(row);
  document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById('typing-indicator');
  if (typing) typing.remove();
}

function setMode(btn) {
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentMode = btn.dataset.mode;
  
  const modeNames = {
    beginner: 'Beginner Mode',
    intermediate: 'Intermediate Mode',
    exam: 'Exam Prep Mode',
    debug: 'Debug Mode'
  };
  
  document.getElementById('modePillLabel').textContent = modeNames[currentMode];
  closeSidebar();
}

function newChat() {
  messages = [];
  document.getElementById('messagesInner').innerHTML = '';
  showEmpty();
  closeSidebar();
}

function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('overlay').classList.add('show');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

window.addEventListener('load', initChat);