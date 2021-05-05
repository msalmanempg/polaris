import MockDate from "mockdate";
import { disconnectDatabase } from "./support/test-database";

beforeEach(() => {
  MockDate.set("2021-02-19T05:20:07.269Z");
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(async () => {
  await disconnectDatabase();
});
