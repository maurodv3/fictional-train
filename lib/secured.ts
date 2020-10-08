import withSession from './session';

export default function withSecureAccess(handler, clearance) {
  return withSession(async (context) => {
    const { req, res } = context;
    const user = req.session.get('user');

    if (user === undefined) {
      console.log('User trying to access secured location, redirecting to /login.');
      res.setHeader('location', '/login');
      res.statusCode = 302;
      res.end();
      return { props: {} };
    }

    if (clearance) {
      if (user.actions.includes(clearance)) {
        return handler(context);
      }
    } else {
      return handler(context);
    }

    res.setHeader('location', '/404');
    res.statusCode = 302;
    res.end();
    return { props: {} };

  });
}
