import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { 
  TerminalWindow, 
  CaretDown,
  List, 
  X,
  Sparkle,
  ArrowRight,
  Copy,
  Check,
  Lightning,
  Brain,
  DiceThree,
  CodeBlock as CodeBlockIcon,
  Robot,
  RocketLaunch
} from '@phosphor-icons/react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import confetti from 'canvas-confetti';
import { cn } from './lib/utils';
import { NAV_ITEMS } from './constants';
import { PHASE_1_CONTENT } from './content/phase1';
import { PHASE_2_CONTENT } from './content/phase2';
import { PHASE_3_CONTENT } from './content/phase3';
import IdeaGenerator from './components/IdeaGenerator';
import GradualBlur from './GradualBlur';
import { DownloadProjectButton, DownloadFileButton } from './components/DownloadButton';
import TextType from './TextType';

const PHASE_LABELS: Record<number, { title: string; icon: React.ReactNode }> = {
  1: { title: 'Phase 1: Terminal Bot', icon: <TerminalWindow weight="bold" /> },
  2: { title: 'Phase 2: Modifiers', icon: <Lightning weight="bold" /> },
  3: { title: 'Phase 3: Memory', icon: <Brain weight="bold" /> },
  4: { title: 'Phase 4: Idea Generator', icon: <DiceThree weight="bold" /> },
};

// Custom Code Block with Copy Button
const CodeBlock = ({ children, className }: any) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const lang = match ? match[1] : 'code';

  const extractText = (node: any): string => {
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (!node) return '';
    if (Array.isArray(node)) return node.map(extractText).join('');
    if (node.props && node.props.children) return extractText(node.props.children);
    return '';
  };

  const handleCopy = () => {
    const textToCopy = extractText(children);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-8">
      <div className="absolute top-0 right-0 p-3 pt-4 pr-4 z-10 flex items-center gap-3">
        <div className="code-lang-badge opacity-0 group-hover:opacity-100 transition-opacity">
          {lang}
        </div>
        <button 
          onClick={handleCopy}
          className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all backdrop-blur-sm border border-white/10"
          title="Copy code"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <pre className="code-block">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
};

export default function App() {
  const [currentView, setCurrentView] = useState<'intro' | 1 | 2 | 3 | 4>('intro');
  const [activeId, setActiveId] = useState('intro');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [collapsedPhases, setCollapsedPhases] = useState<Record<number, boolean>>({});
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Scroll spy relative to the current view
  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll('[data-nav-id]');
      let currentId = activeId;
      
      headings.forEach((heading) => {
        const top = heading.getBoundingClientRect().top;
        if (top < 200 && top > -100) {
          const id = heading.getAttribute('data-nav-id');
          if (id) currentId = id;
        }
      });
      
      const matched = NAV_ITEMS.find(item => item.id === currentId);
      if (matched && matched.id !== activeId) {
         setActiveId(matched.id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeId]);

  const navigateToView = (view: 'intro' | 1 | 2 | 3 | 4, sectionId?: string) => {
    if (view !== currentView) {
      setCurrentView(view);
      window.scrollTo(0, 0);
    }
    
    if (sectionId) {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      setActiveId(sectionId);
    } else {
      const topId = view === 'intro' ? 'intro' : `phase-${view}`;
      setActiveId(topId);
    }
    
    setIsSidebarOpen(false);
  };

  const togglePhase = (phase: number) => {
    setCollapsedPhases(prev => ({ ...prev, [phase]: !prev[phase] }));
  };

  const handleConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffffff', '#333333', '#666666']
    });
  };

  // Shared markdown components
  const markdownComponents = {
    h1: ({ children }: any) => {
      const id = children?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      return <h1 id={id} data-nav-id={id} className="scroll-mt-28">{children}</h1>;
    },
    h2: ({ children }: any) => {
      const id = children?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      return <h2 id={id} data-nav-id={id} className="scroll-mt-28">{children}</h2>;
    },
    h3: ({ children }: any) => {
      const id = children?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      return <h3 id={id} className="scroll-mt-28">{children}</h3>;
    },
    p: ({ children }: any) => {
      const hasBlockElement = React.Children.toArray(children).some(
        (child: any) => child?.type === 'video' || child?.type === 'img' || child?.type === 'div' || child?.type === DownloadFileButton
      );
      if (hasBlockElement) return <div className="my-8">{children}</div>;
      return <p>{children}</p>;
    },
    a: ({ href, children, ...props }: any) => {
      if (href?.startsWith('download:')) {
        const filename = href.replace('download:', '');
        return <DownloadFileButton filename={filename} />;
      }
      return <a href={href} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4 decoration-emerald-500/30 hover:decoration-emerald-400 transition-colors inline-flex items-center gap-1" {...props}>{children}</a>;
    },
    pre: ({ children }: any) => {
      const codeElement = React.Children.toArray(children)[0] as any;
      const className = codeElement?.props?.className || '';
      return <CodeBlock className={className}>{codeElement?.props?.children}</CodeBlock>;
    },
    code: ({ node, className, children, ...props }: any) => {
      const isInline = !node?.position?.start?.line || (node?.position?.start?.line === node?.position?.end?.line && !className?.includes('language-'));
      if (isInline && !className?.includes('language-')) {
        return (
          <code className="inline-code" {...props}>
            {children}
          </code>
        );
      }
      return (
        <code className={cn("text-sm font-mono leading-relaxed text-white/80", className)} {...props}>
          {children}
        </code>
      );
    },
    table: ({ children }: any) => (
      <div className="table-wrapper">
        <table>{children}</table>
      </div>
    ),
    img: ({ src, alt }: any) => (
      <div className="my-12 group">
        <img src={src} alt={alt} className="markdown-img" />
        {alt && <p className="img-caption">{alt}</p>}
      </div>
    ),
    video: ({ src, ...props }: any) => (
      <div className="my-12">
        <video src={src} {...props} className="markdown-video" />
      </div>
    )
  };

  const renderPhaseContent = (phase: number, content: string) => {
    if (currentView !== phase) return null;
    return (
      <motion.section 
        key={`phase-${phase}`}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        id={`phase-${phase}`} 
        data-nav-id={`phase-${phase}`} 
        className="scroll-mt-28"
      >
        <div className="markdown-body">
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={markdownComponents}
          >
            {content}
          </Markdown>
        </div>
        
        {/* Next/Prev Navigation Buttons */}
        <div className="mt-24 pt-10 border-t border-white/10 flex justify-between items-center">
           {phase > 1 ? (
             <button onClick={() => navigateToView((phase - 1) as 1|2|3|4)} className="hero-button-secondary text-xs">
                 ← Back to Phase {phase - 1}
             </button>
           ) : (
             <button onClick={() => navigateToView('intro')} className="hero-button-secondary text-xs">
                 ← Back to Intro
             </button>
           )}
           
           {phase < 4 ? (
             <button onClick={() => navigateToView((phase + 1) as 1|2|3|4)} className="hero-button-primary text-xs !py-3 !px-6">
                 Proceed to Phase {phase + 1} →
             </button>
           ) : null}
        </div>
      </motion.section>
    );
  };

  const introItems = NAV_ITEMS.filter(item => !item.phase);
  const phases = [1, 2, 3, 4];

  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-sans selection:bg-white selection:text-black">
      {/* Enhanced Visual Effects */}
      <div className="noise-overlay" />
      <div className="fixed inset-0 bg-grid pointer-events-none opacity-[0.15]" />
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden mix-blend-screen">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[150px] rounded-full animate-float" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[150px] rounded-full animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-emerald-500/5 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '8s' }} />
      </div>

      <motion.div 
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 z-[100] origin-left" 
        style={{ scaleX }} 
      />

      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur-2xl">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigateToView('intro')}>
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center transition-transform group-hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              <TerminalWindow className="w-5 h-5 text-black" weight="bold" />
            </div>
            <div className="flex flex-col">
              <span className="font-black tracking-tighter text-lg font-display leading-none">BOT-A-THON</span>
              <span className="text-[9px] font-bold tracking-[0.25em] text-white/40 uppercase">Documentation</span>
            </div>
          </div>

          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 text-white/70 hover:text-white transition-colors"
          >
            {isSidebarOpen ? <X weight="bold" /> : <List weight="bold" />}
          </button>
        </div>
      </header>

      <div className="flex-1 flex relative">
        {/* Sidebar */}
        <aside className={cn(
          "docs-sidebar",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          <div className="sidebar-inner">
            <nav className="sidebar-nav">
              {/* Intro */}
              {introItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigateToView('intro')}
                  className={cn(
                    "sidebar-link sidebar-link-top",
                    currentView === 'intro' && "sidebar-link-active"
                  )}
                >
                  {item.title}
                </button>
              ))}

              {/* Phase Groups */}
              {phases.map((phase) => {
                const phaseNum = phase as 1|2|3|4;
                const phaseItems = NAV_ITEMS.filter(item => item.phase === phase);
                const subItems = phaseItems.filter(item => item.level > 0);
                const isViewActive = currentView === phaseNum;
                // Auto-expand if active, otherwise use collapsed state
                const isExpanded = isViewActive || !collapsedPhases[phase];

                return (
                  <div key={phase} className="sidebar-phase-group">
                    <button
                      onClick={() => {
                        navigateToView(phaseNum);
                        if (!isExpanded) togglePhase(phase);
                      }}
                      className={cn(
                        "sidebar-link sidebar-link-top sidebar-phase-header",
                        isViewActive && "sidebar-link-active"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span>{PHASE_LABELS[phase]?.icon}</span>
                        <span>{PHASE_LABELS[phase]?.title}</span>
                      </span>
                      {subItems.length > 0 && (
                        <CaretDown weight="bold"
                          className={cn(
                            "w-3.5 h-3.5 text-white/30 transition-transform",
                            !isExpanded && "-rotate-90"
                          )}
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            togglePhase(phase);
                          }}
                        />
                      )}
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isExpanded && subItems.length > 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="sidebar-sub-items">
                            {subItems.map((item) => (
                              <button
                                key={item.id}
                                onClick={() => navigateToView(phaseNum, item.id)}
                                className={cn(
                                  "sidebar-link sidebar-link-sub",
                                  isViewActive && activeId === item.id && "sidebar-link-sub-active"
                                )}
                              >
                                {item.title}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            <div className="sidebar-status">
              <div className="text-[9px] font-bold text-white/30 uppercase mb-1.5">Hackathon</div>
              <div className="flex items-center gap-2 text-xs font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse box-shadow-glow" />
                Live & Active
              </div>
            </div>
          </div>
        </aside>

        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm transition-all"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="docs-content min-h-[80vh]">
            <AnimatePresence mode="wait">
              {currentView === 'intro' && (
                <motion.section 
                  key="intro"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  id="intro" 
                  data-nav-id="intro" 
                  className="hero-section pb-48"
                >
                  <div className="hero-badge">
                    <Sparkle className="w-3 h-3 text-white" weight="fill" />
                    Official Resource Hub
                  </div>
                  <h1 className="hero-title">
                    <TextType 
                      texts={[
                        "CONVERSATIONS ENGINEERED.",
                        "BUILD THE FUTURE.",
                        "CODE INTELLIGENCE."
                      ]}
                      typingSpeed={75}
                      pauseDuration={2000}
                      deletingSpeed={30}
                      showCursor={true}
                      cursorCharacter="|"
                      cursorBlinkDuration={0.6}
                    />
                  </h1>
                  <p className="hero-description text-lg max-w-2xl mt-6">
                    Welcome to the <span className="text-white font-medium">Bot-A-Thon</span>. 
                    Master AI APIs, memory persistence, and custom personas in under an hour to build award-winning intelligent chatbots.
                  </p>
                  <div className="flex flex-wrap gap-4 mt-8">
                    <button 
                      onClick={() => { navigateToView(1); handleConfetti(); }}
                      className="hero-button-primary hover:scale-105 transition-transform"
                    >
                      Start Workshop
                      <ArrowRight className="w-4 h-4" weight="bold" />
                    </button>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6 mt-20 relative z-10 w-full max-w-4xl opacity-80 hover:opacity-100 transition-opacity">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md">
                      <Robot className="w-8 h-8 text-emerald-400 mb-4" weight="duotone" />
                      <h3 className="text-white font-medium text-lg mb-2">Build Personas</h3>
                      <p className="text-white/60 text-sm">Create unique AI personalities using system prompts and temperature tuning.</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md">
                      <Brain className="w-8 h-8 text-blue-400 mb-4" weight="duotone" />
                      <h3 className="text-white font-medium text-lg mb-2">Add Memory</h3>
                      <p className="text-white/60 text-sm">Persist conversations to disk so your bots remember users between sessions.</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md">
                      <RocketLaunch className="w-8 h-8 text-purple-400 mb-4" weight="duotone" />
                      <h3 className="text-white font-medium text-lg mb-2">Deploy Fast</h3>
                      <p className="text-white/60 text-sm">Turn your terminal scripts into stunning web apps in minutes with Streamlit.</p>
                    </div>
                  </div>
                </motion.section>
              )}

              {renderPhaseContent(1, PHASE_1_CONTENT)}
              {renderPhaseContent(2, PHASE_2_CONTENT)}
              {renderPhaseContent(3, PHASE_3_CONTENT)}

              {currentView === 4 && (
                <motion.section 
                  key="phase-4"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  id="phase-4" 
                  data-nav-id="phase-4" 
                  className="pt-16 pb-32"
                >
                  <div className="markdown-body mb-8">
                     <h1 id="phase-4">Phase 4: The Hackathon</h1>
                     <p>You've completed the workshop! You now have the skills to build a functioning, intelligent chatbot with memory and custom personas. It's time to build your hackathon project.</p>
                  </div>
                     
                  <div className="mb-12 bg-white/[0.02] border border-white/10 rounded-xl p-8 text-center">
                    <h3 className="text-xl font-display font-medium text-white mb-3">Download Your Complete Setup</h3>
                    <p className="text-white/60 text-sm mb-6 max-w-2xl mx-auto">
                      Get the entire project ready to go! Includes 1-click installer and runners so you can focus on modifying the bots for your hackathon idea.
                    </p>
                    <DownloadProjectButton />
                  </div>
                  
                  <IdeaGenerator />
                </motion.section>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <footer className="docs-footer mt-auto relative z-[60]">
            <div className="flex items-center gap-3">
              <TerminalWindow className="w-4 h-4 text-white/40" weight="bold" />
              <span className="font-black tracking-tighter text-sm font-display text-white/40">BOT-A-THON</span>
            </div>
            <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.2em]">© 2026 Official Hackathon Hub</p>
          </footer>
          
          <div className="fixed bottom-0 right-0 left-0 lg:left-[280px] z-20 pointer-events-none">
            <GradualBlur
              target="parent"
              position="bottom"
              height="4rem"
              strength={2}
              divCount={15}
              curve="bezier"
              exponential
              opacity={1}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
