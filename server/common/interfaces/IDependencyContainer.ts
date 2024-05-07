import { Dep } from '../../config/Dependencies';

/**
 * Dependency container interface used to register and resolve dependencies.
 */
export interface IDependencyContainer {
  register<T>(
    name: Dep,
    dependencies: Dep[],
    implementation: (...args: any[]) => T
  ): void;
  resolve<T>(name: Dep): T;
}
