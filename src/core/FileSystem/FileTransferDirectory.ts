import FileTransferBase from './FileTransferBase';
import FileList from './FileList';
import { parse, resolve } from 'path';
import type { NextPath } from './FileTransferBase';

export default class FileTransferDirectory extends FileTransferBase {
    protected getNextPath = (from: string, to: string): NextPath => {
        const { name, ext } = parse(from);

        return {
            directory: resolve(to),
            fullPath: resolve(to, name + ext)
        };
    };

    protected copyDirectory = async (from: string, to: string, isFirst: boolean = false) => {
        try {
            const { base } = parse(from);
            const files = await FileList.getDirectoryFiles(from);
            const pathTo = isFirst ? to + '/' : to + '/' + base + '/';

            for await (const file of files) {
                try {
                    if (this.stopped) {
                        break;
                    }

                    if (!this.isBlackListed(file.name, file.isDirectory)) {
                        if (file.isDirectory) {
                            await this.copyDirectory(file.fullPath, pathTo);
                            this.updateStats(null, 'passed', 'folders');
                        } else {
                            const nextPath = this.getNextPath(file.fullPath, pathTo);
                            const isTheSame = await this.isFilesTheSame(file.stat, nextPath.fullPath);

                            if (!isTheSame) {
                                await this.copyFile(file.fullPath, nextPath);
                                this.updateStats(file.stat, 'transfered', 'files');
                                this.lastFile.transfered = nextPath.fullPath;
                            }

                            this.updateStats(file.stat, 'passed', 'files');
                            this.lastFile.passed = file.fullPath;
                        }
                    }
                } catch (error: any) {
                    if (error?.message) {
                        this.writeError(this.data.added, error.message);
                    }
                }
            }
        } catch (error: any) {
            if (error?.message) {
                this.writeError(this.data.added, error.message);
            }
        }
    };

    transfer = () => {
        this.preTransfer(async (from: string, to: string) => {
            await this.copyDirectory(from, to, true);
        });
    };
}
