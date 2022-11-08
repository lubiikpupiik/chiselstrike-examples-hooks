import { InterfaceDeclaration, SourceFile } from "ts-morph";
import { EndpointsScanner } from "../scanners/endpoints.scanner";
import {
  PropertiesResult,
  TypesResults,
  TypesResult,
} from "../scanners/types.scanner.d";
import { TypesScanner } from "../scanners/types.scanner";

export class InterfaceManager {
  constructor(
    private readonly file: SourceFile,
    private readonly typesScanner: TypesScanner
  ) {}

  addInterfaces() {
    const types = this.typesScanner.getTypes();

    this.createInterfacesFromTypes(types);

    // this.file.saveSync();
  }

  private createInterfacesFromTypes(types: TypesResults) {
    return types.map((result) => this.createInterfaceFromTypes(result));
  }

  private createInterfaceFromTypes(type: TypesResult) {
    const int = this.file.addInterface({ name: type.name, isExported: true });

    this.addProperties(int, type.properties);
  }

  private addProperties(
    int: InterfaceDeclaration,
    properties: PropertiesResult[]
  ) {
    properties.forEach(({ name, type }) => {
      int.addProperty({ name, type });
    });
  }
}
