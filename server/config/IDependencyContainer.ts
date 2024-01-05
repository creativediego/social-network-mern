export interface IDependencyContainer {
  register<T>(
    name: string,
    dependencies: string[],
    implementation: (...args: any[]) => T
  ): void;
  resolve<T>(name: string): T;
}
