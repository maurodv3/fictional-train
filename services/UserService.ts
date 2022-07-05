import DatabaseConnection from '@database/DatabaseConnection';
import { PrismaClient } from '@prisma/client';
import { TabInfo } from '@model-ui/interfaces';

const UserService = (database: PrismaClient) => {

  const getUserInfo = async (context) => {

    const { req } = context;
    const loggedUser = req.session.get('user');

    const expandedUser = await database.users.findUnique({
      where: {
        user_id: loggedUser.id
      }
    });

    const entity = await database.financial_entities.findUnique({
      where: {
        entity_id: expandedUser.financial_entity_id
      },
      include: {
        entity_liable: true
      }
    });

    return [expandedUser, entity];
  };

  const getNavTabs = async (context) => {

    const { req, resolvedUrl } = context;
    const user = req.session.get('user');

    // Default tabs.
    const tabs : TabInfo[] = [];
    tabs.push({ name: 'tab_actions', href: '/', active: resolvedUrl === '/' });
    tabs.push({ name: 'tab_entries', href: '/book_entry', active: resolvedUrl === '/book_entry' });
    tabs.push({ name: 'tab_books', href: '/book', active: resolvedUrl === '/book' });

    if (user.actions.includes('MANAGE_ACCOUNTS')) {
      tabs.push({ name: 'tab_accounts', href: '/account', active: resolvedUrl === '/account' });
    }

    // Add permissions.
    tabs.push({ name: 'tab_employee', href: '/employee', active: resolvedUrl === '/employee' });
    // Add permissions.
    tabs.push({ name: 'tab_jobs', href: '/jobs', active: resolvedUrl === '/jobs' });
    // Add permissions
    tabs.push({ name: 'tab_concepts', href: '/concept', active: resolvedUrl === '/concept' });
    // Add permissions
    tabs.push({ name: 'tab_liqui', href: '/liquidacion', active: resolvedUrl === '/liquidacion' });

    return tabs;

  };

  const getExpandedUser = async (req) => {
    const loggedUser = req.session.get('user');
    return await database.users.findUnique({
      where: {
        user_id: loggedUser.id
      }
    });
  };

  return {
    getUserInfo,
    getNavTabs,
    getExpandedUser
  };

};

export default UserService(DatabaseConnection.getConnection());
