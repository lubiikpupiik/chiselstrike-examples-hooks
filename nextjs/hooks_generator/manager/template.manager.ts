import { SourceFile } from "ts-morph";

export class TemplateManager {
  constructor(private readonly file: SourceFile) {}

  addTemplate() {
    this.addImports();
    this.addArgsTypeForExport();
    // this.file.saveSync();
  }

  private addImports() {
    this.file.addImportDeclaration({
      moduleSpecifier: "./hooks_generator/helpers/hooks",
      namedImports: [
        { name: "useChiselFetch" },
        { name: "useChiselPut" },
        { name: "PublicChiselFetchArgs" },
        { name: "PublicChiselPutArgs" },
      ],
    });
  }

  private addArgsTypeForExport() {
    this.file.addTypeAlias({
      name: "ChiselFetchArgs",
      type: "PublicChiselFetchArgs",
      isExported: true,
    });

    this.file.addTypeAlias({
      name: "ChiselPutArgs",
      type: "PublicChiselPutArgs",
      isExported: true,
    });
  }
}
