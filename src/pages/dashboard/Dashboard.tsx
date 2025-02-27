import CrudTable from 'components/crud/CrudTable';

const Dashboard = () => {
  return (
    <CrudTable
      title="Organizations"
      fetchUrl="https://https://maktoum.oummal.org/organization/all-organizations"
      createUrl="https://https://maktoum.oummal.org/admin/organization"
      updateUrl="https://https://maktoum.oummal.org/admin/organization"
      deleteUrl="https://https://maktoum.oummal.org/admin/organization"
    />
  );
};

export default Dashboard;
