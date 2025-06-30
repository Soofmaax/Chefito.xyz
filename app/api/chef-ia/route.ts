import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    answer: 'The AI assistant is disabled in this demo.'
  });
}
