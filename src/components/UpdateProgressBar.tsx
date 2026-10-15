import { useUpdate, formatBytes } from '@/hooks/use-update';
import { Download, X, Check, Play, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function UpdateProgressBar() {
  const { download, cancelDownload, installUpdate } = useUpdate();

  const showBar =
    download.status === 'downloading' ||
    download.status === 'paused' ||
    download.status === 'done' ||
    download.status === 'error';

  return (
    <AnimatePresence>
      {showBar && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-0 left-0 right-0 z-[100] bg-background/95 backdrop-blur-md border-b border-primary/30"
        >
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-2.5">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                  download.status === 'downloading' && 'bg-primary/15 text-primary',
                  download.status === 'done' && 'bg-success/15 text-success',
                  download.status === 'error' && 'bg-destructive/15 text-destructive',
                )}
              >
                {download.status === 'downloading' && <Download className="w-4 h-4 animate-bounce" />}
                {download.status === 'done' && <Check className="w-4 h-4" />}
                {download.status === 'error' && <AlertCircle className="w-4 h-4" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium truncate">
                    {download.status === 'downloading' && '正在下载更新包...'}
                    {download.status === 'done' && '更新包下载完成'}
                    {download.status === 'error' && `下载失败：${download.error}`}
                  </span>
                  <span className="text-xs font-display tabular-nums text-primary ml-2 shrink-0">
                    {download.progress}%
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${download.progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                {(download.status === 'downloading' || download.status === 'done') && (
                  <div className="flex items-center justify-between mt-1 text-[10px] text-muted-foreground font-display tabular-nums">
                    <span>
                      {formatBytes(download.downloadedBytes)} /{' '}
                      {download.totalBytes > 0 ? formatBytes(download.totalBytes) : '...'}
                    </span>
                    {download.status === 'downloading' && download.speed > 0 && (
                      <span>{formatBytes(download.speed)}/s</span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {download.status === 'downloading' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={cancelDownload}
                    aria-label="取消下载"
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                )}
                {download.status === 'done' && download.localPath && (
                  <Button size="sm" className="h-7 text-xs" onClick={installUpdate}>
                    <Play className="w-3 h-3 mr-1" /> 安装
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
