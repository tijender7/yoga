import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { API_BASE_URL } from '@/config';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, healthConditions } = body;

    // Create user with Supabase auth
    const { data: authUser, error: signUpError } = await supabase.auth.signUp({
      email,
      password: Math.random().toString(36).slice(-8),
      options: {
        data: {
          name,
          phone,
          healthConditions
        }
      }
    });

    if (signUpError) throw signUpError;

    // Call backend API to create user
    const backendResponse = await fetch(`${API_BASE_URL}/api/create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        healthConditions,
        userId: authUser.user?.id
      })
    });

    if (!backendResponse.ok) {
      throw new Error('Failed to create user in backend');
    }

    return NextResponse.json({ 
      success: true,
      message: 'User created successfully'
    });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}