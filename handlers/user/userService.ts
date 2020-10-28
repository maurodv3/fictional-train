import prisma from '../../prisma/prisma';
import { TabInfo } from '../../components/Navbar';

export async function getUserInfo(context) {
  const { req } = context;
  const loggedUser = req.session.get('user');
  const expandedUser = await prisma.users.findOne({
    where: {
      user_id: loggedUser.id
    }
  });
  const entity = await prisma.financial_entities.findOne({
    where: {
      entity_id: expandedUser.financial_entity_id
    },
    include: {
      entity_liable: true
    }
  });
  return [expandedUser, entity];
}

export async function getNavTabs(context) {
  const { req, resolvedUrl } = context;
  const user = req.session.get('user');

  // Default tabs.
  const tabs : TabInfo[] = [
    { name: 'tab_actions', href: '/', active: resolvedUrl === '/' },
    { name: 'tab_entries', href: '/book_entry', active: resolvedUrl === '/book_entry' },
    { name: 'tab_books', href: '/book', active: resolvedUrl === '/book' },
  ];

  if (user.actions.includes('MANAGE_ACCOUNTS')) {
    tabs.push({ name: 'tab_accounts', href: '/account', active: resolvedUrl === '/account' });
  }

  return tabs;

}
