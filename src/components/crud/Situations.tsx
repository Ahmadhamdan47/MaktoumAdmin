import CrudTable from './CrudTable';

const Situations = () => {
  return (
    <CrudTable
      title="Situations"
      fetchUrl="https://maktoum.oummal.org/admin/all-situations"
      createUrl="https://maktoum.oummal.org/admin/add-situation"
      updateUrl="https://maktoum.oummal.org/admin/situation"
      deleteUrl="https://maktoum.oummal.org/admin/situation"
    />
  );
};

export default Situations;