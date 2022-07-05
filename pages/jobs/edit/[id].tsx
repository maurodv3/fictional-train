import { GetServerSideProps } from 'next';
import withSecureAccess from '@middlewares/secured';
import UserService from '@services/UserService';
import ConceptService from '@services/ConceptService';
import DepartmentService from '@services/DepartmentService';
import JobService from '@services/JobService';
import AddJob from '../add';

export default function Index({ tabs, departments, stored_concepts, edit_mode, job }) {
  return AddJob({ tabs, departments, stored_concepts, edit_mode, job });
}

export const getServerSideProps: GetServerSideProps = withSecureAccess(async (context) => {

  const jobId = Number.parseInt(context.params.id, 10);
  const jobFound = await JobService.getJob(jobId);

  const tabs = await UserService.getNavTabs(context);
  const concepts = await ConceptService.getConcepts();
  const departments = await DepartmentService.getDepartments();
  return {
    props: {
      tabs,
      departments,
      stored_concepts: concepts,
      edit_mode: true,
      job: jobFound
    }
  };
}, null);
