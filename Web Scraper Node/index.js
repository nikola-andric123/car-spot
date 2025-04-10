import express from 'express';
const app = express();
const port = 3000;
import path from 'path';
import scrape from './scrape.js';
import scrapeModel from './scrapeModel.js';
app.use(express.json());

app.post('/searchCriteria', async (req, res) => {
    const carInfo = req.body;
    console.log("Recived: ", carInfo);
    const allCars = await scrape(carInfo);
    res.send(allCars);
});

app.post('/getModels', async (req, res) => {
    const carInfo = req.body;
    console.log("Recived: ", carInfo);
    const allModels = await scrapeModel(carInfo.make);
    res.send(allModels);
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});