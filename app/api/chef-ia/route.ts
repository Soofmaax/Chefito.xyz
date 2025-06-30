import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    success: true,
    answer: 'The AI assistant is disabled in this demo.'
  });
}
