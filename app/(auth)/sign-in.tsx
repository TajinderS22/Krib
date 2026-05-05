import { useAuth, useSignIn } from '@clerk/expo';
import { Link, useRouter } from 'expo-router';
import { navigate } from 'expo-router/build/global-state/routing';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const SignIn = () => {

    const { signIn, errors, fetchStatus } = useSignIn()
    const router = useRouter()

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [displayedErrors, setDisplayedErrors] = useState<{
        identifier: { message: string } | null
        password: { message: string } | null
    }>({
        identifier: null,
        password: null,
    })

    const Loading = fetchStatus === "fetching"

    useEffect(() => {
        if (errors.fields.identifier || errors.fields.password) {
            setDisplayedErrors(errors.fields as any)
            const timer = setTimeout(() => {
                setDisplayedErrors({
                    identifier: null,
                    password: null,
                })
            }, 4000)
            return () => clearTimeout(timer)
        }
    }, [errors.fields.identifier, errors.fields.password])


    const onSigninPress = async () => {
        const { error } = await signIn.password({
            emailAddress: email,
            password
        })
        if (error) {
            console.log(error.toString())
            alert(error.message)
        }
        if (signIn.status === "complete") {
            await signIn.finalize({
                navigate: ({ session, decorateUrl }) => {
                    if (session?.currentTask) {
                        console.log(session?.currentTask)
                        return
                    }
                    const url = decorateUrl("/")
                    router.replace(url as any)
                }

            })
        }
    }


    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            className='bg-white'
        >
            <View className='flex-1  justify-center p-8'>
                <Image source={require("../../assets/images/kribb.png")}
                    className='w-32 h-16 mb-8'
                    resizeMode='contain'
                />

                <Text className='text-gray-800 text-3xl mb-2 font-bold'>
                    Login to your account
                </Text>
                <Text className='text-md text-gray-500'>
                    Find your dream home today
                </Text>



                <View className='flex mb-1 mt-4'>
                    <TextInput
                        className=' border my-1 flex-1 rounded-xl px-4 py-3 border-gray-300 '
                        placeholder='Email'
                        placeholderTextColor={"#909090"}
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text)
                        }}
                    />
                    {displayedErrors.identifier && (
                        <Text className='text-red-500 mb'>
                            {displayedErrors.identifier.message}
                        </Text>
                    )}
                </View>

                <View className='flex mb-1'>
                    <TextInput
                        className=' border my-1 flex-1 rounded-xl px-4 py-3 border-gray-300 '
                        placeholder='Password'
                        placeholderTextColor={"#909090"}
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text)
                        }}
                        secureTextEntry

                    />
                    {displayedErrors.password && (
                        <Text className='text-red-500 mb'>
                            {displayedErrors.password.message}
                        </Text>
                    )}
                </View>

                <TouchableOpacity
                    disabled={Loading}
                    onPress={onSigninPress}
                    className='bg-[#4c5e5c] rounded-xl p-2 mt-4 h-12 w-1/1 mx-auto justify-center items-center '
                >
                    {Loading ?
                        <ActivityIndicator />
                        :
                        <Text className='font-semibold text-gray-200'>
                            Sign in
                        </Text>
                    }
                </TouchableOpacity>


                <View className=' flex-row  gap-1 justify-center items-center mt-2 '>
                    <Text className='font-semibold text-gray-600'>
                        dont&apos;t have an account?
                    </Text>
                    <Link href={'./sign-up'}>
                        <Text className='text-[#4c5e5c] font-semibold'>
                            Sign up
                        </Text>
                    </Link>
                </View>

            </View>


        </ScrollView>
    );
}


export default SignIn;
