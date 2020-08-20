interface Project {
    id: string;
    name: string;
}

class ProjectFacade {
    list(): Promise<Project[]> {
        return Promise.resolve([
            { id: "507f191e810c19729de860ea", name: "Project X" },
            { id: "5f3cdb0b9c258b2b085afefe", name: "Project Y" },
            { id: "5f3cdb11dd66f73edf5a2449", name: "Project Z" }
        ]);
    }
}

export const projectFacade = new ProjectFacade();
