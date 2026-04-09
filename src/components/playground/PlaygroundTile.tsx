import { ReactNode, useState } from "react";

const titleHeight = 32;

type PlaygroundTileProps = {
  title?: string;
  children?: ReactNode;
  className?: string;
  childrenClassName?: string;
  padding?: boolean;
  backgroundColor?: string;
};

export type PlaygroundTab = {
  title: string;
  content: ReactNode;
};

export type PlaygroundTabbedTileProps = {
  tabs: PlaygroundTab[];
  initialTab?: number;
} & PlaygroundTileProps;

export const PlaygroundTile: React.FC<PlaygroundTileProps> = ({
  children,
  title,
  className,
  childrenClassName,
  padding = true,
  backgroundColor = "transparent",
}) => {
  const contentPadding = padding ? 4 : 0;
  return (
    <div
      className={`flex flex-col border border-white/10 rounded-[32px] text-gray-400 bg-[#0A0A0A]/60 backdrop-blur-2xl overflow-hidden shadow-2xl transition-all duration-300 ${className}`}
    >
      {title && (
        <div
          className="flex items-center justify-center text-[10px] uppercase py-3 border-b border-b-white/5 tracking-[0.2em] font-bold text-white/40"
          style={{
            height: `${titleHeight}px`,
          }}
        >
          <h2>{title}</h2>
        </div>
      )}
      <div
        className={`flex flex-col items-center grow w-full ${childrenClassName}`}
        style={{
          height: `calc(100% - ${title ? titleHeight + "px" : "0px"})`,
          padding: `${contentPadding * 4}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const PlaygroundTabbedTile: React.FC<PlaygroundTabbedTileProps> = ({
  tabs,
  initialTab = 0,
  className,
  childrenClassName,
  backgroundColor = "transparent",
}) => {
  const contentPadding = 4;
  const [activeTab, setActiveTab] = useState(initialTab);
  if (activeTab >= tabs.length) {
    return null;
  }
  return (
    <div
    <div
      className={`flex flex-col h-full border border-white/10 rounded-[32px] text-gray-400 bg-[#0A0A0A]/60 backdrop-blur-2xl overflow-hidden shadow-2xl transition-all duration-300 ${className}`}
    >
      <div
        className="flex items-center justify-start text-[10px] uppercase border-b border-b-white/5 tracking-[0.2em] font-bold text-white/40"
        style={{
          height: `${titleHeight}px`,
        }}
      >
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`px-6 py-2 transition-all border-r border-r-white/5 ${
              index === activeTab
                ? `bg-white/5 text-white shadow-inner`
                : `bg-transparent text-white/30 hover:text-white/60 hover:bg-white/[0.02]`
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div
        className={`w-full ${childrenClassName}`}
        style={{
          height: `calc(100% - ${titleHeight}px)`,
          padding: `${contentPadding * 4}px`,
        }}
      >
        {tabs[activeTab].content}
      </div>
    </div>
  );
};
