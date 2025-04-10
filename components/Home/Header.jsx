import React, {useContext} from 'react';
import { View, Text } from 'react-native';
import { UserDetailContext } from '../../context/UserDetailContext';

export default function Header(){
    const {userDetail, setUserDetail} = useContext(UserDetailContext);
    return (
        <View>
            <Text style={{fontFamily: 'outfit-bold',
            fontSize: 25,
            }}>Hello, {userDetail?.fullName}</Text>
            <Text style={{fontFamily: 'outfit-regular', fontSize: 15, color: 'gray'}}>
                Here are newest car listings matching your search criteria
            </Text>
        </View>
    );
}