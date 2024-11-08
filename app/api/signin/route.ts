import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../utils/db'; // Adjust path if needed
import bcrypt from 'bcryptjs';

interface SignInRequest {
    username: string;
    password: string;
}

interface User {
    username: string;
    email: string;
    password: string;
}

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const { username, password }: SignInRequest = await request.json();

        const db = await connectToDatabase();
        const usersCollection = db.collection('users');

        const user: User | null = await usersCollection.findOne({ username });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const isPasswordValid: boolean = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
        }

        //need to generate session token here??
        return NextResponse.json({ message: 'Sign-in successful', user: { username: user.username, email: user.email } }, { status: 200 });

    } catch (error: any) {
        console.error('Error in signin API:', error);
        return NextResponse.json({ message: 'An error occurred on the server', error: error.message }, { status: 500 });
    }
}
