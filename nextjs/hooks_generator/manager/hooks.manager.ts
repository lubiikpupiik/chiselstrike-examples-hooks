import { FunctionDeclaration, SourceFile } from "ts-morph";
import { EndpointsScanner } from "../scanners/endpoints.scanner";
import { TypesResult } from "../scanners/endpoints.scanner.d";

export class HooksManager {
  private readonly argumentName = "params";
  constructor(
    private readonly file: SourceFile,
    private readonly endpointsScanner: EndpointsScanner
  ) {}

  addHooks() {
    const types = this.endpointsScanner.getTypes();

    this.createHookFunctionsFromTypes(types);

    this.file.saveSync();
  }

  private createHookFunctionsFromTypes(types: TypesResult[]) {
    return types.map((type) => this.createHookFunctionFromType(type));
  }

  private createHookFunctionFromType(type: TypesResult) {
    const name = type.file.getBaseName();

    const fun = this.file.addFunction({
      name: this.formatHookName(name),
      isExported: true,
      parameters: [{ name: this.argumentName, type: "PublicChieselFetchArgs" }],
    });

    this.addHookBody(fun, name);
  }

  private formatHookName(name: string) {
    const [firstLetter, ...restOfTheName] = name;

    const formattedRestOfTheName = restOfTheName
      .join()
      .replace(/_*\w/, ([_, char]) => char.toUpperCase());

    return `use${firstLetter}${formattedRestOfTheName}`;
  }

  private addHookBody(fun: FunctionDeclaration, name: string) {
    fun.setBodyText((write) => {
      write.writeLine(
        `return useChiselFetch<${this.getRespnseType(
          fun
        )}>({ url: ${name}, ...${this.argumentName} });`
      );
    });
  }

  private getRespnseType(fun: FunctionDeclaration) {
    return fun.getReturnType().getText();
  }
}
