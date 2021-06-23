import withSession from '../../middlewares/session';

export default withSession(async (req, res) => {
  req.session.destroy();
  return res.json({ isLoggedIn: false });
});
