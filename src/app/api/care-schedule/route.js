import {
  deleteCareScheduleController,
  getCareScheduleController,
  updateCareScheduleController,
} from '../../../server/controller/petCareScheduleController';
import { responseHandler } from '../responseHandler';

export async function GET() {
  return responseHandler(await getCareScheduleController());
}

export async function PUT(request) {
  return responseHandler(await updateCareScheduleController(request));
}

export async function DELETE(request) {
  const eventId = request.nextUrl.searchParams.get('id');
  return responseHandler(await deleteCareScheduleController(eventId));
}
