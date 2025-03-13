import CrudTable from './CrudTable';

const Organizations = () => {
  return (
    <CrudTable
      title="Organizations"
      fetchUrl="https://maktoum.oummal.org/organization/all-organizations" // Updated URL
      createUrl="https://maktoum.oummal.org/admin/organization"
      updateUrl="https://maktoum.oummal.org/admin/organization"
      deleteUrl="https://maktoum.oummal.org/admin/organization"
    />
  );
};

export default Organizations;
