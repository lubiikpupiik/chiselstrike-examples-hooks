import { Project } from "ts-morph";
import { BaseScanner } from "./base_scanner";
import { typesPath, endpointsPath } from "./constants";
import { FileManager } from "./manager/file.manager";
import { HooksManager } from "./manager/hooks.manager";
import { InterfaceManager } from "./manager/interface.manager";
import { TemplateManager } from "./manager/template.manager";
import { EndpointsScanner } from "./scanners/endpoints.scanner";
import { TypesScanner } from "./scanners/types.scanner";

export class Executor {
  project: Project;

  endpointsPath = endpointsPath;
  typesPath = typesPath;

  fileManager: FileManager;

  typesScanner: TypesScanner;

  endpointsScanner: EndpointsScanner;

  constructor() {
    this.initProject();
    this.fileManager = new FileManager(this.project);
    this.typesScanner = new TypesScanner(this.project);
    this.endpointsScanner = new EndpointsScanner(this.project);
  }

  initProject() {
    this.project = new Project();

    this.project.addSourceFilesAtPaths(this.endpointsPath);
    this.project.addSourceFilesAtPaths(this.typesPath);
  }

  execute() {
    const file = this.fileManager.createFile();

    const templateManager = new TemplateManager(file);

    templateManager.addTemplate();

    const interfaceManager = new InterfaceManager(file, this.typesScanner);

    interfaceManager.addInterfaces();

    const hooksManager = new HooksManager(file, this.endpointsScanner);

    hooksManager.addHooks();
  }
}
