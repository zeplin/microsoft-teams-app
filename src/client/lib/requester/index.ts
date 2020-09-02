import * as authRequests from "./authRequests";
import * as configurationRequests from "./configurationRequests";
import * as workspaceRequests from "./workspaceRequests";

export const requester = {
    ...authRequests,
    ...configurationRequests,
    ...workspaceRequests
};
