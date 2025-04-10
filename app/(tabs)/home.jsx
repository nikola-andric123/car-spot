import React from 'react';
import { Image } from 'react-native';
import { View, Text, StyleSheet, Platform, FlatList, TouchableOpacity, Animated } from 'react-native';
import Header from '../../components/Home/Header';
import { CarResultsContext } from '../../context/CarResults';
//import { BookmarkedResultsContext } from '../../context/BookmarkedResultsContext';
import { useContext, useEffect, useState, useRef } from 'react';
import { useFonts } from 'expo-font';
import migrations from "@/drizzle/migrations";

import { SearchCriteriaContext } from '../../context/SearchCriteriaContext';
import { drizzle } from "drizzle-orm/expo-sqlite";
import { cars } from "@/db/schema"
import * as schema from "@/db/schema";
import { openDatabaseSync, useSQLiteContext } from 'expo-sqlite';
import { eq } from 'drizzle-orm';
import * as Notifications from 'expo-notifications';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  
export default function Home() {

 

  

    const { carResults, setCarResults, bookmarkedCars, setBookmarkedCars } = useContext(CarResultsContext);
    //const {bookmarkedCars, setBookmarkedCars} = useContext(BookmarkedResultsContext);
    const [loadingAll, setLoadingAll] = useState(false);
    const [pagesLoaded, setPagesLoaded] = useState(1);
    //let pagesLoaded = 1
    const { savedSearchCriteria, setSearchCriteria } = useContext(SearchCriteriaContext);
    //const db = useSQLiteContext();
    const db = openDatabaseSync('cars');
    const drizzleDb = drizzle(db, { schema });
    useMigrations(drizzleDb, migrations)
    useEffect(() => {
        
        const load = async () => {
            const data = await drizzleDb.select().from(cars)
                .where(eq(cars.page, 1));

            await setCarResults([...data]);
            console.log("LOADED: ", carResults)
        }

        load();
    }, []);
    const scheduleNotification = async () => {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '🚗 New Car Added!',
            body: 'Check out the latest listing in CarSpot.',
            sound: true,
            data: { someData: 'car_123' }, // optional payload
          },
          trigger: {
            seconds: 5, // fire after 5 seconds
          },
        });
      };
      const handleScheduleLocalNotification = async (title, body) => {
        Notifications.scheduleNotificationAsync({
            content: {
              title: 'Look at that notification',
              body: "I'm so proud of myself!",
              data: { // ← This is where the URL lives
                url: 'https://docs.expo.dev/versions/latest/sdk/notifications/' // Your app's route
              }
            },
            trigger: null,
          });
        };
    const [fontsLoaded] = useFonts({
        'Kanit-Black': require('../../assets/fonts/Kanit-Black.ttf'),
        'Roboto-Regular': require('../../assets/fonts/Roboto_Condensed-Regular.ttf'),
        'Roboto-Medium': require('../../assets/fonts/Roboto_Condensed-Medium.ttf'),
    });
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const timeoutMap = useRef(new Map());
    const progressAnim = useRef(new Animated.Value(0)).current;

const startProgress = () => {
   
  // Reset animation value
  progressAnim.setValue(0);
  // Animate from 0 to 1 over 5000ms (5 sec)
  Animated.timing(progressAnim, {
    toValue: 1,
    duration: 5000,
    useNativeDriver: false, // width animation cannot use native driver
  }).start();
};


    return (
        <View style={{
            padding: 25,
            paddingTop: Platform.OS == 'ios' && 45
        }}>
            
            <FlatList
                data={carResults}
                style={{ width: '100%' }}
                ListHeaderComponent={<Header />}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    item.isActive ? (
                        
                        <View style={{ position: 'relative', width: '100%', height: 250, alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity style={{height: 250, width: '100%', alignItems: 'center',
                            borderColor: 'black', borderRadius: 15, alignSelf:'center', backgroundColor: 'white'
                        }}
                        onPress={async () => {
                            clearTimeout(timeoutMap.current.get(item.id));
                            setCarResults(prevResults =>
                                prevResults.map(car =>
                                  car.id === item.id ? { ...car, isActive: false } : car
                                )
                              );
                        }}>
                            <Animated.View
                                style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                height: 250,
                                backgroundColor: 'red',
                                opacity: 0.1,
                                width: progressAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0%', '100%'],
                                }),
                                zIndex: 0, // lower zIndex
                                }}
                            />
                            <Text style={{fontSize: 50, marginTop: 75}}>Undo</Text>
                            
                        
                            
                        </TouchableOpacity>
                        </View>
                    ): (

                    
                    <View style={{ flexDirection: 'row', width: '100%', marginTop: 10, backgroundColor: 'white', borderRadius: 15, justifyContent: 'flex-start', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'column' }}>
                            <Image source={{ uri: item.image }} style={{
                                width: 150, height: 150, marginTop: 10,
                                marginLeft: 10, marginBottom: 10
                            }} />
                            <View style={{width: 170}}>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', }}>
                                <TouchableOpacity style={[{
                                    width: '37%', marginLeft: 15,
                                    borderWidth: 2, borderColor: 'navy', alignItems: 'center', borderRadius: 2,
                                    flexDirection: 'row', marginBottom: 10,marginRight:30
                                },
                                item.isBookmarked === 1 && { width: '50%', borderColor: 'gray',
                                    marginRight:10
                                 },
                                ]}
                                    disabled={item.isBookmarked === 1}
                                    onPress={async () => {
                                        //item.isBookmarked = 1;
                                        console.log("Updated Car: ")
                                        const updated = await drizzleDb.update(cars)
                                            .set({ isBookmarked: 1 })
                                            .where(eq(cars.id, item.id)).returning({ updatedId: cars.id });
                                        setBookmarkedCars(prevResults => [...prevResults, item]);
                                        setCarResults(prevResults =>
                                            prevResults.map(car =>
                                                car.id === item.id ? { ...car, isBookmarked: 1 } : car
                                            )
                                        );
                                        scheduleNotification();

                                    }

                                    }>
                                    {(item.isBookmarked === 1) ?
                                        (
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ marginLeft: 5, marginTop: 3, color: 'gray' }}>Parked</Text>
                                                <FontAwesome name="bookmark" size={20} color="gray" style={{
                                                    marginTop: 5, marginLeft: 5, paddingBottom: 5
                                                }} />
                                            </View>
                                        ) : (
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ marginLeft: 5, marginTop: 3, color: 'navy' }}>Park</Text>
                                                <FontAwesome name="bookmark-o" size={20} color="navy" style={{
                                                    marginTop: 5, marginLeft: 8, paddingBottom: 5
                                                }} />
                                            </View>
                                        )}


                                </TouchableOpacity>
                                <TouchableOpacity style={{
                                    borderWidth: 2, borderColor: 'black',
                                    alignItems: 'center',alignContent:'center', marginBottom: 10, marginLeft: 10, borderRadius: 2
                                }}
                                onPress={async () => {
                                    console.log("Delete: ")
                                   
                                    item.isActive = true;
                                    //setCarResults(prevResults => prevResults.filter(car => car.id !== item.id));
                                    setCarResults(prevResults =>
                                        prevResults.map(car =>
                                          car.id === item.id ? { ...car, isActive: true } : car
                                        )
                                      );
                                     // const timeoutRef = useRef(null);
                                    startProgress();
                                    const timeoutId = setTimeout(async () => {

                                    setCarResults(prevResults =>
                                        prevResults.map(car =>
                                          car.id === item.id ? { ...car, isActive: false } : car
                                        )
                                      );
                                      const del = await drizzleDb.delete(cars).where(eq(cars.id, item.id)).returning();
                                      console.log("Deleted: ", del);
                                      setCarResults(prevResults => prevResults.filter(car => car.id !== item.id));
                                      setBookmarkedCars(prevRes => prevRes.filter(car => car.id !== item.id));
                                      timeoutMap.current.delete(item.id);
                                    }, 5000);
                                    timeoutMap.current.set(item.id, timeoutId);
                                     }}
                                >
                                    <FontAwesome name="remove" size={30} color="red" style={{marginTop:0}} />
                                </TouchableOpacity>
                            </View>
                            </View>
                        </View>
                        <View style={{ width: '90%', flexWrap: 'wrap' }}>
                            <Text style={{ width: '50%', fontSize: 18, marginLeft: 0, marginBottom: 15, flexWrap: 'wrap', fontFamily: 'Roboto-Medium' }}>{item.description}</Text>
                            <Text style={{ width: '50%', flexWrap: 'wrap', fontSize: 20, fontFamily: 'Kanit-Black' }}>{item.price}</Text>

                            <Text style={{ width: '50%', flexWrap: 'wrap', fontFamily: '', marginTop: 15 }}>{item.otherData}</Text>
                        </View>
                    </View>
                )
                )}
                ListFooterComponent={
                    <View style={styles.paginationContainer}>
                        <TouchableOpacity
                            onPress={async () => {
                                try {
                                    async function increase(num) {
                                        setPagesLoaded(num)
                                    }
                                    let cur = pagesLoaded + 1;
                                    await increase(cur);
                                    console.log("Load More, ", pagesLoaded);

                                    //const q = query(collection(db, "cars"), where("page", "==", pagesLoaded));

                                    console.log("Current Page: ", cur);
                                    const querySnapshot = await drizzleDb.select().from(cars)
                                        .where(eq(cars.page, cur));
                                    console.log("Query results: ", querySnapshot)
                                    if (querySnapshot.length > 0) {

                                        setCarResults(prevResults => [...prevResults, ...querySnapshot]);
                                    }
                                } catch (err) {
                                    console.log(err)
                                }

                                //console.log(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                                //setCarResults([...carResults, ...querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))]);

                            }}>
                            <Text style={styles.pageIndicator}>Load More</Text>

                        </TouchableOpacity>
                    </View>
                }
            />
        </View>
    );
};
const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 10,
        backgroundColor: 'white',
        borderRadius: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    image: {
        width: 150,
        height: 150,
        margin: 10,
    },
    textContainer: {
        width: '90%',
        flexWrap: 'wrap',
    },
    description: {
        width: '50%',
        fontSize: 18,
        marginLeft: 15,
        marginBottom: 15,
        flexWrap: 'wrap',
        fontFamily: 'Roboto-Medium',
    },
    price: {
        width: '50%',
        flexWrap: 'wrap',
        fontSize: 20,
        fontFamily: 'Kanit-Black',
    },
    otherData: {
        width: '50%',
        flexWrap: 'wrap',
        marginTop: 15,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
    },
    loadingText: {
        fontSize: 16,
        color: '#333',
    },
    pageIndicator: {
        fontSize: 16,
        color: '#333',
    },
});