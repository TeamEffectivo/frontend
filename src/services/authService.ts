import {
    signUp,
    signIn,
    signOut,
    fetchAuthSession,
    confirmSignUp,
    type SignUpOutput,
    type ConfirmSignUpInput,
    type ConfirmSignUpOutput,
    type SignInInput,
    type SignInOutput,
    type AuthSession
} from 'aws-amplify/auth';

export const authService = {
    // 1. Create Account
    register: async (email: string, password: string): Promise<SignUpOutput> => {
        return await signUp({
            username: email,
            password,
            options: {
                userAttributes: { email }
            }
        });
    },

    // 2. Confirm Account (Verification Code from Email)
    confirmRegistration: async (email: string, code: string): Promise<ConfirmSignUpOutput> => {
        const input: ConfirmSignUpInput = {
            username: email,
            confirmationCode: code
        };
        return await confirmSignUp(input);
    },

    // 3. Login
    login: async (email: string, password: string): Promise<SignInOutput> => {
        const input: SignInInput = {
            username: email,
            password
        };
        return await signIn(input);
    },

    // 4. Get Token (This automatically Refreshes if expired!)
    getToken: async (): Promise<string | undefined> => {
        const session: AuthSession = await fetchAuthSession();
        // idToken is the standard for identity verification in FastAPI
        console.log(session)
        return session.tokens?.idToken?.toString();
    },

    // 5. Logout
    logout: async (): Promise<void> => {
        await signOut();
    }
};