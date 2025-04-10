import puppeteer from "puppeteer";

class Car {
    constructor({ name, description, image, otherData, price }) {
      //this.link = link
      this.name = name;
      this.description = description;
      this.image = image;
      this.otherData = otherData;
      this.price = price;
    }
}
export default async function(searchCriteria) {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    const maxPages = 2;
    let currentPage = searchCriteria.page;
    let make = 11000; //Honda
    let model = 5; //CR-V
    let yearFrom = 2015;
    let yearTo = 2020;
    let fuelType = "PETROL";
    const url = `https://suchen.mobile.de/fahrzeuge/search.html?dam=false&fr=${searchCriteria.yearFrom}%3A${searchCriteria.yearTo}&ft=${searchCriteria.fuelType}&isSearchRequest=true&ms=${searchCriteria.make}%3B${searchCriteria.model}%3B%3B&pageNumber=${searchCriteria.page}&ref=srpNextPage&refId=c6950dbf-0d5d-d44f-91ed-0185f045f56a&s=Car&sb=rel&vc=Car`;
    //const url = 'https://suchen.mobile.de/fahrzeuge/search.html?dam=false&fr=2000%3A2024&ft=PETROL&isSearchRequest=true&ms=140%3B2%3B%3B&pageNumber=2&ref=srpNextPage&refId=c6950dbf-0d5d-d44f-91ed-0185f045f56a&s=Car&sb=rel&vc=Car';
    console.log("URL: ", url);
    const allCars = []
    while(currentPage<=maxPages){
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.waitForSelector('.root > .WCpNG > main > .NGBg0 > .leHcX > article > section > div > .mN_WC > a', {
        timeout: 10000 // optional, waits up to 10 seconds
        });
    
    const carElements = await page.$$('.root > .WCpNG > main > .NGBg0 > .leHcX > article > section > div > .mN_WC > a');
    
    for(const carElement of carElements){
        const link = await page.evaluate((el) => el.href, carElement);
        console.log("ID: ", link);
        const name = await page.evaluate(el => el.querySelector('.K0qQI > .urhVn > h2 > .LBG5d')?.textContent, carElement);
        const description = await page.evaluate(el => el.querySelector('.K0qQI > .urhVn > h2 > .Z_aNr')?.textContent, carElement);
        const otherData = await page.evaluate(el => el.querySelector('.K0qQI > .lAeeF > .HaBLt > div')?.textContent, carElement);
        const price = await page.evaluate(el => el.querySelector('.K0qQI > .Pn6b3 > .QWkBK > div > span')?.textContent, carElement);
        const image = await page.evaluate((el) => {
            
            const primaryImg = el.querySelector('.fEytW > .JqVPP > div > img');
           
            if(primaryImg){
                return primaryImg.src;
            }
            const fallbackImg = el.querySelector('.fEytW > .mZg1N > img');

            if(fallbackImg){
                return fallbackImg.src;
            }
    }, carElement);
        
    allCars.push(new Car({name,description,image,otherData,price}));
        
    }
    const carElementsAd = await page.$$('.root > .WCpNG > main > .NGBg0 > .leHcX > article > section > div > .mN_WC > a');
    for(const carElementAd of carElementsAd){
        const link = await page.evaluate((el) => el.href, carElementAd);
        const name = await page.evaluate(el => el.querySelector('.K0qQI > .urhVn > h2 > .LBG5d')?.textContent, carElementAd);
        const description = await page.evaluate(el => el.querySelector('.K0qQI > .urhVn > h2 > .Z_aNr')?.textContent, carElementAd);
        const otherData = await page.evaluate(el => el.querySelector('.K0qQI > .lAeeF > .HaBLt > div')?.textContent, carElementAd);
        const price = await page.evaluate(el => el.querySelector('.K0qQI > .Pn6b3 > .QWkBK > div > span')?.textContent, carElementAd);
        const image = await page.evaluate((el) => {
            
            const primaryImg = el.querySelector('.fEytW > .JqVPP > div > img');
           
            if(primaryImg){
                return primaryImg.src;
            }
            const fallbackImg = el.querySelector('.fEytW > .mZg1N > img');

            if(fallbackImg){
                return fallbackImg.src;
            }
    }, carElementAd);
    allCars.push(new Car({name,description,image,otherData,price}));
        
    }
    
    const carElementsNoAd = await page.$$('.root > .WCpNG > main > .NGBg0 > .leHcX > div > article > section > div > .mN_WC > a');
    for(const carElementNoAd of carElementsNoAd){
        const link = await page.evaluate((el) => el.href, carElementNoAd);
        const name = await page.evaluate(el => el.querySelector('.K0qQI > .urhVn > h2 > .LBG5d')?.textContent, carElementNoAd)
        const description = await page.evaluate(el => el.querySelector('.K0qQI > .urhVn > h2 > .Z_aNr')?.textContent, carElementNoAd)
        
        const price = await page.evaluate(el => el.querySelector('.K0qQI > .Pn6b3 > .QWkBK > div > .kryI9')?.textContent, carElementNoAd)
        const otherData = await page.evaluate(el => el.querySelector('.K0qQI > .lAeeF > .HaBLt > div')?.textContent, carElementNoAd)
        const image = await page.evaluate((element) => {
            // Try primary selector first
            const primaryImg = element.querySelector('.fEytW > .mZg1N > img');
            if (primaryImg) return primaryImg.src;
          
            // Fallback to secondary selector
            const fallbackImg = element.querySelector('.fEytW > div > img'); 
            if (fallbackImg) return fallbackImg.src;
          
            // Final fallback or null
            return element.querySelector('img')?.src || null;
          }, carElementNoAd);
        allCars.push(new Car({name,description,image,otherData, price}));
        
    }
    currentPage++;
}
    console.log(`allCars: ${allCars}`)
    await browser.close();
    return allCars;
};

