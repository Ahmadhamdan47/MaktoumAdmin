import CrudTable from './CrudTable';

const Countries = () => {
  return (
    <CrudTable
      title="Countries"
      fetchUrl="https://maktoum.oummal.org/country/all-countries"
      createUrl="https://maktoum.oummal.org/country"
      updateUrl="https://maktoum.oummal.org/country"
      deleteUrl="https://maktoum.oummal.org/country"
    />
  );
};

export default Countries;