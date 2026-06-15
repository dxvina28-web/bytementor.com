setGroqApiKey("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");
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
