import CrudTable from './CrudTable';

const Organizations = () => {
  return (
    <CrudTable
      title="Organizations"
      fetchUrl="https://https://maktoum.oummal.org/organization/all-organizations" // Updated URL
      createUrl="https://https://maktoum.oummal.org/admin/organization"
      updateUrl="https://https://maktoum.oummal.org/admin/organization"
      deleteUrl="https://https://maktoum.oummal.org/admin/organization"
    />
  );
};

export default Organizations;
