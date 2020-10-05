import withSession from '../../lib/session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default withSession(async (request, response) => {

  const { username, password } : { username: string, password: string } = await request.body;

  const user = await prisma.users.findOne({
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
    response.status(401).json({ isLoggedIn: false });
    return;
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
    response.json(logged);
    return;
  }

  response.status(401).json({ isLoggedIn: false });

});
