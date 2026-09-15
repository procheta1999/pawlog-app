import { NextResponse } from 'next/server';
import {
  getProfileController,
  updateProfileController,
} from '../../../server/controller/petProfileController';

export async function GET() {
  const result = await getProfileController();

  if (result.error) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  return NextResponse.json(result.data, { status: result.status });
}

export async function PUT(request) {
  const result = await updateProfileController(request);

  if (result.error) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  return NextResponse.json(result.data, { status: result.status });
}
