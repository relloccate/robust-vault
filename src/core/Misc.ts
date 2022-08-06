import { shell } from 'electron';
import { parse, resolve } from 'path';

export const parsePath = (path: string) => {
    const { name, base, ext: extension, dir: directory } = parse(path);

    return {
        path,
        name,
        base,
        extension,
        directory
    };
};

export const resolvePath = segments => resolve(segments);

export const bytesToSize = (bytes: number) => {
    if (bytes === 0) {
        return {
            size: 0,
            mark: 'B'
        };
    }

    const marks = ['B', 'KB', 'MB', 'GB', 'TB'];
    const size = Math.floor(Math.log(bytes) / Math.log(1024));

    return {
        size: Number((bytes / Math.pow(1024, size)).toFixed(2)),
        mark: marks[size]
    };
};

export const showInExplorer = (fullPath: string, isDirectory: boolean) => {
    if (isDirectory) {
        shell.openPath(fullPath);
    } else {
        shell.showItemInFolder(fullPath);
    }
};

export const openLink = (url: PointerEvent | string) => {
    if (url instanceof PointerEvent) {
        url.preventDefault();

        if (url.target?.href) shell.openExternal(url.target.href);
    } else {
        shell.openExternal(url);
    }
};
