import { PackageManager } from './_base.js';

import type {
  AddArguments,
  InstallArguments,
  RemoveArguments,
  RunArguments,
} from './_base.js';

export class Npm extends PackageManager {
  command = 'npm';

  add({ packages, as, directory, workspaces }: AddArguments): Promise<void> {
    const args: string[] = ['install'];

    if (directory) {
      args.push('--prefix', directory);
    }

    if (workspaces) {
      if (workspaces === 'all') {
        args.push('--workspaces');
      } else if (workspaces.length > 0) {
        workspaces.forEach((w) => {
          args.push('--workspace', w);
        });
      }
    }

    switch (as) {
      case undefined:
      case 'dependencies':
        args.push('--save');
        break;
      case 'devDependencies':
        args.push('--save-dev');
        break;
      case 'peerDependencies':
        args.push('--save-peer');
        break;
      case 'optionalDependencies':
        args.push('--save-optional');
        break;
      default:
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new Error(`Unsupported package type: ${as}`);
    }

    args.push(...packages);

    return this.execute(args);
  }

  install({
    directory,
    frozenLockfile,
    workspaces,
  }: InstallArguments): Promise<void> {
    const args: string[] = [];

    if (frozenLockfile) {
      args.push('ci');
    } else {
      args.push('install');
    }

    if (directory) {
      args.push('--prefix', directory);
    }

    if (workspaces) {
      if (workspaces === 'all') {
        args.push('--workspaces');
      } else if (workspaces.length > 0) {
        workspaces.forEach((w) => {
          args.push('--workspace', w);
        });
      }
    }

    return this.execute(args);
  }

  remove({ directory, packages, workspaces }: RemoveArguments): Promise<void> {
    const args = ['uninstall'];

    if (directory) {
      args.push('--prefix', directory);
    }

    if (workspaces) {
      if (workspaces === 'all') {
        args.push('--workspaces');
      } else if (workspaces.length > 0) {
        workspaces.forEach((w) => {
          args.push('--workspace', w);
        });
      }
    }

    args.push(...packages);

    return this.execute(args);
  }

  run({
    directory,
    script,
    additionalArgs,
    workspaces,
  }: RunArguments): Promise<void> {
    const args = ['run'];

    if (directory) {
      args.push('--prefix', directory);
    }

    if (workspaces) {
      if (workspaces === 'all') {
        args.push('--workspaces');
      } else if (workspaces.length > 0) {
        workspaces.forEach((w) => {
          args.push('--workspace', w);
        });
      }
    }

    args.push(script);

    if (additionalArgs) {
      args.push('--', ...additionalArgs);
    }

    return this.execute(args);
  }
}
