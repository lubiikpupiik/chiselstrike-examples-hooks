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

    // this.file.saveSync();
  }

  private createHookFunctionsFromTypes(types: TypesResult[]) {
    return types.map((type) => this.createHookFunctionFromType(type));
  }

  private createHookFunctionFromType(type: TypesResult) {
    const name = type.file.getBaseName().replace(".ts", "");

    const fun = this.file.addFunction({
      name: this.formatHookName(name),
      isExported: true,
      parameters: [
        {
          name: `${this.argumentName}?`,
          type: type.file.getFilePath().includes("get/")
            ? "PublicChiselFetchArgs"
            : "PublicChiselPutArgs",
        },
      ],
    });

    const responseType = this.formatResponseType(
      type.func.getReturnType().getText()
    );

    if (type.file.getFilePath().includes("get/")) {
      this.addHookBodyGet(fun, name);
    } else if (type.file.getFilePath().includes("put/")) {
      this.addHookBodyPut(fun, name);
    }
  }

  private formatHookName(name: string) {
    const [firstLetter, ...restOfTheName] = name;

    const formattedRestOfTheName = restOfTheName
      .join("")
      .replace(/_\w/g, ([_, char]) => char.toUpperCase());

    return `use${firstLetter.toUpperCase()}${formattedRestOfTheName}`;
  }

  private addHookBodyGet(fun: FunctionDeclaration, name: string) {
    fun.setBodyText((write) => {
      write.writeLine(
        `return useChiselFetch({ url: '${name}', ...${this.argumentName} });`
      );
    });
  }

  private addHookBodyPut(fun: FunctionDeclaration, name: string) {
    fun.setBodyText((write) => {
      write.writeLine(
        `return useChiselPut({ url: '${name}', ...${this.argumentName} })`
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
