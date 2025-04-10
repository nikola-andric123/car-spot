import React from 'react';
import { Image, SafeAreaView } from 'react-native';
import { View, Text, StyleSheet, Platform, FlatList, TouchableOpacity } from 'react-native';

import { CarResultsContext } from '../../context/CarResults';
import { BookmarkedResultsContext } from '../../context/BookmarkedResultsContext';
import { useContext, useEffect, useState } from 'react';
import { useFonts } from 'expo-font';

import { drizzle } from "drizzle-orm/expo-sqlite";
import { cars } from "@/db/schema"
import * as schema from "@/db/schema";
import { openDatabaseSync } from 'expo-sqlite';
import { eq } from 'drizzle-orm';

import FontAwesome from '@expo/vector-icons/FontAwesome';



export default function BookmarkHeader() {
    const {bookmarkedCars, setBookmarkedCars, carResults, setCarResults} = useContext(CarResultsContext);
    const db = openDatabaseSync('cars');
    const drizzleDb = drizzle(db, {schema});

    useEffect( () => {
         getSaved();
},[])
async function getSaved() {
    
            console.log("CALLED")
        let cur = 2;
        
       
        let toAdd = []
        
            try{
                async function findBooks() {
                    let res = await drizzleDb.select().from(cars)
                    .where(eq(cars.page,cur));
                    console.log("Current: ", cur)
                    return res;
                }            
                
                        while(true){
                            let querySnapshot = await findBooks();
                            console.log("Query res: ",querySnapshot)
                            if(querySnapshot.length > 0){
                                querySnapshot.forEach(car => {
                                    console.log("INSIDE: ", car)
                                    if(car.isBookmarked === 1)
                                        toAdd.push(car)
                                    });
                                
                                cur++;
                            }else{
                                setBookmarkedCars(toAdd);
                                return;
                            }
                        }
                            }catch(err){
                                console.log(err)
                            }
                        
                        
                                
}
    const [fontsLoaded] = useFonts({
            'Kanit-Black': require('../../assets/fonts/Kanit-Black.ttf'),
            'Roboto-Regular': require('../../assets/fonts/Roboto_Condensed-Regular.ttf'),
            'Roboto-Medium': require('../../assets/fonts/Roboto_Condensed-Medium.ttf'),
        });
        //const {carResults, setCarResults} = useContext(CarResultsContext);
    return(
        <SafeAreaView style={{height: '100%'}}>
        <View>
            <View style={{alignItems: 'center'}}>
                <Text style={{fontSize: 25, fontFamily: 'Roboto-Medium', marginTop: 10}}>Your Bookmarked Listings</Text>
            </View>
            <View style={{
            padding: 25,
            paddingTop: Platform.OS == 'ios' && 45
        }}>
            <FlatList
            //data={carResults.filter(car => car.isBookmarked === 1)}
            data={bookmarkedCars}
            //style={{width: '100%', height: '100%'}}
            contentContainerStyle={{ paddingBottom: 100, width: '100%' }}
                //ListHeaderComponent={<Header />}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                <View style={{flexDirection: 'row',width:'100%', marginTop: 10, backgroundColor: 'white',borderRadius: 15, justifyContent: 'space-between', alignItems: 'center'}}>
                   <View style={{flexDirection: 'column'}}>
                        <Image source={{uri: item.image}} style={{width: 150, height: 150, margin:10}}/>
                        <View pointerEvents="box-only">
                        <TouchableOpacity style={[{width: '40%', marginLeft: 15,
                            borderWidth: 1, borderColor: 'gray', alignItems: 'center', borderRadius: 2,
                            flexDirection: 'row', marginBottom:10
                        },
                        { width:'50%', borderColor: 'navy' },]} onPress={ async (e) => {
                            e.stopPropagation();
                            //item.isBookmarked = 1;
                            await drizzleDb.update(cars)
                            .set({ isBookmarked: 0 })
                            .where(eq(cars.id, item.id));
                            setBookmarkedCars(prev => prev.filter(car => car.id !== item.id));
                            setCarResults(prevResults =>
                                prevResults.map(car =>
                                  car.id === item.id ? { ...car, isBookmarked: 0 } : car
                                )
                              );
                        }
                            
                        }>
                            <Text style={{margin:5, color: 'navy'}}>Unpark</Text>
                            <FontAwesome name="bookmark" size={20} color="navy" style={{
                                    marginTop:5, marginLeft:10, paddingBottom:5
                                }}/>
                        </TouchableOpacity>
                        </View>
                   </View>
                   <View style={{width: '90%', flexWrap: 'wrap'}}>
                   <Text style={{width: '50%', fontSize:18,marginLeft:15,marginBottom:15, flexWrap: 'wrap', fontFamily: 'Roboto-Medium'}}>{item.description}</Text>
                   <Text style={{width: '50%', flexWrap: 'wrap',fontSize:20, fontFamily: 'Kanit-Black'}}>{item.price}</Text>
                   
                   <Text style={{width: '50%', flexWrap: 'wrap', fontFamily: '', marginTop: 15}}>{item.otherData}</Text>
                    </View>
               </View>
                )}
                ListFooterComponent={
                    <View></View>
                }
            />
        </View>
        </View>
        </SafeAreaView>
    )
}