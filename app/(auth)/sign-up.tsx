import { useAuth, useSignUp } from '@clerk/expo';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const SignUp = () => {

    const { signUp, errors, fetchStatus } = useSignUp()

    const { isSignedIn } = useAuth()



    const router = useRouter();
    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [code, setCode] = useState<string>("")

    const [ResendClicked, setResendClicked] = useState(false)
    const [displayedErrors, setDisplayedErrors] = React.useState<{
        emailAddress: { message: string } | null
        password: { message: string } | null
    }>({
        emailAddress: null,
        password: null,
    })

    React.useEffect(() => {
        if (errors.fields.emailAddress || errors.fields.password) {
            setDisplayedErrors(errors.fields as any)
            const timer = setTimeout(() => {
                setDisplayedErrors({
                    emailAddress: null,
                    password: null,
                })
            }, 4000)
            return () => clearTimeout(timer)
        }
    }, [errors.fields.emailAddress, errors.fields.password])

    if (signUp.status === "complete" || isSignedIn) {
        return null
    }

    const onVerifyPress = async () => {
        await signUp.verifications.verifyEmailCode({ code });
        if (signUp.status === "complete") {
            await signUp.finalize({
                navigate: ({ decorateUrl }) => {
                    const url = decorateUrl("/")
                    router.replace(url as any)
                }
            })
        }
    }

    const Loading = fetchStatus === "fetching"


    const onSignupPress = async () => {
        const { error } = await signUp.password({
            emailAddress: email,
            password,
            firstName,
            lastName
        })
        if (error) {
            alert(error.message)
            return
        }
        if (!error) {
            await signUp.verifications.sendEmailCode();
        }
    }


    if (
        signUp.status === "missing_requirements" &&
        signUp.unverifiedFields.includes("email_address") &&
        signUp.missingFields.length === 0
    ) {
        return (
            <View className='p-8 flex-1 items-center justify-center '>
                <Image source={require("../../assets/images/kribb.png")}
                    className='w-32 h-16 mb-8'
                    resizeMode='contain'
                />

                <Text className='text-gray-800 text-3xl mb-2 font-bold'>
                    Verify your account
                </Text>
                <Text className='text-md text-gray-500'>
                    We sent a code to {email}
                </Text>

                <View className='flex-row gap-3 mt-2 mb-1'>
                    <TextInput
                        className=' border my-1 flex-1 rounded-xl px-4 py-3 border-gray-300 '
                        placeholder='Verification code'
                        placeholderTextColor={"#909090"}
                        value={code}
                        keyboardType='numeric'
                        onChangeText={(text) => {
                            setCode(text)
                        }}
                    />

                </View>

                <TouchableOpacity
                    disabled={Loading}
                    onPress={onVerifyPress}
                    className='bg-[#4c5e5c] rounded-xl p-2 mt-4 h-12 w-1/1 mx-auto justify-center items-center '
                >
                    {Loading ?
                        <ActivityIndicator />
                        :
                        <Text className='font-semibold text-gray-200'>
                            Verify
                        </Text>
                    }
                </TouchableOpacity>

                <View className='w-full flex-row  justify-end '>
                    <TouchableOpacity
                        disabled={Loading}
                        onPress={async () => {
                            setResendClicked(true)
                            setTimeout(() => {
                                setResendClicked(false)
                            }, 3000)
                            await signUp.verifications.sendEmailCode()
                        }}
                        className='bg-blue-700 rounded-xl w-4/12 p-2 mt-6 h-12  mr-1                        justify-center  items-center '
                    >
                        {ResendClicked ?
                            <ActivityIndicator />
                            :
                            <Text className='font-semibold text-gray-200'>
                                Resend
                            </Text>
                        }
                    </TouchableOpacity>
                </View>

            </View>
        )
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
                    Create account
                </Text>
                <Text className='text-md text-gray-500'>
                    Find your dream home today
                </Text>

                <View className='flex-row gap-3 mt-2 mb-1'>
                    <TextInput
                        className=' border my-1 flex-1 rounded-xl px-4 py-3 border-gray-300 '
                        placeholder='First Name'
                        placeholderTextColor={"#909090"}
                        value={firstName}
                        onChangeText={(text) => {
                            setFirstName(text)
                        }}
                        autoCapitalize='words'
                    />
                    <TextInput
                        className=' border my-1 flex-1  rounded-xl px-4 py-3 border-gray-300 '
                        placeholder='Last Name'
                        placeholderTextColor={"#909090"}
                        value={lastName}
                        onChangeText={(text) => {
                            setLastName(text)
                        }}
                        autoCapitalize='words'
                    />

                </View>

                <View className='flex mb-1'>
                    <TextInput
                        className=' border my-1 flex-1 rounded-xl px-4 py-3 border-gray-300 '
                        placeholder='Email'
                        placeholderTextColor={"#909090"}
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text)
                        }}
                    />
                    {displayedErrors.emailAddress && (
                        <Text className='text-red-500 mb'>
                            {displayedErrors.emailAddress.message}
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
                    onPress={onSignupPress}
                    className='bg-[#4c5e5c] rounded-xl p-2 mt-4 h-12 w-1/1 mx-auto justify-center items-center '
                >
                    {Loading ?
                        <ActivityIndicator />
                        :
                        <Text className='font-semibold text-gray-200'>
                            Sign up
                        </Text>
                    }
                </TouchableOpacity>


                <View className=' flex-row  gap-1 justify-center items-center mt-2 '>
                    <Text className='font-semibold text-gray-600'>
                        Already have an account?
                    </Text>
                    <Link href={'./sign-in'}>
                        <Text className='text-[#4c5e5c] font-semibold'>
                            Sign in
                        </Text>
                    </Link>
                </View>

            </View>


        </ScrollView>
    );
}


export default SignUp;
