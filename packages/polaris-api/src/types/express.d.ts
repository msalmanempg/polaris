declare namespace Express {
  import { ReflectiveInjector } from "injection-js";

  export interface Request {
    injector: ReflectiveInjector;
  }
}
