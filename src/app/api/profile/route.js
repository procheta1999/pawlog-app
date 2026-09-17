import {
  getProfileController,
  updateProfileController,
} from '../../../server/controller/petProfileController';
import { responseHandler } from '../responseHandler';

export async function GET() {
  return responseHandler(await getProfileController());
}

export async function PUT(request) {
  return responseHandler(await updateProfileController(request));
}
