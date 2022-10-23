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
    const name = type.file.getBaseName().replace(".ts", "");

    const fun = this.file.addFunction({
      name: this.formatHookName(name),
      isExported: true,
      parameters: [{ name: this.argumentName, type: "PublicChieselFetchArgs" }],
    });

    const responseType = this.formatResponseType(
      type.func.getReturnType().getText()
    );

    if (type.file.getFilePath().includes("get/")) {
      this.addHookBodyGet(fun, name, responseType);
    } else if (type.file.getFilePath().includes("post/")) {
      this.addHookBodyPost(fun, name, responseType);
    }
  }

  private formatHookName(name: string) {
    const [firstLetter, ...restOfTheName] = name;

    const formattedRestOfTheName = restOfTheName
      .join("")
      .replace(/_\w/g, ([_, char]) => char.toUpperCase());

    return `use${firstLetter.toUpperCase()}${formattedRestOfTheName}`;
  }

  private addHookBodyGet(
    fun: FunctionDeclaration,
    name: string,
    responseType: string
  ) {
    fun.setBodyText((write) => {
      write.writeLine(
        `return useChiselFetch<${responseType}>({ url: '${name}', ...${this.argumentName} });`
      );
    });
  }

  private addHookBodyPost(
    fun: FunctionDeclaration,
    name: string,
    argumentType: string
  ) {
    fun.setBodyText((write) => {
      write.writeLine(
        `return useChiselPost<${argumentType}>({ url: '${name}', ...${this.argumentName} })`
      );
    });
  }

  private formatResponseType(responseType: string) {
    const formattedResponseType = responseType.match(/(?<=Promise<)(.*)(?=>)/);

    return formattedResponseType !== null
      ? formattedResponseType[0]
      : responseType;
  }
}
