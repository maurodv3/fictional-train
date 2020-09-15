import withSession from '../../lib/session';

export default withSession(async (request, response) => {
  const { username } = await request.body;

  if (username === 'user_good') {
    const user = {
      id: 1,
      isLoggedIn: true,
      role: 'admin',
    };
    request.session.set('user', user);
    await request.session.save();
    response.json(user);
    return;
  }

  if (username === 'user_bad') {
    response.status(401)
      .json({ isLoggedIn: false });
    return;
  }

  response.status(500)
    .json({ message: 'Something un-expected happened' });

});
