export type PropertiesResult = {
  name: string;
  type: string;
};

export type TypesResult = {
  name: string;
  properties: PropertiesResult[];
};

export type TypesResults = TypesResult[];
