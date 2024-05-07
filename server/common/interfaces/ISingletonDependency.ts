import { Dep } from '../../config/Dependencies';

/**
 * Interface for a singleton dependency. Used to define a singleton dependency object. Used in conjunction with the `registerSingletonDependency` function for registering singleton dependencies.
 */
export interface ISingletonDependency<T = unknown> {
  dependencies: Dep[];
  implementation: (...args: unknown[]) => T;
  instance?: T;
}
