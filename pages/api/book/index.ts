import withSession from '../../../lib/session';
import { NextApiRequest, NextApiResponse } from 'next';
import { getDailyBook, getMasterBook } from '../../../handlers/book/bookService';
import { endOfDay, startOfDay } from 'date-fns';

export default withSession(async (request: NextApiRequest, response: NextApiResponse) => {

  const {
    query : { from, to }
  } = request;

  if (typeof from !== 'string' || typeof to !== 'string') {
    return response.status(400).json({ msg: 'Invalid payload' });
  }

  const fromDate = startOfDay(new Date(Date.parse(from)));
  const toDate = endOfDay(new Date(Date.parse(to)));

  const dailyBook = await getDailyBook(fromDate, toDate);
  const masterBook = await getMasterBook(fromDate, toDate);

  return response.json({
    masterBook,
    dailyBook: dailyBook.map((entry) => {
      entry['date'] = entry.creation_date.toLocaleString();
      delete entry.creation_date;
      return entry;
    })
  });

});
