const DEFAULT_KEY = "gsk_YOUR_NEW_KEY_HERE";

const getGroqApiKey = () => {
  const localKey = localStorage.getItem('groq_api_key');
  if (localKey) return localKey;

  localStorage.setItem('groq_api_key', DEFAULT_KEY);
  return DEFAULT_KEY;
};

const GROQ_API_KEY = getGroqApiKey();
