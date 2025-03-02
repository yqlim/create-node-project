import { spawn } from 'node:child_process';

export type AddArguments = {
  packages: string[];
  as?:
    | 'dependencies'
    | 'devDependencies'
    | 'peerDependencies'
    | 'optionalDependencies';
  directory?: string;
  workspaces?: 'all' | string[];
};

export type InstallArguments = {
  directory?: string;
  frozenLockfile?: boolean;
  workspaces?: 'all' | string[];
};

export type RemoveArguments = {
  packages: string[];
  directory?: string;
  workspaces?: 'all' | string[];
};

export type RunArguments = {
  directory?: string;
  script: string;
  additionalArgs?: string[];
  workspaces?: 'all' | string[];
};

/**
 * An abstract class that represents a package manager that acts as a base for
 * translating package management commands into package manager-specific
 * commands.
 */
export abstract class PackageManager {
  public abstract readonly command: string;

  constructor(public readonly cwd: string = process.cwd()) {}

  abstract add(args: AddArguments): Promise<void>;
  abstract install(args: InstallArguments): Promise<void>;
  abstract remove(args: RemoveArguments): Promise<void>;
  abstract run(args: RunArguments): Promise<void>;

  execute(args: string[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const commandString = `${this.command} ${args.join(' ')}`;

      console.log('Executing command: %s', commandString);

      const child = spawn(this.command, args, {
        cwd: this.cwd,
      });

      process.stdin.pipe(child.stdin);
      child.stdout.pipe(process.stdout);
      child.stderr.pipe(process.stderr);

      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Failed to execute command: ${commandString}`));
        }
      });
    });
  }
}
