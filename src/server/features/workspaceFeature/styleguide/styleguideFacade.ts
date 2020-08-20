interface Styleguide {
    id: string;
    name: string;
}

class StyleguideFacade {
    list(): Promise<Styleguide[]> {
        return Promise.resolve([
            { id: "507f191e810c19729de860ea", name: "Styleguide X" },
            { id: "5f3cdb0b9c258b2b085afefe", name: "Styleguide Y" },
            { id: "5f3cdb11dd66f73edf5a2449", name: "Styleguide Z" }
        ]);
    }
}

export const styleguideFacade = new StyleguideFacade();
