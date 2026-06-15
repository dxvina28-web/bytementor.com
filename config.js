const getGroqApiKey = () => {
  const localKey = localStorage.getItem('groq_api_key');
  if (localKey) return localKey;
  return '';
};

const GROQ_API_KEY = getGroqApiKey();

function setGroqApiKey(key) {
  localStorage.setItem('groq_api_key', key);
  location.reload();
}
setGroqApiKey("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");
