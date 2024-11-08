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

        // Connect to MongoDB
        const db = await connectToDatabase();
        const usersCollection = db.collection('users');

        // Find user by username (or email, depending on your setup)
        const user: User | null = await usersCollection.findOne({ username });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Compare the provided password with the hashed password stored in the database
        const isPasswordValid: boolean = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
        }

        // Password is correct, generate a session or token here (JWT for example)
        // For simplicity, returning a success message here, but in a real app, you should set a cookie or JWT token
        return NextResponse.json({ message: 'Sign-in successful', user: { username: user.username, email: user.email } }, { status: 200 });

    } catch (error: any) {
        console.error('Error in signin API:', error);
        return NextResponse.json({ message: 'An error occurred on the server', error: error.message }, { status: 500 });
    }
}
