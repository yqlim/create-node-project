import { runCommand } from '../../utils/index.js';

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

export type CleanArguments = {
  directory?: string;
  frozenLockfile?: boolean;
  workspaces?: 'all' | string[];
};

export type ExecArguments = {
  command: string;
  additionalArgs?: string[];
  directory?: string;
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
  protected abstract readonly command: string;

  constructor(public readonly cwd: string = process.cwd()) {}

  abstract add(args: AddArguments): Promise<void>;
  abstract clean(args: CleanArguments): Promise<void>;
  abstract exec(args: ExecArguments): Promise<void>;
  abstract remove(args: RemoveArguments): Promise<void>;
  abstract run(args: RunArguments): Promise<void>;

  protected async execute(args: string[]): Promise<void> {
    await runCommand(this.command, args);
  }
}
