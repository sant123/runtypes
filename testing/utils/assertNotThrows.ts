import { AssertionError, assertIsError } from "../../deps/testing.ts";

/**
 * Executes a function, expecting it to not throw.  If it does, then it
 * throws. An error class and a string that should be included in the
 * error message can also be asserted. Or you can pass a
 * callback which will be passed the error, usually to apply some custom
 * assertions on it.
 */
export function assertNotThrows<E extends Error = Error>(
  fn: () => unknown,
  // deno-lint-ignore no-explicit-any
  ErrorClass?: new (...args: any[]) => E,
  msgIncludes?: string,
  msg?: string,
): void;
export function assertNotThrows(
  fn: () => unknown,
  errorCallback: (e: Error) => unknown,
  msg?: string,
): void;
export function assertNotThrows<E extends Error = Error>(
  fn: () => unknown,
  errorClassOrCallback?:
    // deno-lint-ignore no-explicit-any
    | (new (...args: any[]) => E)
    | ((e: Error) => unknown),
  msgIncludesOrMsg?: string,
  msg?: string,
): void {
  // deno-lint-ignore no-explicit-any
  let ErrorClass: (new (...args: any[]) => E) | undefined = undefined;
  let msgIncludes: string | undefined = undefined;
  let errorCallback;
  if (
    errorClassOrCallback == null ||
    errorClassOrCallback.prototype instanceof Error ||
    errorClassOrCallback.prototype === Error.prototype
  ) {
    // deno-lint-ignore no-explicit-any
    ErrorClass = errorClassOrCallback as new (...args: any[]) => E;
    msgIncludes = msgIncludesOrMsg;
    errorCallback = null;
  } else {
    errorCallback = errorClassOrCallback as (e: Error) => unknown;
    msg = msgIncludesOrMsg;
  }
  let doesThrow = false;
  try {
    fn();
  } catch (error) {
    if (error instanceof Error === false) {
      throw new AssertionError("A non-Error object was thrown.");
    }
    assertIsError(
      error,
      ErrorClass,
      msgIncludes,
      msg,
    );
    if (typeof errorCallback == "function") {
      errorCallback(error);
    }
    doesThrow = true;
  }
  if (doesThrow) {
    msg = `Expected function to not throw${msg ? `: ${msg}` : "."}`;
    throw new AssertionError(msg);
  }
}
