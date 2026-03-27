import React, { useState } from 'react';
import JSZip from 'jszip';
import { DownloadSimple, Check, FileArrowDown, Spinner } from '@phosphor-icons/react';
import { TUTORIAL_FILES, getProjectFiles } from '../projectFiles';

// Component for downloading a single file (inserted into code blocks)
export const DownloadFileButton = ({ filename }: { filename: string }) => {
  const [downloaded, setDownloaded] = useState(false);

  const fileData = TUTORIAL_FILES[filename];
  if (!fileData) return null;

  const handleDownload = () => {
    try {
      // Create blob and download
      const blob = new Blob([fileData.content], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileData.label;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Show success state briefly
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    } catch (err) {
      console.error('Download failed', err);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 px-3 py-1.5 mt-2 mb-6 text-sm font-medium rounded-lg 
                 bg-white/5 hover:bg-white/10 text-emerald-400 hover:text-emerald-300 
                 border border-emerald-500/20 hover:border-emerald-500/40 transition-all group"
      title="Download file"
    >
      {downloaded ? (
        <Check className="w-4 h-4 text-emerald-400" weight="bold" />
      ) : (
        <FileArrowDown className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" weight="bold" />
      )}
      {downloaded ? 'Downloaded!' : 'Download file'}
    </button>
  );
};

// Component for the hero section to download the entire complete project ZIP
export const DownloadProjectButton = () => {
  const [status, setStatus] = useState<'idle' | 'zipping' | 'success'>('idle');

  const handleDownloadComplete = async () => {
    setStatus('zipping');
    
    try {
      const zip = new JSZip();
      
      // Get all the completed project files (with .env configuration)
      const projectFiles = getProjectFiles();
      
      // Add all files to a root "bot-a-thon-project" folder
      const folder = zip.folder('bot-a-thon-project');
      if (!folder) throw new Error("Could not create ZIP folder");

      Object.entries(projectFiles).forEach(([filename, content]) => {
        folder.file(filename, content);
      });

      // Generate the zip file
      const blob = await zip.generateAsync({ type: 'blob' });
      
      // Trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'bot-a-thon-project.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error('Failed to create ZIP', err);
      setStatus('idle');
    }
  };

  return (
    <button 
      onClick={handleDownloadComplete}
      disabled={status === 'zipping'}
      className="hero-button-secondary relative overflow-hidden group border-emerald-500/30 hover:border-emerald-500/60"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {status === 'idle' && (
        <>
          <DownloadSimple className="w-4 h-4 text-emerald-400" weight="bold" />
          <span className="text-white">Download Complete Project (ZIP)</span>
        </>
      )}
      
      {status === 'zipping' && (
        <>
          <Spinner className="w-4 h-4 text-emerald-400 animate-spin" weight="bold" />
          <span className="text-white">Preparing ZIP...</span>
        </>
      )}
      
      {status === 'success' && (
        <>
          <Check className="w-4 h-4 text-emerald-400" weight="bold" />
          <span className="text-emerald-400">Downloaded Successfully!</span>
        </>
      )}
    </button>
  );
};
