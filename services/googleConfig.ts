import { GoogleSignin } from '@react-native-google-signin/google-signin';

export function configureGoogleSignIn() {
  GoogleSignin.configure({
    webClientId: "239853294350-jjbhcgt0pha1m82353t134ej09sn1q8l.apps.googleusercontent.com",
    offlineAccess: true,
  });
}
