import {Project} from "../entity/project";
import dataSource from "../db";
import {Active} from "../entity/active";
import {ProjectService} from "./project";

const activeRepository = dataSource.getRepository(Active);

export class ActiveService {

  public static async getActiveProject() {

    const active = await activeRepository.createQueryBuilder().getOne();
    if (!active || !active.project) {
      const projects = await ProjectService.getList();
      await this.addActiveProject(projects[0]);
      return projects[0];
    } else {
      return active.project;
    }

  }

  public static async setActiveProject(projectId: number) {

    const active = await activeRepository.createQueryBuilder().getOne();
    const project = await ProjectService.getDetailsById(projectId);
    if (!active) {
      await this.addActiveProject(project);
    } else {
      await activeRepository.update(active.id, {
        project,
      });
    }
    return active;
  }

  public static async addActiveProject(project: Project) {
    await activeRepository.insert({
      project,
    })
    return project;
  }

}