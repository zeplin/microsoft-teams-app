import { zeplin } from "../../../adapters";
import { StyleguideStatus } from "../../../adapters/zeplin/types";

interface Styleguide {
    id: string;
    name: string;
}

interface StyleguideFacadeListParams {
    workspace: string;
    authToken: string;
}

interface StyleguideFacadePaginatedListParams {
    workspace: string;
    authToken: string;
    limit: number;
    offset: number;
}

class StyleguideFacade {
    private listPaginated({
        workspace,
        authToken,
        limit,
        offset
    }: StyleguideFacadePaginatedListParams): Promise<Styleguide[]> {
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
        authToken
    }: StyleguideFacadeListParams): Promise<Styleguide[]> {
        const result = new Map<string, Styleguide>();

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
                result
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

        return Array.from(result.values());
    }
}

export const styleguideFacade = new StyleguideFacade();
