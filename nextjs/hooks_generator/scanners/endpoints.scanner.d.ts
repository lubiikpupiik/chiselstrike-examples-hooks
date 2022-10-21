import { FunctionDeclaration, SourceFile } from "ts-morph";

export type TypesResult = {
  file: SourceFile;
  func: FunctionDeclaration;
};
