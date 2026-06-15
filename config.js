const DEFAULT_KEY = "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";

const getGroqApiKey = () => {
  const localKey = localStorage.getItem('groq_api_key');
  if (localKey) return localKey;

  localStorage.setItem('groq_api_key', DEFAULT_KEY);
  return DEFAULT_KEY;
};

const GROQ_API_KEY = getGroqApiKey();
