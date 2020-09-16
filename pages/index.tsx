import withSession from '../lib/session';
import Navbar from '../components/Navbar';
import Table from '../components/Table';

export default function Home() {
  return (
    <div>
      <Navbar/>
      <div className="rounded-t-lg overflow-hidden border-t border-l border-r border-gray-400 px-3 py-10 flex justify-center ">
        <div className="w-full max-w-xs">
          <Table
            headers={['Greet', 'Name']}
            values={[
              { greet: 'Hola', name: 'pablo', age: 24 },
              { greet: 'Hi', name: 'Mike', age: 26 },
              { greet: 'Hallo', name: 'Gretchen', age: 29 },
              { greet: 'Bonasera', name: 'Julio', age: 19 },
              { greet: 'Alo', name: 'Julieta', age: 24 },
            ]}
            selectedFields={['greet', 'name']}
          />
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = withSession(async ({ req, res }) => {
  const user = req.session.get('user');

  if (user === undefined) {
    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  return {
    props: { user: req.session.get('user') },
  };
});
