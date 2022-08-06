import FileTransferBase from './FileTransferBase';
import { parse, resolve } from 'path';
import { stat } from 'fs/promises';
import type { NextPath } from './FileTransferBase';

export default class FileTransferSingle extends FileTransferBase {
    protected getNextPath = (from: string, to: string): NextPath => {
        const { name, ext } = parse(from);
        const { dir } = parse(to);

        return {
            directory: resolve(dir),
            fullPath: resolve(dir, name + ext)
        };
    };

    transfer = () => {
        this.preTransfer(async (from: string, to: string) => {
            const nextPath = this.getNextPath(from, to);
            const fileStat = await stat(from);
            const isTheSame = await this.isFilesTheSame(fileStat, nextPath.fullPath);

            if (!isTheSame) {
                await this.copyFile(from, nextPath);
                this.updateStats(fileStat, 'transfered', 'files');
                this.lastFile.transfered = to;
            }

            this.updateStats(fileStat, 'passed', 'files');
            this.lastFile.passed = from;
        });
    };
}
