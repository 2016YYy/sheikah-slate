import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, RefreshCw, ShieldAlert, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const APP_VERSION = 'v1.0.0';
const REPO = '2016YYy/sheikah-slate';
const RELEASE_API = `https://api.github.com/repos/${REPO}/releases/latest`;

type UpdateState =
  | { status: 'idle' }
  | { status: 'checking' }
  | { status: 'latest' }
  | { status: 'update'; version: string; notes: string; url: string }
  | { status: 'error' };

export default function AboutPage() {
  const navigate = useNavigate();
  const [update, setUpdate] = useState<UpdateState>({ status: 'idle' });

  const checkUpdate = async () => {
    setUpdate({ status: 'checking' });
    try {
      const res = await fetch(RELEASE_API, { cache: 'no-store' });
      if (!res.ok) throw new Error('request failed');
      const data = await res.json();
      const latest = (data.tag_name || '').replace(/^v/, '');
      const current = APP_VERSION.replace(/^v/, '');
      if (latest && latest !== current) {
        setUpdate({
          status: 'update',
          version: data.tag_name,
          notes: data.body || '',
          url: data.html_url || `https://github.com/${REPO}/releases`,
        });
      } else {
        setUpdate({ status: 'latest' });
      }
    } catch {
      setUpdate({ status: 'error' });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      checkUpdate();
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <header className="mb-6">
        <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground text-sm mb-3 inline-flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" /> 返回
        </button>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">关于希卡石板</h1>
      </header>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-4">
        <div className="text-center py-6">
          <div className="w-20 h-24 mx-auto mb-4 relative">
            <svg viewBox="0 0 80 96" className="w-20 h-24 text-primary drop-shadow-[0_0_18px_rgba(34_211_238_/_0.5)]">
              <path d="M40 4L76 24v48L40 92 4 72V24L40 4z" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="40" cy="48" r="9" fill="currentColor" />
              <circle cx="40" cy="48" r="16" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
            </svg>
          </div>
          <h2 className="font-display text-xl font-bold text-foreground">希卡石板</h2>
          <p className="text-sm text-primary tracking-[0.3em] font-display">SHEIKAH SLATE</p>
          <p className="text-xs text-muted-foreground mt-2">版本 {APP_VERSION} · 完全离线可用</p>
        </div>

        <div className="rounded-lg border border-border/40 bg-card/40 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-primary" /> 检查更新
            </h3>
            <Badge variant={update.status === 'update' ? 'destructive' : update.status === 'latest' ? 'success' : 'outline'} className="text-[10px]">
              {update.status === 'checking' && '检查中…'}
              {update.status === 'latest' && '已是最新'}
              {update.status === 'update' && '发现新版本'}
              {update.status === 'error' && '离线模式'}
              {update.status === 'idle' && '未检查'}
            </Badge>
          </div>
          {update.status === 'checking' && <p className="text-xs text-muted-foreground">正在连接希卡塔…</p>}
          {update.status === 'error' && (
            <p className="text-xs text-muted-foreground">当前处于离线状态，无法检查更新。离线模式不受影响。</p>
          )}
          {update.status === 'latest' && <p className="text-xs text-muted-foreground">已经是最新版本，勇者无需担心。</p>}
          {update.status === 'update' && (
            <div>
              <p className="text-sm text-foreground mb-1">发现新版本 {update.version}</p>
              <p className="text-xs text-muted-foreground whitespace-pre-line mb-3">{update.notes}</p>
              <Button asChild size="sm" className="gap-1.5">
                <a href={update.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3.5 h-3.5" /> 前往下载
                </a>
              </Button>
            </div>
          )}
          <Button variant="outline" size="sm" className="mt-3" onClick={checkUpdate} disabled={update.status === 'checking'}>
            <RefreshCw className={cn('w-3.5 h-3.5', update.status === 'checking' && 'animate-spin')} /> 手动检查
          </Button>
        </div>

        <div className="rounded-lg border border-border/40 bg-card/40 p-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
            <Github className="w-4 h-4 text-primary" /> 开源项目
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            本项目开源于 GitHub，使用 MIT 许可证。欢迎提交 Issue 与建议。
          </p>
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <a href={`https://github.com/${REPO}`} target="_blank" rel="noopener noreferrer">
              <Github className="w-3.5 h-3.5" /> 访问仓库
            </a>
          </Button>
        </div>

        <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
          <h3 className="text-sm font-semibold text-warning flex items-center gap-2 mb-2">
            <ShieldAlert className="w-4 h-4" /> 免责声明
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            本项目为粉丝自制的非商业学习交流工具（Fan-made / Unofficial），与任天堂无任何关联，未经任天堂认可。
            《塞尔达传说》《旷野之息》（The Legend of Zelda: Breath of the Wild）等商标与游戏内所有素材（名称、图像、地图、角色等）版权归任天堂及其版权所有者所有。
            本项目数据基于网络公开资料整理，仅供个人学习交流使用，请支持正版游戏。如涉及侵权请告知，将及时删除相关内容。
          </p>
        </div>
      </motion.div>
    </div>
  );
}
