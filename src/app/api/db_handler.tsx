import { Client, QueryResult } from "pg";
import { genSalt, hash } from "bcrypt";

const NUM_SALT_ROUNDS = 10;

const createClient = () => {
  const client = new Client({
    user: "neondb_owner",
    password: process.env.pgPassword,
    host: "ep-crimson-night-aef5zkb8-pooler.c-2.us-east-2.aws.neon.tech",
    port: 5432,
    database: "neondb",
    ssl: true,
  });
  return client;
};

export const createUser = async (
  username: string,
  email: string,
  password: string
) => {
  const salt = await genSalt(NUM_SALT_ROUNDS);
  const hashedPassword = await hash(password, salt);
  const client = createClient();
  await client.connect();
  let result: QueryResult<any> | null = null;
  try {
    result = await client.query(
      'INSERT INTO "user"(username, email, password, verified) VALUES($1, $2, $3, FALSE) RETURNING "id", "username", "email"',
      [username, email, hashedPassword]
    );
  } catch (e) {
    console.log(e);
  }
  await client.end();
  return result;
};
