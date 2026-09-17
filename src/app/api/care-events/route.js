import {
  deleteCareEventController,
  getCareEventsController,
  updateCareEventController,
} from '../../../server/controller/petCareEventsScheduleController';
import { responseHandler } from '../responseHandler';

export async function GET() {
  return responseHandler(await getCareEventsController());
}

export async function PUT(request) {
  return responseHandler(await updateCareEventController(request));
}

export async function DELETE(request) {
  return responseHandler(
    await deleteCareEventController(request.nextUrl.searchParams.get('id')),
  );
}
