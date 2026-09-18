import { getCareEventStatusCountsController } from '../../../../server/controller/petCareEventsScheduleController';
import { responseHandler } from '../../responseHandler';

export async function GET() {
  return responseHandler(await getCareEventStatusCountsController());
}
