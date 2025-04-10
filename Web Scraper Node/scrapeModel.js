import puppeteer from "puppeteer";

export default async function scrapeModel(carMake) {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto('https://www.mobile.de/');
    
    const endpoint = `https://m.mobile.de/consumer/api/search/reference-data/models/${carMake}`;
    const response = await page.evaluate(async (url) => {
        console.log('Fetching data from endpoint:', url);
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        return response.json(); // Parse JSON automatically
      }, endpoint);
    const group = response.data.find(item => item.optgroupLabel);
    if(group!==undefined){
      response.data = response.data.filter(item => !item.optgroupLabel);
      group.items.forEach(model => {
        response.data.push(model);
      });
    }
    
    //console.log(response.data);
    browser.close();
    return response.data;
}
