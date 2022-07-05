import withSession from '../../middlewares/session';
import UserService from '@services/UserService';
import FinancialPeriodService from '@services/FinancialPeriodService';
import EntryService, { AddEntry } from '@services/EntryService';

export default withSession(async (request, response) => {
  const entry : AddEntry = request.body;
  const user = await UserService.getExpandedUser(request);
  const currentPeriod = await FinancialPeriodService.getCurrentPeriod(user);
  const result = await EntryService.addEntry(entry, user, currentPeriod);
  if (result.errors) {
    return response
      .status(400)
      .json(result);
  }
  return response
    .json(result);
});
