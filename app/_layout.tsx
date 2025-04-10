import { Stack } from "expo-router";
import React, { Suspense } from "react";
import { useState, useEffect, useRef, useContext } from "react";
import { UserDetailContext } from "../context/UserDetailContext";
import { CarResultsContext } from "../context/CarResults";
import { SearchCriteriaContext } from "../context/SearchCriteriaContext";
import { BookmarkedResultsContext } from "../context/BookmarkedResultsContext";
import { ActivityIndicator } from "react-native";
import { SQLiteProvider, openDatabaseSync, useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/drizzle/migrations";
import * as Notifications from 'expo-notifications';
import { useRouter, useNavigationContainerRef } from 'expo-router';
import storage from '../Storage/storage';
import { navigationRef } from '../Utils/navigationRef';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import scrape from "../components/Search/scrape";
import { eq } from 'drizzle-orm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cars } from "@/db/schema"
import * as schema from "@/db/schema";
import { storedSearchCriteria } from "@/db/schema";

const db = openDatabaseSync('cars');
const drizzleDb = drizzle(db, { schema });
//import { router } from 'expo-router'
//const {success, error} = useMigrations(drizzleDb, migrations);
export const DATABASE_NAME = "cars";
const BACKGROUND_FETCH_TASK = 'background-fetch-task';
const expoDb = openDatabaseSync('storedSearchCriteria');
  const drizzleDbS = drizzle(expoDb, { schema });
  

const fetchNew = async () => {
  const existingSearchCriteria = await drizzleDbS.select().from(storedSearchCriteria).get();
  console.log("Existing Search Criteria: ", existingSearchCriteria);
  if (existingSearchCriteria) {
    existingSearchCriteria.page = 1; // Reset page to 1
    let nextPage = true;
    let addNotification = false;
    let removeNotification = false;
    let allCars = [];
    while (nextPage) {
    const newCars = await scrape(existingSearchCriteria);
    if(newCars.length > 0){
        allCars.push(...newCars);
        existingSearchCriteria.page++;   
    }else{
      nextPage = false;
    }
  }
    for (const car of allCars) {
      const existingCar = await drizzleDb.select().from(cars)
        .where(eq(cars.id, car.id))
        .get();
      if (!existingCar) {
        car.isBookmarked = 0;
        car.page = 1;
        await drizzleDb.insert(cars).values(car);
        addNotification = true;
      }
    }
    const existingCars = await drizzleDb.select().from(cars);
    for (const car of existingCars) {
      const newCar = allCars.find(c => c.id === car.id);
    
      if (!newCar) {
        //await drizzleDb.delete(cars).where(eq(cars.id, car.id));
        removeNotification = true;
      }
    }
    if (addNotification) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "New Cars Available",
          body: "New cars have been added to your search criteria.",
          sound: true,
        },
        trigger: null,
      });
    }
    if (removeNotification) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Cars Removed",
          body: "Some cars have been removed from your search criteria.",
          sound: true,
        },
        trigger: null,
      });
  } else {
    console.log("No existing search criteria found.");
  }
}}
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    console.log('Background fetch executed!');
    // Call your function here that you want to run every hour
    await fetchNew();
    //console.log("Backgound: " + JSON.stringify(savedSearchCriteria));
    // Return the result
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.log('Error during background fetch:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

const startBackgroundTask = async () => {
  // Register the task
  console.log('Registering background fetch task...');
  const status = await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 2 * 60, // Run every hour
    stopOnTerminate: false, // Continue task after app is closed
    startOnBoot: true, // Start task after device reboot
  });

  console.log('Background fetch registered with status:', status);
};

const notificationListener = useRef<Notifications.Subscription | null>(null);
const responseListener = useRef<Notifications.Subscription | null>(null);
const router = useRouter();
useEffect(() => {
  notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    console.log('Notification received:', notification);

  });

  responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {

    const interval = setInterval(() => {


      // Wait until routing is ready
      if (navigationRef?.getCurrentRoute?.()) {
        console.log('Navigation is ready. Navigating to home...');
        router.push('/(tabs)/home'); // ✅ Use this since you’re using expo-router
        clearInterval(interval);
      } else {
        console.log('Waiting for router to be ready...');
      }
    }, 100);
  });

  return () => {
    notificationListener.current?.remove();
    responseListener.current?.remove();
  };
}, []);
useEffect(() => {
  async function checkPermissions() {
    console.log('Checking notification permissions...');
    await startBackgroundTask();
  }
  checkPermissions();
}, []);
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
export default function RootLayout() {
  
  const [notificationClicked, setNotificationClicked] = useState(false);
  const [savedSearchCriteria, setSearchCriteria] = useState(
    {
      make: '',
      model: '',
      yearFrom: '',
      yearTo: '',
      fuelType: '',
      page: 1
    }
  );

  const ref = useNavigationContainerRef();


  const db = openDatabaseSync('cars');
  const drizzleDb = drizzle(db, { schema });
  useMigrations(drizzleDb, migrations);
  // Set isMounted to true after first render.
  useEffect(() => {
    navigationRef.navigate = ref.navigate;
    navigationRef.resetRoot = ref.resetRoot;
    navigationRef.getCurrentRoute = ref.getCurrentRoute;
    navigationRef.isReady = ref.isReady;
  }, [ref]);





  //const expoDb = openDatabaseSync(DATABASE_NAME);
  //const db = drizzle(expoDb);
  //const { success, error } = useMigrations(db, migrations);
  const [userDetail, setUserDetail] = useState();
  //const [notificationClicked, setNotificationClicked] = useState(false);
  const [carResults, setCarResults] = useState([]);
  const [bookmarkedCars, setBookmarkedCars] = useState([]);




  return (

    <UserDetailContext.Provider value={{ userDetail, setUserDetail, notificationClicked, setNotificationClicked }}>
      <CarResultsContext.Provider value={{ carResults, setCarResults, bookmarkedCars, setBookmarkedCars }}>
        <SearchCriteriaContext.Provider value={{ savedSearchCriteria, setSearchCriteria }}>

          <Suspense fallback={<ActivityIndicator size={"large"} />}>
            <SQLiteProvider databaseName={DATABASE_NAME}
              options={{ enableChangeListener: true }}
              useSuspense>

              <Stack screenOptions={{
                headerShown: false
              }}>

              </Stack>

            </SQLiteProvider>
          </Suspense>

        </SearchCriteriaContext.Provider>
      </CarResultsContext.Provider>
    </UserDetailContext.Provider>

  )
}
