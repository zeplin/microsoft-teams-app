import mongoose, {
    ConnectionOptions,
    Mongoose,
    Model
} from "mongoose";
import { ReadPreference } from "mongodb";
import { configurationSchema } from "./schemas";
import { ConfigurationDocument } from "./documents";

interface MongoOptions {
    isDebug?: boolean;
}

const options: ConnectionOptions = {
    autoReconnect: true,
    readPreference: ReadPreference.PRIMARY_PREFERRED,
    keepAlive: true,
    connectTimeoutMS: 30000,
    useNewUrlParser: true,
    useFindAndModify: false
};

class Mongo {
    private mongoose: Mongoose;
    configuration: Model<ConfigurationDocument>;

    async init(uri: string, { isDebug = false }: MongoOptions): Promise<void> {
        mongoose.set("debug", isDebug);

        this.mongoose = await mongoose.connect(uri, options);
        this.configuration = this.mongoose.model("configuration", configurationSchema);
    }

    close(): Promise<void> {
        return this.mongoose.connection.close();
    }
}

export const mongo = new Mongo();
