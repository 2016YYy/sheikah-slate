import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';
import { toast } from 'sonner';

const APP_VERSION = 'v1.0.0';
const REPO_OWNER = '2016YYy';
const REPO_NAME = 'sheikah-slate';

export type DownloadStatus =
  | 'idle'
  | 'checking'
  | 'downloading'
  | 'paused'
  | 'done'
  | 'error'
  | 'cancelled';

export interface UpdateInfo {
  hasUpdate: boolean;
  latest: string;
  body?: string;
  htmlUrl?: string;
  apkAsset?: {
    name: string;
    size: number;
    downloadUrl: string;
  };
}

export interface DownloadState {
  status: DownloadStatus;
  progress: number; // 0-100
  downloadedBytes: number;
  totalBytes: number;
  speed: number; // bytes per second
  localPath?: string;
  error?: string;
}

interface UpdateContextValue {
  updateInfo: UpdateInfo | null;
  download: DownloadState;
  isAndroid: boolean;
  checkForUpdate: () => Promise<void>;
  startDownload: (url: string) => void;
  cancelDownload: () => void;
  installUpdate: () => Promise<void>;
  clearUpdate: () => void;
}

const UpdateContext = createContext<UpdateContextValue | null>(null);

const INITIAL_DOWNLOAD: DownloadState = {
  status: 'idle',
  progress: 0,
  downloadedBytes: 0,
  totalBytes: 0,
  speed: 0,
};

function parseVersion(v: string): number[] {
  return v
    .replace(/^v/i, '')
    .split('.')
    .map((n) => parseInt(n, 10) || 0);
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export { formatBytes };

export function UpdateProvider({ children }: { children: ReactNode }) {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [download, setDownload] = useState<DownloadState>(INITIAL_DOWNLOAD);
  const abortRef = useRef<AbortController | null>(null);
  const isAndroid = Capacitor.getPlatform() === 'android';

  const checkForUpdate = useCallback(async () => {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`,
        { headers: { Accept: 'application/vnd.github+json' } },
      );
      if (!res.ok) {
        setUpdateInfo({ hasUpdate: false, latest: APP_VERSION });
        return;
      }
      const data = await res.json();
      const latest = data.tag_name || '';
      const currentNum = parseVersion(APP_VERSION);
      const latestNum = parseVersion(latest);
      const hasUpdate = latestNum > currentNum;

      // 查找 APK 资源
      const apkAsset = (data.assets || []).find(
        (a: any) =>
          a.name &&
          (a.name.endsWith('.apk') || a.name.includes('apk')),
      );

      setUpdateInfo({
        hasUpdate,
        latest: latest || APP_VERSION,
        body: data.body || '',
        htmlUrl: data.html_url,
        apkAsset: apkAsset
          ? {
              name: apkAsset.name,
              size: apkAsset.size,
              downloadUrl: apkAsset.browser_download_url,
            }
          : undefined,
      });
    } catch {
      setUpdateInfo({ hasUpdate: false, latest: APP_VERSION });
    }
  }, []);

  const startDownload = useCallback(
    (url: string) => {
      if (download.status === 'downloading') return;

      const controller = new AbortController();
      abortRef.current = controller;

      setDownload({
        ...INITIAL_DOWNLOAD,
        status: 'downloading',
      });

      let lastTime = Date.now();
      let lastBytes = 0;

      fetch(url, { signal: controller.signal })
        .then(async (res) => {
          if (!res.ok) throw new Error(`下载失败: HTTP ${res.status}`);

          const contentLength = res.headers.get('content-length');
          const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;
          const reader = res.body?.getReader();
          if (!reader) throw new Error('无法读取响应流');

          const chunks: Uint8Array[] = [];
          let downloadedBytes = 0;

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            downloadedBytes += value.length;

            const now = Date.now();
            const elapsed = (now - lastTime) / 1000;
            let speed = 0;
            if (elapsed > 0.3) {
              speed = (downloadedBytes - lastBytes) / elapsed;
              lastTime = now;
              lastBytes = downloadedBytes;
            }

            const progress =
              totalBytes > 0
                ? Math.min(100, Math.round((downloadedBytes / totalBytes) * 100))
                : 0;

            setDownload((prev) => ({
              ...prev,
              downloadedBytes,
              totalBytes,
              progress,
              speed,
            }));
          }

          // 合并所有数据块
          const blob = new Blob(chunks as BlobPart[], { type: 'application/vnd.android.package-archive' });
          return blob;
        })
        .then(async (blob) => {
          // 保存到文件系统
          if (isAndroid) {
            const fileName = `sheikah-slate-update.apk`;
            try {
              // 转换 Blob 为 base64
              const base64 = await blobToBase64(blob);
              const result = await Filesystem.writeFile({
                path: fileName,
                data: base64,
                directory: Directory.Cache,
                recursive: true,
              });
              setDownload((prev) => ({
                ...prev,
                status: 'done',
                progress: 100,
                downloadedBytes: prev.totalBytes || blob.size,
                speed: 0,
                localPath: result.uri,
              }));
              toast.success('更新包下载完成，点击安装');
            } catch (e) {
              throw new Error('保存更新包失败');
            }
          } else {
            // Web 环境：直接触发浏览器下载
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'sheikah-slate-update.apk';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
            setDownload((prev) => ({
              ...prev,
              status: 'done',
              progress: 100,
              speed: 0,
            }));
            toast.success('更新包已开始下载');
          }
        })
        .catch((err) => {
          if (err.name === 'AbortError') {
            setDownload((prev) => ({ ...prev, status: 'cancelled' }));
            return;
          }
          setDownload((prev) => ({
            ...prev,
            status: 'error',
            error: err.message || '下载失败',
          }));
          toast.error(err.message || '下载失败');
        });
    },
    [download.status, isAndroid],
  );

  const cancelDownload = useCallback(() => {
    abortRef.current?.abort();
    setDownload((prev) => ({ ...prev, status: 'cancelled' }));
  }, []);

  const installUpdate = useCallback(async () => {
    if (!download.localPath) {
      toast.error('未找到更新包');
      return;
    }
    try {
      await FileOpener.open({
        filePath: download.localPath,
        contentType: 'application/vnd.android.package-archive',
      });
    } catch (e: any) {
      toast.error('无法打开安装包，请手动安装');
    }
  }, [download.localPath]);

  const clearUpdate = useCallback(() => {
    setUpdateInfo(null);
    setDownload(INITIAL_DOWNLOAD);
  }, []);

  // 清理：组件卸载时取消下载
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  return (
    <UpdateContext.Provider
      value={{
        updateInfo,
        download,
        isAndroid,
        checkForUpdate,
        startDownload,
        cancelDownload,
        installUpdate,
        clearUpdate,
      }}
    >
      {children}
    </UpdateContext.Provider>
  );
}

export function useUpdate() {
  const ctx = useContext(UpdateContext);
  if (!ctx) {
    throw new Error('useUpdate must be used within UpdateProvider');
  }
  return ctx;
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // 去掉 data:...;base64, 前缀
      const base64 = result.split(',')[1] || result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
