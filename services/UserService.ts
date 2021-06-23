import DatabaseConnection from '@database/DatabaseConnection';
import { PrismaClient } from '@prisma/client';
import { TabInfo } from '@model-ui/interfaces';

export class UserService {

  constructor(private database: PrismaClient) {}

  async getUserInfo(context) {

    const { req } = context;
    const loggedUser = req.session.get('user');

    const expandedUser = await this.database.users.findUnique({
      where: {
        user_id: loggedUser.id
      }
    });

    const entity = await this.database.financial_entities.findUnique({
      where: {
        entity_id: expandedUser.financial_entity_id
      },
      include: {
        entity_liable: true
      }
    });

    return [expandedUser, entity];
  }

  async getNavTabs(context) {

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

    return tabs;

  }

}

export default new UserService(DatabaseConnection.getConnection());
