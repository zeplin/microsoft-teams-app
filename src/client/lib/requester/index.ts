import * as authRequests from "./authRequests";
import * as configurationRequests from "./configurationRequests";
import * as workspaceRequests from "./workspaceRequests";
import * as meRequests from "./meRequests";

export const requester = {
    ...authRequests,
    ...configurationRequests,
    ...workspaceRequests,
    ...meRequests
};
