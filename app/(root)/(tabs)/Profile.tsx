import { useClerk } from '@clerk/expo';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
    const {signOut}=useClerk()
    const signOutPress=async()=>{
        await signOut({ redirectUrl:"/"})
    }
    return (
        <SafeAreaView>
            <View
                className='bg-red-200 min-h-20'
            >
                <TouchableOpacity 
                onPress={signOutPress}
                className='bg-cyan-300 p-4 rounded-xl'>
                    <Text> Signout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}


export default Profile;
