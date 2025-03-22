import { PackageContext } from '../contexts/package.js';

export async function setupHusky(): Promise<void> {
  const manager = PackageContext.consume().manager;

  await manager.add({
    packages: ['husky@^9'],
    as: 'devDependencies',
  });

  await manager.exec({
    command: 'husky',
    additionalArgs: ['init'],
  });
}
