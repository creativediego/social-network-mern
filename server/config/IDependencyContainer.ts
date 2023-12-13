import { Dep } from './Dependencies';

export interface ISingleton<T = unknown> {
  dependencies: string[];
  implementation: (...args: any[]) => T;
  instance?: T;
}

export interface IDependencyContainer {
  register<T>(
    name: string,
    dependencies: string[],
    implementation: (...args: any[]) => T
  ): void;
  get<T>(name: string): T;
}
