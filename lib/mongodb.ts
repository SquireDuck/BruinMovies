import { MongoClient, MongoClientOptions, Db } from "mongodb";

const uri = "mongodb+srv://florence1z:UtwWxtGMcn6xyADr@cluster0.2wl7r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const options: MongoClientOptions = {
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export async function connectToDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db("BruinMovie"); // Your database name
}
