import CrudTable from './CrudTable';

const Situations = () => {
  return (
    <CrudTable
      title="Situations"
      fetchUrl="https://https://maktoum.oummal.org/admin/all-situations"
      createUrl="https://https://maktoum.oummal.org/admin/add-situation"
      updateUrl="https://https://maktoum.oummal.org/admin/situation"
      deleteUrl="https://https://maktoum.oummal.org/admin/situation"
    />
  );
};

export default Situations;