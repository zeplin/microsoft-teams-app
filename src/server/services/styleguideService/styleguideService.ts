import { zeplin } from "../../adapters";
import { StyleguideStatus, WebhookResourceType } from "../../adapters/zeplin/types";
import { configurationRepo } from "../../repos/configurationRepo";

interface Styleguide {
    id: string;
    name: string;
}

interface StyleguideServiceListParams {
    workspace: string;
    channelId: string;
    authToken: string;
}

interface StyleguideServicePaginatedListParams {
    workspace: string;
    authToken: string;
    limit: number;
    offset: number;
}

class StyleguideService {
    private listPaginated({
        workspace,
        authToken,
        limit,
        offset
    }: StyleguideServicePaginatedListParams): Promise<Styleguide[]> {
        if (workspace === "personal") {
            return zeplin.styleguides.listMyStyleguides({
                query: {
                    limit,
                    offset,
                    status: StyleguideStatus.ACTIVE
                },
                options: {
                    authToken
                }
            });
        }
        return zeplin.styleguides.list({
            query: {
                workspace,
                limit,
                offset,
                status: StyleguideStatus.ACTIVE
            },
            options: {
                authToken
            }
        });
    }

    async list({
        workspace,
        authToken,
        channelId
    }: StyleguideServiceListParams): Promise<Styleguide[]> {
        const styleguidesMap = new Map<string, Styleguide>();

        const limit = 50;
        let offset = 0;
        let styleguides = await this.listPaginated({
            workspace,
            limit,
            offset,
            authToken
        });

        while (styleguides.length > 0) {
            styleguides.reduce(
                (map, { id, name }) => {
                    map.set(id, { id, name });
                    return map;
                },
                styleguidesMap
            );
            offset += limit;

            // eslint-disable-next-line no-await-in-loop
            styleguides = await this.listPaginated({
                workspace,
                limit,
                offset,
                authToken
            });
        }
        const result = Array.from(styleguidesMap.values());

        const styleguideIds = result.map(({ id }) => id);

        const configuredStyleguideIds = (
            await configurationRepo.listByResourceAndChannel(WebhookResourceType.STYLEGUIDE, styleguideIds, channelId)
        ).map(({ zeplin: { resource: { id } } }) => id);

        return result.filter(({ id }) => !configuredStyleguideIds.includes(id));
    }
}

export const styleguideService = new StyleguideService();
