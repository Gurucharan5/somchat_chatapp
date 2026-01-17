import { makeRedirectUri } from "expo-auth-session";
import * as Google from 'expo-auth-session/providers/google';

import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { useEffect } from 'react';
import { auth } from './firebase';

export function useGoogleAuth() {
  const redirectUri = makeRedirectUri({
    scheme: "com.googleusercontent.apps.239853294350-30i3ovi78cgfji4guakvb8tsiocvc5f1",
    path: "oauthredirect",
  });
  console.log("➡️ redirectUri:", redirectUri);
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '239853294350-30i3ovi78cgfji4guakvb8tsiocvc5f1.apps.googleusercontent.com',
    webClientId: '239853294350-jjbhcgt0pha1m82353t134ej09sn1q8l.apps.googleusercontent.com',
    redirectUri: redirectUri,
    scopes: ["profile", "email"],
  });

  useEffect(() => {
    async function finishLogin() {
      if (response?.type === 'success') {
        const { authentication } = response;
        console.log("🔥 Auth response:", response);
        if (!authentication?.accessToken) return;

        const credential = GoogleAuthProvider.credential(
          authentication.idToken,
          authentication.accessToken
        );
        await signInWithCredential(auth, credential);
      }
    }
    finishLogin();
  }, [response]);

  return { request, promptAsync };
}
