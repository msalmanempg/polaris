import * as child from "child_process";
import { Request, RequestHandler, Response } from "express";
import { logger } from "polaris-api/utils";

const migrate: RequestHandler = (request: Request, response: Response) => {
  const process: child.ChildProcess | null = child.exec(
    "npx prisma migrate dev --preview-feature --schema=./../prisma/schema.prisma"
  );

  process.stdout!.setEncoding("utf8");
  let responseString: string;
  process.stdout!.on("data", (data: any) => {
    const dataString: string = data
      .toString()
      .split(/(\r?\n)/g)
      .join("");
    responseString = `${responseString} ${dataString}`;
  });

  process.stdout!.on("close", (code: string) => {
    responseString = `${responseString} \n Migration Process completed with code ${code}`;
    logger.info(responseString);
    response.status(200);
    response.send(responseString);
    response.end();
  });
};

export { migrate };
