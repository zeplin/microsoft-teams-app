import { commonTeamsCard } from ".";

describe("commonTeamsCard", () => {
    it("should match snapshot when rendered with only required elements", () => {
        expect(
            commonTeamsCard({
                title: "title",
                text: "text",
                sectionText: "sectionText"
            })
        ).toMatchSnapshot();
    });

    it("should match snapshot when rendered with section title", () => {
        expect(
            commonTeamsCard({
                title: "title",
                text: "text",
                sectionTitle: "sectionTitle",
                sectionText: "sectionText"
            })
        ).toMatchSnapshot();
    });

    it("should match snapshot when rendered with images", () => {
        expect(
            commonTeamsCard({
                title: "title",
                text: "text",
                sectionTitle: "sectionTitle",
                sectionText: "sectionText",
                images: ["http://placehold.it/400"]
            })
        ).toMatchSnapshot();
    });

    it("should match snapshot when rendered with links", () => {
        expect(
            commonTeamsCard({
                title: "title",
                text: "text",
                sectionText: "sectionText",
                links: [{
                    title: "Open in me",
                    url: "https://ergun.sh"
                }]
            })
        ).toMatchSnapshot();
    });

    it("should match snapshot when rendered with all elements", () => {
        expect(
            commonTeamsCard({
                title: "Project name",
                text: "**sertac 🌮** added a new comment on _Manage Zeplin Connector_ screen. 🏃‍♂",
                sectionTitle: "Section title",
                sectionText: "Naptin nettin nettin naptin?",
                links: [{
                    title: "Open in Web",
                    url: "https://ergun.sh"
                }, {
                    title: "Open in App",
                    url: "https://ergun.sh"
                }],
                images: ["http://placehold.it/160"]
            })
        ).toMatchSnapshot();
    });
});