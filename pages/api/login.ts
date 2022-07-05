import withSession from '../../middlewares/session';
import prisma from '../../prisma/prisma';

export default withSession(async (request, response) => {

  const { username, password }: { username: string, password: string } = await request.body;

  const user = await prisma.users.findUnique({
    where: { username },
    include: {
      roles: {
        include: {
          roles_actions: {
            include: {
              actions: true
            }
          }
        }
      }
    }
  });

  if (user === undefined || user === null) {
    return response.status(401).json({ isLoggedIn: false });
  }

  if (user.password_hash === password) {
    const logged = {
      id: user.user_id,
      username: user.username,
      isLoggedIn: true,
      role: await user.roles.name,
      actions: await user.roles.roles_actions.flatMap(({ actions }) => actions.name)
    };
    request.session.set('user', logged);
    await request.session.save();
    return response.json(logged);
  }

  return response.status(401).json({ isLoggedIn: false });

});
