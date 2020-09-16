import { commonTeamsCard } from "./index";

describe("commonTeamsCard", () => {
    it("should match snapshot when rendered with only required elements", () => {
        expect(
            commonTeamsCard({
                text: "text"
            })
        ).toMatchSnapshot();
    });

    it("should match snapshot when rendered with section", () => {
        expect(
            commonTeamsCard({
                text: "text",
                section: {
                    title: "sectionTitle",
                    text: "sectionText"
                }
            })
        ).toMatchSnapshot();
    });

    it("should match snapshot when rendered with images", () => {
        expect(
            commonTeamsCard({
                text: "text",
                images: ["http://placehold.it/400"]
            })
        ).toMatchSnapshot();
    });

    it("should match snapshot when rendered with links", () => {
        expect(
            commonTeamsCard({
                text: "text",
                links: [{
                    title: "Open in me",
                    url: "https://ergun.sh"
                }]
            })
        ).toMatchSnapshot();
    });

    it("should match snapshot when rendered with title", () => {
        expect(
            commonTeamsCard({
                title: "title",
                text: "text"
            })
        ).toMatchSnapshot();
    });

    it("should match snapshot when rendered with all elements", () => {
        expect(
            commonTeamsCard({
                title: "Project name",
                text: "**sertac 🌮** added a new comment on _Manage Zeplin Connector_ screen. 🗞",
                section: {
                    title: "Section title",
                    text: "Naptin nettin nettin naptin?"
                },
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
