import { NextResponse } from 'next/server';

export function responseHandler(result) {
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result.data, { status: result.status });
}
