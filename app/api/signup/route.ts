import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../utils/db'; // Adjust path if needed
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { username, email, password } = await request.json();

        const db = await connectToDatabase();
        const usersCollection = db.collection('users'); 

        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await usersCollection.insertOne({
            username,
            email,
            password: hashedPassword,
        });

        return NextResponse.json({ message: 'User created successfully!' }, { status: 201 });
    } catch (error) {
        console.error('Error in signup API:', error);
        return NextResponse.json({ message: 'An error occurred on the server', error: (error as Error).message }, { status: 500 });
    }
}
