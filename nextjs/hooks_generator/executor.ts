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

  constructor() {
    this.project = new Project();
    this.initProject();
  }

  initProject() {
    this.project.addSourceFilesAtPaths(this.endpointsPath);
    this.project.addSourceFilesAtPaths(this.typesPath);
  }

  execute() {
    const fileManager = new FileManager(this.project);

    const file = fileManager.createFile();

    const templateManager = new TemplateManager(file);

    templateManager.addTemplate();

    const interfaceManager = new InterfaceManager(
      file,
      new TypesScanner(this.project)
    );

    interfaceManager.addInterfaces();

    const hooksManager = new HooksManager(
      file,
      new EndpointsScanner(this.project)
    );

    hooksManager.addHooks();

    file.saveSync();
  }
}
