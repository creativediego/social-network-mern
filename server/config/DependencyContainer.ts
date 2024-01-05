import { Dep } from './Dependencies';
import { IDependencyContainer } from './IDependencyContainer';
import { ISingletonDependency } from './ISingletonDependency';

/**
 * DependencyContainer class.
 *
 * This class implements the `IDependencyContainer` interface and provides a simple dependency injection container.
 * Dependencies are registered with a name, a list of dependencies, and an implementation. Dependencies are resolved recursively.
 *
 * The `dependencies` map stores the registered dependencies.
 * The `instances` map stores the instances of the dependencies.
 *
 * The `register` method registers a dependency. If a dependency with the same name is already registered, it throws an error.
 *
 * @implements {IDependencyContainer}
 */

export class DependencyContainer implements IDependencyContainer {
  private dependencies = new Map<string, ISingletonDependency<any>>();
  private instances = new Map<string, any>();

  /**
   * Registers a dependency. If a dependency with the same name is already registered, it throws an error.
   * @param name the name of the dependency
   * @param dependencies the dependencies of the dependency
   * @param implementation the implementation of the dependency
   */
  register<T>(
    name: Dep,
    dependencies: Dep[],
    implementation: (...args: any[]) => T
  ): void {
    if (this.dependencies.has(name)) {
      throw new Error('Dependency already registered');
    }

    const resolvedDependencies = dependencies.map((dep: Dep) =>
      this.resolve(dep)
    );

    const instance = implementation(...resolvedDependencies);
    this.dependencies.set(name, { dependencies, implementation });
    this.instances.set(name, instance); // Store instantiated object
  }

  /**
   * Resolves a dependency recursively.
   * Base case: If the dependency is already instantiated, it returns the instance. Otherwise, it instantiates the dependency and returns the instance.
   * Recursive case: It resolves the dependencies of the dependency and then instantiates the dependency.
   * @param name 'name' of the dependency
   * @returns the dependency singleton
   */
  resolve<T>(name: string): T {
    if (!this.instances.has(name)) {
      const dependency = this.dependencies.get(name) as ISingletonDependency<T>;
      const resolvedDependencies = dependency.dependencies.map((dep: string) =>
        this.resolve(dep)
      );
      const instance = dependency.implementation(...resolvedDependencies);
      this.instances.set(name, instance); // Store instantiated object
    }

    return this.instances.get(name) as T;
  }
}
