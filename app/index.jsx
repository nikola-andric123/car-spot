import { Image, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../constant/Colors";
import {useRouter, useNavigation } from "expo-router";

import BackgroundService from 'react-native-background-actions';
import { useContext, useEffect, useState } from "react";

import { UserDetailContext } from "../context/UserDetailContext";

//import { UserDetailContext } from "../context/UserDetailContext";

/*function useNotificationObserver() {
useEffect(() => {
  // Request notification permissions
  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Please enable notifications to use this feature');
    }
  };

  requestPermissions();

  // Set up notification response listener
  const subscription = Notifications.addNotificationResponseReceivedListener(response => {
    // Navigate to home tab using Expo Router
    try {
      router.push('/(tabs)/home');
      console.log('Navigation attempted');
    } catch (error) {
      console.error('Navigation error:', error);
    }  // Adjust this path based on your actual route structure
  });

  return () => subscription.remove();
}, []);
}*/

export default function Index() {
  
 const [isMounted, setIsMounted] = useState(false);
 const router = useRouter();
 useEffect(() => {
     setIsMounted(true);
     
    }, []); 

    
  return (
    <View
      style={{
        flex: 1,
        
      }}
    >
      <Image source={require('./../assets/images/landing.png')}
      style = {
        {
          width: '90%',
          height: '40%',
          alignSelf: 'center', 
          backgroundColor: 'white',
          marginTop: '10%',
      }}></Image>
      <View style={{
        backgroundColor: 'white',
        
        padding: 20,
        borderRadius: 10,
        margin: 20,
        elevation: 5
      }}>
        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center'
        }}>Welcome to CarSpot</Text>
        <Text style={{
          fontSize: 16,
          textAlign: 'center',
          marginTop: 10
        }}>The best place to find your dream car</Text>
        <TouchableOpacity style={styles.button}
        onPress={() => router.push('/(tabs)/home')}>
          <Text style={[styles.buttonText,{color: 'black'}]}>Get Started</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, {backgroundColor: 'white', marginTop: 10,
          borderWidth: 1
        }]}
        onPress={() => router.push('/auth/signIn')}>
          <Text style={[styles.buttonText, {color: 'black'}]}>Already Have An Account?</Text>
        </TouchableOpacity>
        </View>
        
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 15,
    marginTop: 20
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16
  }
})
