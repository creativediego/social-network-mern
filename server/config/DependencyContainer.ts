import { IDependencyContainer, ISingleton } from './IDependencyContainer';

/**
 * A simple dependency injection container. Dependencies are registered with a name, a list of dependencies, and an implementation. Dependencies are resolved recursively.
 */

export class DependencyContainer implements IDependencyContainer {
  private dependencies = new Map<string, ISingleton<any>>();
  private instances = new Map<string, any>();

  register<T>(
    name: string,
    dependencies: string[],
    implementation: (...args: any[]) => T
  ): void {
    if (this.dependencies.has(name)) {
      throw new Error('Dependency already registered');
    }

    const resolvedDependencies = dependencies.map((dep: string) =>
      this.get(dep)
    );

    const instance = implementation(...resolvedDependencies);
    this.dependencies.set(name, { dependencies, implementation });
    this.instances.set(name, instance); // Store instantiated object
  }

  get<T>(name: string): T {
    if (!this.instances.has(name)) {
      const dependency = this.dependencies.get(name) as ISingleton<T>;
      const resolvedDependencies = dependency.dependencies.map((dep: string) =>
        this.get(dep)
      );
      const instance = dependency.implementation(...resolvedDependencies);
      this.instances.set(name, instance); // Store instantiated object
    }

    return this.instances.get(name) as T;
  }
}
