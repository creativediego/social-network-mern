export interface ISingletonDependency<T = unknown> {
  dependencies: string[];
  implementation: (...args: any[]) => T;
  instance?: T;
}
