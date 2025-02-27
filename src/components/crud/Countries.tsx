import CrudTable from './CrudTable';

const Countries = () => {
  return (
    <CrudTable
      title="Countries"
      fetchUrl="https://https://maktoum.oummal.org/country/all-countries"
      createUrl="https://https://maktoum.oummal.org/country"
      updateUrl="https://https://maktoum.oummal.org/country"
      deleteUrl="https://https://maktoum.oummal.org/country"
    />
  );
};

export default Countries;