import { GetServerSideProps } from 'next';
import withSecureAccess from '../lib/secured';

export default function Book() {
  return <div>TEST</div>;
}

export const getServerSideProps: GetServerSideProps = withSecureAccess(async (context) => {
  return {
    props: { },
  };
}, null);
