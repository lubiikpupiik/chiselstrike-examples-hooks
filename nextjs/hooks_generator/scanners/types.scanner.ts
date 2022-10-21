import { ClassDeclaration, Project, SourceFile } from "ts-morph";
import { BaseScanner } from "../base_scanner";
import { typesPath } from "../constants";
import { PropertiesResult, TypesResults } from "./types.scanner.d";

export class TypesScanner extends BaseScanner {
  private readonly path = typesPath;

  constructor(private readonly project: Project) {
    super();
  }

  getTypes() {
    const file = this.getOrThrow(this.project.getSourceFile(this.path));

    return this.getTypesResults(file);
  }

  private getTypesResults(file: SourceFile): TypesResults {
    const cls = file.getClasses();

    const exportedClasses = cls.filter((cl) => cl.isExported());

    return exportedClasses.map((cl) => ({
      name: cl.getName() || "XXX",
      properties: this.getPropertyTypesFromClasses(cl),
    }));
  }

  private getPropertyTypesFromClasses(
    cl: ClassDeclaration
  ): PropertiesResult[] {
    return cl.getProperties().map((property) => ({
      type: property.getType().getText(),
      name: property.getName(),
    }));
  }
}
