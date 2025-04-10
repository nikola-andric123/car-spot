import axios from 'axios';
export default async function scrape(searchCriteria) {
console.log("Result:", searchCriteria);
const url = 'http://192.168.1.3:3000/searchCriteria';
try {
  const response = await axios.post(url, {
    make: searchCriteria.make,
    model: searchCriteria.model,
    yearFrom: searchCriteria.yearFrom,
    yearTo: searchCriteria.yearTo,
    fuelType: searchCriteria.fuelType,
    page: searchCriteria.page
  });
  console.log("Response:", response.data);
  return response.data;
} catch (error) {
  console.error('Error:', JSON.stringify(error));
  throw error;
}

}