import { StyleguideStatusEnum } from "@zeplin/sdk";

import { Zeplin } from "../../adapters";
import { configurationRepo } from "../../repos";
import { WebhookResourceTypeEnum } from "../../enums";

interface Styleguide {
    id: string;
    name: string;
}

interface StyleguideServiceListParams {
    workspace: string;
    channelId: string;
    accessToken: string;
}

interface StyleguideServicePaginatedListParams {
    workspace: string;
    accessToken: string;
    limit: number;
    offset: number;
}

class StyleguideService {
    private async listPaginated({
        workspace,
        accessToken,
        limit,
        offset
    }: StyleguideServicePaginatedListParams): Promise<Styleguide[]> {
        const zeplin = new Zeplin({ accessToken });
        if (workspace === "personal") {
            const { data } = await zeplin.users.getUserStyleguides({
                limit,
                offset,
                status: StyleguideStatusEnum.ACTIVE
            });
            return data;
        }
        const { data } = await zeplin.styleguides.getStyleguides({
            workspace,
            limit,
            offset,
            status: StyleguideStatusEnum.ACTIVE
        });
        return data;
    }

    async list({
        workspace,
        accessToken,
        channelId
    }: StyleguideServiceListParams): Promise<Styleguide[]> {
        const styleguidesMap = new Map<string, Styleguide>();

        const limit = 50;
        let offset = 0;
        let styleguides = await this.listPaginated({
            workspace,
            limit,
            offset,
            accessToken
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
                accessToken
            });
        }
        const result = Array.from(styleguidesMap.values());

        const styleguideIds = result.map(({ id }) => id);

        const configuredStyleguideIds = (
            await configurationRepo.listByResourceAndChannel(
                WebhookResourceTypeEnum.STYLEGUIDE,
                styleguideIds,
                channelId
            )
        ).map(({ zeplin: { resource: { id } } }) => id);

        return result.filter(({ id }) => !configuredStyleguideIds.includes(id));
    }
}

export const styleguideService = new StyleguideService();
