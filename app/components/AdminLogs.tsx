"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { FiRefreshCw, FiFileText, FiAlertCircle, FiTerminal } from "react-icons/fi";

export default function AdminLogs() {
  const [logFiles, setLogFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [logContent, setLogContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLogFiles();
  }, []);

  useEffect(() => {
    if (selectedFile) {
      fetchLogContent(selectedFile);
    } else {
      setLogContent("");
    }
  }, [selectedFile]);

  const fetchLogFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get("/logs/files");
      setLogFiles(data);
      if (data.length > 0 && !selectedFile) {
        setSelectedFile(data[0]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch log files");
    } finally {
      setLoading(false);
    }
  };

  const fetchLogContent = async (filename: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get(`/logs/content/${filename}`);
      setLogContent(data.content);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch log content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <FiTerminal className="text-purple-500" />
          System Logs
        </h2>
        <button
          onClick={fetchLogFiles}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 rounded-lg transition-colors border border-purple-500/20"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
          <FiAlertCircle />
          <span>{error}</span>
        </div>
      )}

      <div className="flex gap-6 h-[calc(100vh-200px)]">
        {/* Sidebar: Log Files */}
        <div className="w-1/4 bg-neutral-900/50 border border-white/10 rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/10 bg-black/20">
            <h3 className="font-semibold text-gray-300">Available Logs</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {logFiles.length === 0 && !loading && (
              <p className="text-sm text-gray-500 p-4 text-center">No log files found.</p>
            )}
            {logFiles.map((file) => (
              <button
                key={file}
                onClick={() => setSelectedFile(file)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm text-left ${
                  selectedFile === file
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <FiFileText className="shrink-0" />
                <span className="truncate">{file}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content: Log Viewer */}
        <div className="w-3/4 bg-black border border-white/10 rounded-xl overflow-hidden flex flex-col relative">
          <div className="p-4 border-b border-white/10 bg-neutral-900/50 flex items-center justify-between">
            <h3 className="font-semibold text-gray-300 flex items-center gap-2">
              <FiFileText />
              {selectedFile || "Select a log file"}
            </h3>
            {loading && <div className="text-xs text-purple-400 animate-pulse">Loading...</div>}
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-[#0a0a0a]">
            {logContent ? (
              <pre className="text-xs font-mono text-green-400 whitespace-pre-wrap break-words">
                {logContent}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-600">
                <FiTerminal size={48} className="mb-4 opacity-20" />
                <p className="font-mono text-xs uppercase tracking-widest">
                  No_Content_To_Display
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
