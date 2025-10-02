'use server';

import { db, auth } from "@/firebase/admin";
import { cookies } from "next/headers";


const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params : SignUpParams) {

    const { uid, name, email} = params;

    try {
        const userRecord = await db.collection('users').doc(uid).get();

        if(userRecord.exists){
            return {
                success : false,
                message : "User Already exists, Please Sign in Instead."
            }
        }

        await db.collection('users').doc(uid).set({
            name, email
        })

        return {
            success : true,
            message : "Account created successfully, Please Sign in."
        }

    } catch(e : any) {
        console.error('ERROR creating an user', e);

        if(e.code === 'auth/email-already-exists') {
            return {
                success : false,
                message : "This Email account already exists."
            }
        }

        return {
            success : false,
            message : "Failed to create an Account."
        }
    }

}

export async function signIn(params : SignInParams) {
    const {email, idToken} = params;

    try {
        const userRecord = await auth.getUserByEmail(email);

        if(!userRecord){
            return {
                success : false,
                message : "There is no User of this email. Create an Account."
            }
        }

        await setSessionCookie(idToken);
    } catch(e) {
        console.log(e);

        return {
            success : false,
            message : "Failed to Logged into account."
        }
    }
}

export async function setSessionCookie(idToken : string){
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn : ONE_WEEK * 1000,
    })

    cookieStore.set('session', sessionCookie, {
        maxAge : ONE_WEEK,
        httpOnly : true,
        secure : process.env.NODE_ENV === 'production',
        path : '/',
        sameSite : 'lax'
    })
}

export async function signOut() {
  const cookieStore = await cookies();

  cookieStore.delete("session");
}

// Get current user from session cookie
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    // get user info from db
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();
    if (!userRecord.exists) return null;

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.log(error);

    // Invalid or expired session
    return null;
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}
