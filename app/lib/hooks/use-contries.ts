import countries from "world-countries";

export type CountryOption = {
  value: string;
  label: string;
  flag: string;
  region: string;
  latitude: number;
  longitude: number;
};

const formattedCountries: CountryOption[] = countries.map((country) => ({
  value: country.cca2,
  label: country.name.common,
  flag: country.flag,
  region: country.region,
  latitude: country.latlng[0],
  longitude: country.latlng[1],
}));

export function useCountries() {
  const getAll = () => formattedCountries;

  const getByValue = (value: string) =>
    formattedCountries.find((item) => item.value === value);

  return { getAll, getByValue };
}
