import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import { Dropdown } from 'react-native-element-dropdown';
import { useState } from 'react';
import scrapeModel from './scrapeModel';
import {useRouter} from 'expo-router';
import Colors from "../../constant/Colors";

import Octicons from '@expo/vector-icons/Octicons';
import scrape from './scrape';
import { CarResultsContext } from '../../context/CarResults';
import { SearchCriteriaContext } from '../../context/SearchCriteriaContext';
import { useContext, useEffect } from 'react';
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/drizzle/migrations";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { cars } from "@/db/schema";
import { storedSearchCriteria } from "@/db/schema";
import * as schema from "@/db/schema";
import storage from '../../Storage/storage';
import { useSQLiteContext, openDatabaseSync } from 'expo-sqlite';



export default function SearchHeader() {
    const [currentPage, setCurrentPage] = useState(1);
    const [isMakeFocus, setIsMakeFocus] = useState(false);
    const [isModelFocus, setIsModelFocus] = useState(false);
    const [isDateFromFocus, setIsDateFromFocus] = useState(false);
    const [isDateToFocus, setIsDateToFocus] = useState(false);
    const [isFuelTypeFocus, setFuelTypeFocus] = useState(false);
    const {carResults, setCarResults} = useContext(CarResultsContext);
    const {savedSearchCriteria, setSearchCriteria} = useContext(SearchCriteriaContext);
    const [models, setModels] = useState([]);
    const router = useRouter();
    //const db = useSQLiteContext();
    const expoDBC = openDatabaseSync('cars');
    //const expoDBC = useSQLiteContext();
    const expoDb = openDatabaseSync('storedSearchCriteria');
    //const expoDb = useSQLiteContext();
    //const db = drizzle(expoDb);
    const drizzleDb = drizzle(expoDb, { schema });
    const drizzleDbCars = drizzle(expoDBC, {schema});
    useMigrations(drizzleDb, migrations);
    useMigrations(drizzleDbCars, migrations);
    //console.log('Migrations:', migrations);

    /*useEffect(() => {
      console.log("PAGE: ", savedSearchCriteria.make);
      if(carResults && savedSearchCriteria.page === 1){
        console.log("Updated carResults", carResults);
        addItemsToFirebase();
      }
    }, [carResults]);*/
    const fillModelsData = async (make) => {
      /*console.log("CALLED", make);
      try{
        const allModels = await fetch('http://192.168.1.2:3000/getModels', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ make: make })
          });
          const response = await allModels.json();
          console.log("ALL models: ", response);
          setModels(response);
      }catch(err){
        console.log(err);
      }*/
          //console.log("CALLED result", allModels);
        const result = await scrapeModel(make);
        console.log("CALLED result", result);
        setModels(result.data);
    }
    const [open, setOpen] = useState(false);
    const [selectedMake, setMake] = useState('');
    const [selectedYearFrom, setSelectedYearFrom] = useState();
    const [selectedYearTo, setSelectedYearTo] = useState('');
    const [selectedModel, setModel] = useState('');
    const [selectedFuelType, setSelectedFuelType] = useState('');
    const [value, setValue] = useState(null);
    const [fuelType, setFuelType] = useState([
        { label: 'Any', value: 'Any' },
        { label: 'Petrol', value: 'PETROL' },
        { label: 'Diesel', value: 'DIESEL' },
        { label: 'Electric', value: 'ELECTRICITY' },
        { label: 'Hybrid', value: 'HYBRID_DIESEL' },
        { label: 'LPG', value: 'LPG' },
        {label: 'Hybrid(petrol/electro)', value: 'HYBRID'}
    ]);
    const [yearsFrom, setYearsFrom] = useState(
        Array.from({ length: 2025 - 1960 + 1 }, (_, index) => {
          const year = 1960 + index;
          return { label: year.toString(), value: year.toString() };
        })
      );
      const [yearsTo, setYearsTo] = useState(
        Array.from({ length: 2025 - 1960 + 1 }, (_, index) => {
          const year = 1960 + index;
          return { label: year.toString(), value: year.toString() };
        })
      );
    const [items, setItems] = useState([
        { label: 'Any', value: 'Any' },
        { label: 'Abarth', value: '140' },
        { label: 'AC', value: '203' },
        { label: 'Acura', value: '375' },
        { label: 'Always', value: '31930' },
        { label: 'Aixam', value: '800' },
        { label: 'Alfa Romeo', value: '900' },
        { label: 'ALPIMA', value: '1100' },
        { label: 'Alpine', value: '5' },
        { label: 'Valvisc', value: '32315' },
        { label: 'Ariel', value: '31876' },
        { label: 'Artega', value: '121' },
        { label: 'Asia Motors', value: '1750' },
        { label: 'Aston Martin', value: '1700' },
        { label: 'Audi', value: '1900' },
        { label: 'Austin', value: '2000' },
        { label: 'Austin Healey', value: '1950' },
        { label: 'Auto Union', value: '32323' },
        { label: 'BAIC', value: '31863' },
        { label: 'Barkas', value: '2600' },
        { label: 'Bentley', value: '3100' },
        { label: 'Bizzarini', value: '32316' },
        { label: 'BMW', value: '3500' },
        { label: 'Borgward', value: '3850' },
        { label: 'Brilliance', value: '4025' },
        { label: 'Bugatti', value: '4350' },
        { label: 'Buick', value: '4400' },
        { label: 'BYD', value: '31953' },
        { label: 'Cadillac', value: '4700' },
        { label: 'Casalini', value: '112' },
        { label: 'Caterham', value: '5300' },
        { label: 'Centro', value: '31944' },
        { label: 'Chatenet', value: '83' },
        { label: 'Chevrolet', value: '5600' },
        { label: 'Chrysler', value: '5700' },
        { label: 'Citroën', value: '5900' },
        { label: 'Cobra', value: '6200' },
        { label: 'Corvette', value: '6325' },
        { label: 'Cupra', value: '3' },
        { label: 'Dacia', value: '6600' },
        { label: 'Daewoo', value: '6800' },
        { label: 'Daihatsu', value: '7000' },
        { label: 'Datsum', value: '30002' },
        { label: 'Delahaye', value: '32317' },
        { label: 'Delorean', value: '32324' },
        { label: 'DeTomaso', value: '7400' },
        { label: 'DFSK', value: '31864' },
        { label: 'Dodge', value: '7700' },
        { label: 'Donkervoort', value: '255' },
        { label: 'DS Automobiles', value: '235' },
        { label: 'e.GO', value: '31931' },
        { label: 'Elaris', value: '31932' },
        { label: 'Estrima', value: '32142' },
        { label: 'Facel Vega', value: '32318' },
        { label: 'Ferrari', value: '8600' },
        { label: 'Hat', value: '8800' },
        { label: 'Fisker', value: '172' },
        { label: 'Ford', value: '9000' },
        { label: 'GAC Gonow', value: '205' },
        { label: 'Gemballa', value: '204' },
        { label: 'Genesis', value: '270' },
        { label: 'GMC', value: '9900' },
        { label: 'Grecav', value: '122' },
        { label: 'GMM', value: '30006' },
        { label: 'Hamann', value: '186' },
        { label: 'Heinkel', value: '32141' }
    ]);

    let searchCriteria = {
        make: '',
        model: '',
        yearFrom: '',
        yearTo: '',
        fuelType: '',
        page: 1
    }
    const deleteAllCars = async () => {
      try {
        //const carsRef = collection(db, "cars");
        const snapshot = await drizzleDbCars.query.cars.findMany();
        
        if (snapshot.empty) {
          console.log("No documents found in 'cars' collection.");
          return;
        }
        
        await drizzleDbCars.delete(cars)
        // Use a batch for efficient deletion.
        /*const batch = writeBatch(db);
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });*/
        
        //await batch.commit();
        console.log("All documents in 'cars' deleted successfully.");
      } catch (error) {
        console.error("Error deleting documents: ", error);
      }
    };
    const savePage = async (data) => {
      try{
        console.log("SAVE PAGE: ", searchCriteria.page);
        await Promise.all(
          data.map(async (item) => {
            item.page = searchCriteria.page;
            item.isBookmarked = 0;
            console.log("ITEM: ", item)
            //const docRef = doc(db, "cars", item.id ? item.id.toString() : Math.random().toString());            
            console.log("SCHEMA: ", cars)
            const savedItem = await drizzleDbCars.insert(cars).values({
              description: item.description,
              name: item.name,
              otherData: item.otherData,
              page: item.page,
              price: item.price,
              image: item.image,
              //link: item.link,
              isBookmarked: item.isBookmarked
            }).returning();
            
            //await setDoc(docRef, item);
          })
        )
        console.log("Page items added to Firestore successfully");
    }catch(err){
      console.log(err);
    }
  }
    const addItemsToFirebase = async (result) => {
            try {
              
              // Assuming carResults is an array of items
              await Promise.all(
                /*carResults.forEach(async (car) => {
                  const docRef = doc(db, "cars", car.id ? car.id.toString() : Math.random().toString());
                  await setDoc(docRef, car);
                })*/
                result.map(async (item) => {
                  // Use an identifying key; change "item.id" as needed.
                  item.page = 1;
                  item.isBookmarked = 0;
                  //const docRef = doc(db, "cars", item.id ? item.id.toString() : Math.random().toString());
                  //await setDoc(docRef, item);
                  const newItem = await drizzleDbCars.insert(cars).values({
                    description: item.description,
                    name: item.name,
                    otherData: item.otherData,
                    page: item.page,
                    price: item.price,
                    image: item.image,
                    //link: item.link,
                    isBookmarked: item.isBookmarked
                  }).returning();
                  //console.log("New Item: ", newItem)
                })
              );
              setCurrentPage(2);
              console.log("All items added to Firestore successfully");
            } catch (error) {
              console.error("Error adding items to Firebase:", error);
            }
          };
    const saveCriteriaToDb = async (searchCriteria) => {
        try{
          await drizzleDb.delete(storedSearchCriteria)
          const savedSearch = await drizzleDb.insert(storedSearchCriteria).values(searchCriteria).returning();
          console.log("Saved search: ", savedSearch);
        }catch (error) {
          console.error("Error adding items to Firebase:", error);
        }
    }
    return (
        <View style={{ padding: 25, backgroundColor: '#f8f8ff', borderRadius: 10, margin: 10, elevation: 5 }}>
            <Text style={{
                fontFamily: 'outfit-bold',
                fontSize: 25,
            }}>Enter search criteria</Text>
            <View style={{ marginTop: 20, display: 'flex', marginBottom:10, flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                    <Text style={styles.headerText}>Make</Text>
                    <Dropdown
          style={[styles.dropdown, isMakeFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={items}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isMakeFocus ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          value={selectedMake}
          onFocus={() => setIsMakeFocus(true)}
          onBlur={() => setIsMakeFocus(false)}
          onChange={item => {
            console.log("ITEM", item);
            setMake(item.value);
            setIsMakeFocus(false);
            fillModelsData(item.value);
          }}
         
        />
                </View>
                <View>
                    <Text style={styles.headerText}>Model</Text>
                    <Dropdown
          style={[styles.dropdown, isModelFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={models}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isModelFocus ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          value={selectedModel}
          onFocus={() => setIsModelFocus(true)}
          onBlur={() => setIsModelFocus(false)}
          onChange={item => {
            setValue(item.value);
            setIsModelFocus(false);
            setModel(item.value);
          }}
         
        />
                </View>
            </View>
            <View style={{ marginTop: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>    
                <View>
                    <Text style={styles.headerText}>1st registration date</Text>
                    <Dropdown
          style={[styles.dropdown, isDateFromFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={yearsFrom}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isDateFromFocus ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          value={selectedYearFrom}
          onFocus={() => setIsDateFromFocus(true)}
          onBlur={() => setIsDateFromFocus(false)}
          onChange={item => {
            console.log("Item Value: ", item.value)
            setSelectedYearFrom(item.value);
            setIsDateFromFocus(false);
          }}
         
        />
                </View>
                <View>
                    <Text style={styles.headerText}></Text>
                    <Dropdown
          style={[styles.dropdown, isDateToFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={yearsTo}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isDateToFocus ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          value={selectedYearTo}
          onFocus={() => setIsDateToFocus(true)}
          onBlur={() => setIsDateToFocus(false)}
          onChange={item => {
            setSelectedYearTo(item.value);
            setIsDateToFocus(false);
          }}
         
        />
                </View>
           </View>
           <View style={{ marginTop: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>    
                <View>
                    <Text style={styles.headerText}>Fuel type</Text>
                    <Dropdown
          style={[styles.dropdown, isFuelTypeFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={fuelType}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFuelTypeFocus ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          value={selectedFuelType}
          onFocus={() => setFuelTypeFocus(true)}
          onBlur={() => setFuelTypeFocus(false)}
          onChange={item => {
            setSelectedFuelType(item.value);
            setFuelTypeFocus(false);
          }}
         
        />
                </View>
                <View>
                    
                </View>
                
           </View>
           <TouchableOpacity style={[styles.button, {display:'flex', flexDirection: 'row', marginTop: 20}]}
        onPress={() => {
            searchCriteria.make = selectedMake;
            searchCriteria.model = selectedModel;
            searchCriteria.yearFrom = selectedYearFrom;
            searchCriteria.yearTo = selectedYearTo;
            searchCriteria.fuelType = selectedFuelType;
            searchCriteria.page = 1;
            scrape(searchCriteria)
            .then(async (result) => {
                await deleteAllCars();
                await setCarResults(result);
                await addItemsToFirebase(result);
                await saveCriteriaToDb(searchCriteria);
                //console.log("RESULT", result);
                //console.log("CAR RESULTS", carResults);
                
                
                setSearchCriteria(searchCriteria);
                

                router.push('/(tabs)/home');
                searchCriteria.page++;
                setSearchCriteria(searchCriteria);
                
                let nextPage = true;
                while(nextPage){
                    
                    await scrape(searchCriteria)
                    .then(async (result) => {
                        console.log("Search result", result);
                        if(result.length > 0){
                        await savePage(result);
                        
                        searchCriteria.page++;
                        setSearchCriteria(searchCriteria)
                        
                        }else{
                            nextPage = false;
                        }
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    })
                  }
            })}}>
            <Octicons name="search" size={24} color="black" style={{marginTop:5}} />
          <Text style={[styles.buttonText,{color: 'black',marginLeft:110}]}>Search</Text>
        </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: Colors.PRIMARY,
        padding: 10,
        borderRadius: 15,
        marginTop: 20,
        borderColor: 'black',
        borderWidth: 1,
      },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    picker: {
        height: 50,
        width: '100%',
    },
    dropdown: {
        height: 50,
        marginTop: 5,
        
        width:150,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
    },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'outfit-bold'
  }
});