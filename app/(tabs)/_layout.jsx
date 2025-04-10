import { Tabs, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import BackgroundService from 'react-native-background-actions';


   

export default function TabLayout(){
    const router = useRouter();
    
    return(
        <Tabs screenOptions={{
            headerShown: false,
        }}>
            <Tabs.Screen name="home" 
            options={{
                tabBarLabel: 'Home',
                tabBarIcon: ({color, size}) => (
                    <MaterialCommunityIcons name="home" color={color} size={size} />
    )}}/>
            <Tabs.Screen name="search"
            options={{
                tabBarLabel: 'Search',
                tabBarIcon: ({color, size}) => (
                    <MaterialCommunityIcons name="magnify" color={color} size={size} />
    )}}
            />
            <Tabs.Screen name="bookmarks"
            options={{
                tabBarLabel: 'Bookmarks',
                tabBarIcon: ({color, size}) => (
                    <Entypo name="bookmark" size={24} color={color} />
    )}}
            />
        </Tabs>
    )
}