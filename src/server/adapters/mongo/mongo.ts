import mongoose, {
    ConnectionOptions,
    Mongoose,
    Model,
    Schema,
    Document
} from "mongoose";
import { ReadPreference } from "mongodb";

interface MongoOptions {
    isDebug?: boolean;
}

const options: ConnectionOptions = {
    readPreference: ReadPreference.PRIMARY_PREFERRED,
    keepAlive: true,
    connectTimeoutMS: 30000,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
};

class Mongo {
    private mongoose!: Mongoose;

    async init(uri: string, { isDebug = false }: MongoOptions): Promise<void> {
        mongoose.set("debug", isDebug);

        this.mongoose = await mongoose.connect(uri, options);
    }

    createModel<D extends Document>(modelName: string, schema: Schema): Model<D> {
        return this.mongoose.model<D>(modelName, schema);
    }

    close(): Promise<void> {
        return this.mongoose.connection.close();
    }
}

export const mongo = new Mongo();
