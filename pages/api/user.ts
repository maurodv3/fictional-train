import withSession from '../../middlewares/session';

export default withSession(async (req, res) => {

  const user = req.session.get('user');

  if (user) { // User is logged
    return res.json({
      isLoggedIn: true,
      ...user,
    });
  }

  return res.json({
    isLoggedIn: false,
  });
  
});
