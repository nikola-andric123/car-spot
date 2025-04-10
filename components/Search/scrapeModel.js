import axios from 'axios';

export default async function scrapeModel(makeId) {
  const url = `https://m.mobile.de/consumer/api/search/reference-data/models/${makeId}`;

  try {
    const response = await axios.get(url, {
      headers: {
        // Mimic a real browser
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.mobile.de/', // Critical for some APIs
      },
    });
    //console.log("Result:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}