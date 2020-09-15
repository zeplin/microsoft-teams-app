import { useQuery } from "react-query";
import { INTERNAL_SERVER_ERROR, UNAUTHORIZED } from "http-status-codes";
import { AxiosError } from "axios";

import { requester } from "../../../lib";
import { User } from "../../../constants";

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
    } = useQuery<User, "me", AxiosError>(
        "me",
        requester.getMe,
        {
            retry: (failureCount, error) => (
                (error.response?.status === undefined || error.response?.status >= INTERNAL_SERVER_ERROR) &&
                failureCount <= RETRY_COUNT
            ),
            onError: error => onError(error.response?.status === UNAUTHORIZED),
            enabled
        }
    );

    return {
        me
    };
};
