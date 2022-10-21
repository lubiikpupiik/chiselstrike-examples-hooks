import { FunctionDeclaration, Project, SourceFile } from "ts-morph";
import { BaseScanner } from "../base_scanner";
import { TypesResult } from "./endpoints.scanner.d";

export class EndpointsScanner extends BaseScanner {
  constructor(private readonly project: Project) {
    super();
  }

  getTypes() {
    const files = this.getEndpointFiles();

    return this.getDefaultExportedFunctionsFromFiles(files);
  }

  private getEndpointFiles() {
    const files = this.getOrThrow(this.project.getSourceFiles());

    return files.filter((file) => file.getFilePath().includes("endpoints/"));
  }

  private getDefaultExportedFunctionsFromFiles(
    files: SourceFile[]
  ): TypesResult[] {
    return files.map((file) => ({
      func: this.getDefaultExportedFunctionFromFile(file),
      file,
    }));
  }

  private getDefaultExportedFunctionFromFile(file: SourceFile) {
    const functions = file.getFunctions();

    const fun = functions.find((fun) => fun.isDefaultExport());

    if (!fun) {
      throw new Error(
        `File ${file.getBaseName()} is missing default export function.`
      );
    }

    return fun;
  }
}
