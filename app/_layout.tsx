import { Slot,  } from "expo-router";
import "../global.css";
import {ClerkProvider} from "@clerk/expo"
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

  if (!publishableKey) {
    throw new Error('Add your Clerk Publishable Key to the .env file')
  }
  return (
    // <SafeAreaView>
      <ClerkProvider publishableKey={publishableKey}>
        <Slot />
      </ClerkProvider>

  );

}
