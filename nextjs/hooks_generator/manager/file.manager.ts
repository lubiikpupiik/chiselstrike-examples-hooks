import { Project } from "ts-morph";

export class FileManager {
  destination = "chisel.hooks.ts";
  constructor(private readonly project: Project) {}

  createFile() {
    const file = this.project.createSourceFile(this.destination, undefined, {
      overwrite: true,
    });

    // file.saveSync();

    return file;
  }
}
