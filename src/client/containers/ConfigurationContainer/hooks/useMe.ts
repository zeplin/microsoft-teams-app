import { useQuery } from "react-query";
import { INTERNAL_SERVER_ERROR, UNAUTHORIZED } from "http-status-codes";

import { requester } from "../../../lib";
import { User } from "../../../constants";
import { ClientError } from "../../../ClientError";

const RETRY_COUNT = 3;

interface UseMeResult {
    me?: User;
}

interface UseMeParams {
    enabled: boolean;
    onError: (isAuthorizationError: boolean) => void;
}

export const useMe = ({
    enabled,
    onError
}: UseMeParams): UseMeResult => {
    const {
        data: me
    } = useQuery(
        "me",
        requester.getMe,
        {
            enabled,
            retry: (failureCount, error: Error) => (
                (!(error instanceof ClientError) || error.status >= INTERNAL_SERVER_ERROR) &&
                failureCount <= RETRY_COUNT
            ),
            onError: error => onError(error instanceof ClientError && error.status === UNAUTHORIZED)
        }
    );

    return {
        me
    };
};
