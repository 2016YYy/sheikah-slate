import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Github,
  RefreshCw,
  Shield,
  Database,
  Heart,
  BookOpen,
  Download,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useUpdate, formatBytes } from '@/hooks/use-update';

const APP_VERSION = 'v1.0.0';
const REPO_OWNER = '2016YYy';
const REPO_NAME = 'sheikah-slate';
const REPO_URL = `https://github.com/${REPO_OWNER}/${REPO_NAME}`;

export default function AboutPage() {
  const { updateInfo, download, isAndroid, checkForUpdate, startDownload, cancelDownload, installUpdate } =
    useUpdate();
  const [dialogOpen, setDialogOpen] = useState(false);

  // 自动检查更新（仅在进入关于页时）
  useEffect(() => {
    if (!updateInfo) {
      checkForUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheck = () => {
    setDialogOpen(true);
    checkForUpdate();
  };

  const handleDownload = () => {
    if (updateInfo?.apkAsset?.downloadUrl) {
      startDownload(updateInfo.apkAsset.downloadUrl);
    }
  };

  const downloading = download.status === 'downloading';
  const downloadDone = download.status === 'done';

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-4 md:py-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-6 md:py-10"
      >
        <div className="inline-flex items-center justify-center w-20 h-24 mb-5">
          <svg viewBox="0 0 32 36" className="w-20 h-24 text-primary drop-shadow-[0_0_12px_rgba(34_211_238_/_0.5)]">
            <path d="M16 0L31 9v18L16 36 1 27V9L16 0z" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="16" cy="18" r="4" fill="currentColor" />
            <circle cx="16" cy="18" r="7" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          </svg>
        </div>
        <h1 className="font-display text-3xl font-bold tracking-wide mb-2">希卡石板</h1>
        <p className="font-display text-xs tracking-[0.35em] text-primary/80 mb-3">SHEIKAH SLATE</p>
        <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed mb-6">
          塞尔达传说：旷野之息 — 完全离线的海拉鲁图鉴数据库与攻略助手
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap mb-8">
          <Badge variant="outline" className="font-display">
            {APP_VERSION}
          </Badge>
          <Button variant="secondary" size="sm" onClick={handleCheck} disabled={downloading}>
            <RefreshCw className={`w-4 h-4 mr-1.5 ${downloading ? 'animate-spin' : ''}`} />
            {updateInfo?.hasUpdate ? '发现新版本' : '检查更新'}
          </Button>
          <Button variant="secondary" size="sm" asChild>
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
              <Github className="w-4 h-4 mr-1.5" /> GitHub
            </a>
          </Button>
        </div>
      </motion.div>

      {/* 发现新版本时的内联更新卡片 */}
      {updateInfo?.hasUpdate && (
        <Card className="border-primary/40 bg-primary/[0.04] sheikah-glow mb-4">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-primary/15 text-primary shrink-0">
                <Download className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-display font-semibold">发现新版本 {updateInfo.latest}</h3>
                  <Badge variant="outline" className="text-[10px]">
                    当前 {APP_VERSION}
                  </Badge>
                </div>
                {updateInfo.body && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3 whitespace-pre-wrap">
                    {updateInfo.body}
                  </p>
                )}

                {/* 下载进度 */}
                {(downloading || downloadDone) && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1.5 text-xs">
                      <span className="text-muted-foreground">
                        {downloading ? '下载中...' : downloadDone ? '下载完成' : ''}
                      </span>
                      <span className="font-display tabular-nums text-primary">
                        {download.progress}%
                      </span>
                    </div>
                    <Progress value={download.progress} className="h-2" />
                    <div className="flex items-center justify-between mt-1.5 text-[11px] text-muted-foreground font-display tabular-nums">
                      <span>
                        {formatBytes(download.downloadedBytes)} /{' '}
                        {download.totalBytes > 0 ? formatBytes(download.totalBytes) : '...'}
                      </span>
                      {downloading && download.speed > 0 && (
                        <span>{formatBytes(download.speed)}/s</span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 flex-wrap">
                  {!downloading && !downloadDone && (
                    <>
                      {isAndroid && updateInfo.apkAsset ? (
                        <Button size="sm" onClick={handleDownload}>
                          <Download className="w-4 h-4 mr-1.5" />
                          立即下载 ({formatBytes(updateInfo.apkAsset.size)})
                        </Button>
                      ) : (
                        <Button size="sm" asChild>
                          <a
                            href={updateInfo.htmlUrl || REPO_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4 mr-1.5" />
                            前往 GitHub 下载
                          </a>
                        </Button>
                      )}
                    </>
                  )}
                  {downloading && (
                    <Button variant="secondary" size="sm" onClick={cancelDownload}>
                      取消下载
                    </Button>
                  )}
                  {downloadDone && download.localPath && (
                    <Button size="sm" onClick={installUpdate}>
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      安装更新
                    </Button>
                  )}
                  {downloading && (
                    <span className="text-xs text-muted-foreground">
                      下载在后台进行，可继续浏览其他页面
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <Card className="border-border/60 bg-card/50">
          <CardContent className="p-5">
            <h2 className="font-display text-base font-semibold mb-3 flex items-center gap-2">
              <Database className="w-4 h-4 text-primary" /> 数据内容
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              <DataItem label="武器图鉴" value="131 件" />
              <DataItem label="防具图鉴" value="89 件" />
              <DataItem label="怪物图鉴" value="68 种" />
              <DataItem label="料理食谱" value="94 道" />
              <DataItem label="材料图鉴" value="100 种" />
              <DataItem label="神庙" value="120 座" />
              <DataItem label="高塔 / 回忆" value="15 + 14" />
              <DataItem label="任务攻略" value="133 项" />
              <DataItem label="攻略手册" value="6 册" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/50">
          <CardContent className="p-5">
            <h2 className="font-display text-base font-semibold mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-accent" /> 功能特性
            </h2>
            <ul className="space-y-2 text-sm text-foreground/85 leading-relaxed">
              <li>· 完全离线运行，无需联网即可查阅全部数据</li>
              <li>· 打勾记录收集进度，localStorage 本地持久化</li>
              <li>· 分类筛选、关键词搜索、收藏夹</li>
              <li>· 神庙 / 高塔 / 回忆 / 任务 / 克洛格全进度统计</li>
              <li>· 应用内检查更新，支持下载进度条与后台下载更新</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/50">
          <CardContent className="p-5">
            <h2 className="font-display text-base font-semibold mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-success" /> 免责声明
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                本项目为<b className="text-foreground">粉丝自制的非商业学习交流工具</b>（Fan-made / Unofficial），
                与任天堂（Nintendo）无任何关联，未经任天堂认可。
              </p>
              <p>
                《塞尔达传说》《旷野之息》（The Legend of Zelda: Breath of the Wild）等商标，
                以及游戏内的名称、图像、地图、角色、音乐等所有素材的版权，
                均归任天堂及其版权所有者所有。
              </p>
              <p>
                本应用内的攻略与图鉴数据基于网络公开资料自行整理，仅供参考；
                内容仅供个人学习交流使用，请支持正版游戏。
              </p>
              <p>
                如本应用内容涉及侵权，请联系维护者，我们将及时删除相关内容。
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/50">
          <CardContent className="p-5">
            <h2 className="font-display text-base font-semibold mb-3 flex items-center gap-2">
              <Heart className="w-4 h-4 text-accent" /> 关于
            </h2>
            <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
              <p>
                希卡石板（Sheikah Slate）是一款面向《塞尔达传说：旷野之息》玩家的离线图鉴与攻略工具，
                灵感源自游戏中的希卡石板。愿它陪伴你在海拉鲁的每一次冒险。
              </p>
              <Separator className="my-3" />
              <p className="text-xs">
                开源仓库：
                <Link to={REPO_URL} className="text-primary hover:underline">
                  {REPO_URL}
                </Link>
                <br />
                版本 {APP_VERSION} · MIT License · 数据基于公开资料整理
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 检查更新对话框 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">检查更新</DialogTitle>
            <DialogDescription>
              {updateInfo?.hasUpdate ? '发现新版本！' : '当前已是最新版本'}
            </DialogDescription>
          </DialogHeader>
          {updateInfo && (
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-lg bg-muted/40 p-3">
                <span className="text-muted-foreground">当前版本</span>
                <span className="font-display font-semibold">{APP_VERSION}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-primary/10 border border-primary/20 p-3">
                <span className="text-primary">最新版本</span>
                <span className="font-display font-semibold text-primary">{updateInfo.latest}</span>
              </div>
              {updateInfo.body && (
                <div className="max-h-40 overflow-y-auto rounded-lg bg-muted/30 p-3 text-xs text-muted-foreground whitespace-pre-wrap">
                  {updateInfo.body}
                </div>
              )}
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>
              关闭
            </Button>
            {updateInfo?.hasUpdate && (
              <Button asChild>
                <a href={updateInfo.htmlUrl || REPO_URL} target="_blank" rel="noopener noreferrer">
                  前往 GitHub
                </a>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DataItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/30 p-2.5">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className="font-display font-semibold text-sm">{value}</div>
    </div>
  );
}
