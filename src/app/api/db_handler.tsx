import { Client, QueryResult } from "pg";
import { genSalt, hash } from "bcrypt";
import { v4 } from "uuid";

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

export const getUserInfo = async (userId: number) => {
  const client = createClient();
  await client.connect();
  let result: QueryResult<any> | null = null;
  try {
    result = await client.query('SELECT * FROM "user" WHERE id=$1', [userId]);
  } catch (e) {
    console.log(e);
  }
  await client.end();
  return result;
};

export const makeVerificationLink = async (userId: number) => {
  const client = createClient();

  let result: QueryResult<any> | null = null;
  let verificationCode = v4();
  try {
    await client.connect();
    result = await client.query(
      `INSERT INTO "verification_code" (verification_code, user_id, time_issued)
      VALUES($1, $2, NOW())
      ON CONFLICT ("user_id") DO UPDATE SET
        verification_code = excluded.verification_code,
        time_issued = NOW()
      RETURNING "verification_code"`,
      [verificationCode, userId]
    );
  } catch (e) {
    console.log(e);
  }
  await client.end();
  return result;
};

export const queryDB = async <Type,>(query: string, params: any[]) => {
  const client = createClient();
  await client.connect();
  const result: Type[] = (await client.query(query, params)).rows;
  client.end();
  return result;
};
