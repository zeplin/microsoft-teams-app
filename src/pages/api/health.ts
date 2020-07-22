import { NextApiRequest, NextApiResponse } from "next";
import { OK } from "http-status-codes";

export default (req: NextApiRequest, res: NextApiResponse): void => {
    res.status(OK).json({ status: "pass" });
};
