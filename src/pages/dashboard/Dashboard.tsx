import CrudTable from 'components/crud/CrudTable';

const Dashboard = () => {
  return (
    <CrudTable
      title="Organizations"
      fetchUrl="https://maktoum.oummal.org/organization/all-organizations"
      createUrl="https://maktoum.oummal.org/admin/organization"
      updateUrl="https://maktoum.oummal.org/admin/organization"
      deleteUrl="https://maktoum.oummal.org/admin/organization"
    />
  );
};

export default Dashboard;
