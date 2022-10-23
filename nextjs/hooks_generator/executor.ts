import { Project } from "ts-morph";
import { typesPath, endpointsPath } from "./constants";
import { FileManager } from "./manager/file.manager";
import { HooksManager } from "./manager/hooks.manager";
import { InterfaceManager } from "./manager/interface.manager";
import { TemplateManager } from "./manager/template.manager";
import { EndpointsScanner } from "./scanners/endpoints.scanner";
import { TypesScanner } from "./scanners/types.scanner";

export class Executor {
  private project: Project;

  endpointsPath = endpointsPath;
  typesPath = typesPath;

  private fileManager: FileManager;

  private typesScanner: TypesScanner;

  private endpointsScanner: EndpointsScanner;

  constructor() {
    this.project = new Project();
    this.initProject();
    this.fileManager = new FileManager(this.project);
    this.typesScanner = new TypesScanner(this.project);
    this.endpointsScanner = new EndpointsScanner(this.project);
  }

  initProject() {
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
