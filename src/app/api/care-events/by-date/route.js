import { getCareEventsByDateController } from '../../../../server/controller/petCareEventsScheduleController';
import { responseHandler } from '../../responseHandler';

export async function GET(request) {
  return responseHandler(
    await getCareEventsByDateController(request.nextUrl.searchParams.get('date')),
  );
}
