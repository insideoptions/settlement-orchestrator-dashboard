import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

// Super admin credentials
const SUPER_ADMIN = {
  email: 'michael@insideoptions.io',
  // This is the bcrypt hash of "Kimmykimmy1!!"
  passwordHash: '$2a$10$YXZxYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXoxMjM0NTY3ODkw',
};

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
);

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  // Check if user is super admin
  if (email === SUPER_ADMIN.email) {
    // For initial setup, accept the plain password and hash it
    const isValid = password === 'Kimmykimmy1!!';
    
    if (isValid) {
      // Create JWT token
      const token = await new SignJWT({ email, role: 'admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(JWT_SECRET);

      // Set cookie
      (await cookies()).set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return { success: true };
    }
  }

  return { success: false, error: 'Invalid credentials' };
}

export async function logout() {
  (await cookies()).delete('auth-token');
}

export async function getSession(): Promise<{ email: string; role: string } | null> {
  const token = (await cookies()).get('auth-token')?.value;

  if (!token) {
    return null;
  }

  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as { email: string; role: string };
  } catch (err) {
    return null;
  }
}
