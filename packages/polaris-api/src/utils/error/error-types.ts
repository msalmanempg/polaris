/**
 * These are generic error types which should make sense in any app they are used.
 * If you want to add domain specific error types, please do it in @pf/domain or the app itself.
 * These are mainly here for convenience.
 */
export const ErrorTypes = {
  InvalidRequestData: "InvalidRequestData",
  DuplicateEntry: "DuplicateEntry",
  MissingEntry: "MissingEntry",
  TimeoutReached: "TimeoutReached",
  WrongSetup: "WrongSetup",
  InvalidHostname: "InvalidHostname",
};
