import { Dep } from '../../config/Dependencies';

/**
 * Dependency container interface used to register and resolve dependencies in the entire backend.
 */
export interface IDependencyContainer {
  register<T>(
    name: Dep,
    dependencies: Dep[],
    implementation: (...args: any[]) => T
  ): void;
  resolve<T>(name: Dep): T;
}
