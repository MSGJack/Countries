export type FlagsType = {
  svg: string;
  png: string;
};

export type CurrencyType = {
  code: string;
  name: string;
  symbol: string;
};

export type LanguageType = {
  iso639_1?: string;
  iso639_2?: string;
  name: string;
  nativeName?: string;
};

export type TranslationsType = {
  br: string;
  pt: string;
  nl: string;
  hr: string;
  fa?: string;
  de: string;
  es: string;
  fr: string;
  ja: string;
  it: string;
  hu: string;
};

export type RegionalBlockType = {
  acronym: string;
  name: string;
  otherAcronyms?: string[];
  otherNames?: string[];
};

export type CountryType = {
  name: string;
  topLevelDomain: string[];
  alpha2Code: string;
  alpha3Code: string;
  callingCodes: string[];
  capital?: string;
  altSpellings?: string[];
  subregion: string;
  region: string;
  population: number;
  latlng?: number[];
  demonym: string;
  area?: number;
  gini?: number;
  timezones: string[];
  borders?: string[];
  nativeName: string;
  numericCode: string;
  flags: FlagsType;
  currencies?: CurrencyType[];
  languages: LanguageType[];
  translations: TranslationsType;
  flag: string;
  regionalBlocs?: RegionalBlockType[];
  cioc?: string;
  independent: boolean;
};
