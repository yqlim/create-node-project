import { PackageManager } from './_base.js';

import type {
  AddArguments,
  CleanArguments,
  ExecArguments,
  RemoveArguments,
  RunArguments,
} from './_base.js';

export class Pnpm extends PackageManager {
  command = 'pnpm';

  add({ packages, as, directory, workspaces }: AddArguments): Promise<void> {
    const args = ['add'];

    if (directory) {
      args.push('--dir', directory);
    }

    if (workspaces) {
      if (workspaces === 'all') {
        args.push('--recursive');
      } else if (workspaces.length > 0) {
        workspaces.forEach((w) => {
          args.push('--filter', w);
        });
      }
    }

    switch (as) {
      case undefined:
      case 'dependencies':
        args.push('--save-prod');
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

  clean({
    directory,
    frozenLockfile,
    workspaces,
  }: CleanArguments): Promise<void> {
    const args = ['install'];

    if (frozenLockfile) {
      args.push('--frozen-lockfile');
    }

    if (directory) {
      args.push('--dir', directory);
    }

    if (workspaces) {
      if (workspaces === 'all') {
        args.push('--recursive');
      } else if (workspaces.length > 0) {
        workspaces.forEach((w) => {
          args.push('--filter', w);
        });
      }
    }

    return this.execute(args);
  }

  exec({
    command,
    directory,
    additionalArgs,
    workspaces,
  }: ExecArguments): Promise<void> {
    const args = [];

    if (directory) {
      args.push('--dir', directory);
    }

    if (workspaces) {
      if (workspaces === 'all') {
        args.push('--recursive');
      } else if (workspaces.length > 0) {
        workspaces.forEach((w) => {
          args.push('--filter', w);
        });
      }
    }

    args.push('exec', command);

    if (additionalArgs) {
      args.push(...additionalArgs);
    }

    return this.execute(args);
  }

  remove({ directory, packages, workspaces }: RemoveArguments): Promise<void> {
    const args = ['remove'];

    if (directory) {
      args.push('--dir', directory);
    }

    if (workspaces) {
      if (workspaces === 'all') {
        args.push('--recursive');
      } else if (workspaces.length > 0) {
        workspaces.forEach((w) => {
          args.push('--filter', w);
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
    const args = ['run', script];

    if (directory) {
      args.push('--dir', directory);
    }

    if (workspaces) {
      if (workspaces === 'all') {
        args.push('--recursive');
      } else if (workspaces.length > 0) {
        workspaces.forEach((w) => {
          args.push('--filter', w);
        });
      }
    }

    if (additionalArgs) {
      args.push('--', ...additionalArgs);
    }

    return this.execute(args);
  }
}

export default Pnpm;
