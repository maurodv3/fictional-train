import { GetServerSideProps } from 'next';
import withSecureAccess from '@middlewares/secured';
import UserService from '@services/UserService';
import ConceptService from '@services/ConceptService';
import Index from '../add';

export default function Edit({ tabs, edit_mode, concept }) {
  return Index({ tabs, edit_mode, concept });
}

export const getServerSideProps: GetServerSideProps = withSecureAccess(async (context) => {

  const conceptId = Number.parseInt(context.params.id, 10);
  const tabs = await UserService.getNavTabs(context);

  const concept = await ConceptService.getConcept(conceptId);

  return {
    props: {
      tabs,
      concept,
      edit_mode: true
    }
  };
}, null);
