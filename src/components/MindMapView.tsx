import React, { useState, useRef, useEffect } from "react";
import { ZoomIn, ZoomOut, Move, RotateCcw, Brain, ChevronRight, Sparkles, HelpCircle } from "lucide-react";
import { MindMapNode } from "../types";

interface MindMapViewProps {
  nodes: MindMapNode[];
}

interface CoordinatedNode extends MindMapNode {
  x: number;
  y: number;
  level: number;
}

export default function MindMapView({ nodes }: MindMapViewProps) {
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Set default selected node as the root node
  useEffect(() => {
    if (nodes && nodes.length > 0) {
      const root = nodes.find(n => !n.parentId || n.parentId === "root" || n.parentId === "null") || nodes[0];
      setSelectedNode(root);
    }
  }, [nodes]);

  if (!nodes || nodes.length === 0) {
    return (
      <div className="text-center py-12 bg-[#141414] rounded-2xl border border-white/5">
        <HelpCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <p className="text-gray-400 font-medium">No mind map nodes available for this session.</p>
      </div>
    );
  }

  // 1. Layout Engine: Compute coordinates dynamically based on hierarchy levels
  const LAYOUT_WIDTH = 800;
  const LAYOUT_HEIGHT = 450;

  // Identify levels
  const rootNode = nodes.find(n => !n.parentId || n.parentId === "root" || n.parentId === "null") || nodes[0];
  
  const level1Nodes = nodes.filter(n => n.parentId === rootNode.id);
  const level2Nodes = nodes.filter(n => n.parentId && n.parentId !== rootNode.id && n.id !== rootNode.id);

  const coordinates: Record<string, CoordinatedNode> = {};

  // Root Node coordinate (exact center-left)
  coordinates[rootNode.id] = {
    ...rootNode,
    x: 80,
    y: LAYOUT_HEIGHT / 2,
    level: 0
  };

  // Level 1 Nodes coordinates (distributed vertically in middle column)
  const l1Count = level1Nodes.length;
  level1Nodes.forEach((node, idx) => {
    // Spacer vertical formula
    const yCoord = l1Count > 1 
      ? 60 + (idx * (LAYOUT_HEIGHT - 120)) / (l1Count - 1)
      : LAYOUT_HEIGHT / 2;

    coordinates[node.id] = {
      ...node,
      x: 320,
      y: yCoord,
      level: 1
    };
  });

  // Level 2 Nodes coordinates (aligned near their parent vertically, pushed further right)
  // To avoid overlapping, let's group level 2 nodes by their parent
  const parentGroups: Record<string, MindMapNode[]> = {};
  level2Nodes.forEach(node => {
    if (node.parentId) {
      if (!parentGroups[node.parentId]) {
        parentGroups[node.parentId] = [];
      }
      parentGroups[node.parentId].push(node);
    }
  });

  // Space level 2 nodes vertically around their respective parent
  Object.entries(parentGroups).forEach(([pId, children]) => {
    const parentCoord = coordinates[pId];
    if (!parentCoord) return;

    const childCount = children.length;
    children.forEach((child, idx) => {
      // Space vertically centered relative to parent y coordinate
      const offset = childCount > 1 
        ? ((idx - (childCount - 1) / 2) * 75)
        : 0;
      
      // Clamp values to make sure they remain inside layout boundaries
      const targetY = Math.max(40, Math.min(LAYOUT_HEIGHT - 40, parentCoord.y + offset));

      coordinates[child.id] = {
        ...child,
        x: 580,
        y: targetY,
        level: 2
      };
    });
  });

  // Ensure any fallback nodes that weren't categorized get placed somewhere
  nodes.forEach(node => {
    if (!coordinates[node.id]) {
      coordinates[node.id] = {
        ...node,
        x: 450,
        y: 100,
        level: 1
      };
    }
  });

  // Generate Bezier Curves connecting lines
  const connections: Array<{ fromId: string; toId: string; d: string }> = [];
  nodes.forEach(node => {
    if (node.parentId && coordinates[node.id] && coordinates[node.parentId]) {
      const start = coordinates[node.parentId];
      const end = coordinates[node.id];
      // Cubic Bezier formatting curve
      const controlOffset = (end.x - start.x) / 1.7;
      const dPath = `M ${start.x} ${start.y} C ${start.x + controlOffset} ${start.y}, ${end.x - controlOffset} ${end.y}, ${end.x} ${end.y}`;
      connections.push({
        fromId: node.parentId,
        toId: node.id,
        d: dPath
      });
    }
  });

  // Zoom/Pan controllers
  const handleZoomIn = () => setZoom(z => Math.min(2.5, z + 0.15));
  const handleZoomOut = () => setZoom(z => Math.max(0.5, z - 0.15));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-4">
      {/* Visual Instruction Banner */}
      <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
            Visual Learning Canvas
          </h4>
          <span className="text-sm font-extrabold text-white flex items-center gap-1">
            <Brain className="w-4 h-4 text-indigo-400" /> Interactive Mind Map
          </span>
        </div>
        <p className="text-xs text-gray-400 hidden md:block">
          Select nodes below to zoom and review individual topic details in the study drawer.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: SVG Canvas viewport (3/4 width) */}
        <div className="lg:col-span-3 border border-white/5 bg-[#0A0A0A] rounded-3xl relative overflow-hidden h-[450px]">
          
          {/* Canvas Navigation Panel */}
          <div className="absolute top-4 left-4 z-10 flex gap-1 bg-[#141414]/90 p-1.5 rounded-xl border border-white/5 shadow-lg select-none backdrop-blur-sm">
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute bottom-4 left-4 z-10 text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-1 rounded select-none border border-white/5">
            Scale: {Math.round(zoom * 100)}% | Drag canvas to move
          </div>

          {/* Core SVG Canvas */}
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`w-full h-full select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
          >
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${LAYOUT_WIDTH} ${LAYOUT_HEIGHT}`}
              className="w-full h-full transition-transform duration-75"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: "center center"
              }}
            >
              <defs>
                {/* Connection links glowing grid filter */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                
                {/* Arrow markers */}
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="16"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#818cf8" />
                </marker>
              </defs>

              {/* DRAW CONNECTIONS (Links) */}
              {connections.map((conn, idx) => {
                const isSelectedPath = selectedNode && (selectedNode.id === conn.fromId || selectedNode.id === conn.toId);
                return (
                  <path
                    key={idx}
                    d={conn.d}
                    fill="none"
                    stroke={isSelectedPath ? "#818cf8" : "#262626"}
                    strokeWidth={isSelectedPath ? 3.5 : 2}
                    className="transition-all duration-300"
                    strokeDasharray={isSelectedPath ? "5,5" : "none"}
                    markerEnd="url(#arrow)"
                    style={{
                      strokeDashoffset: isSelectedPath ? -10 : 0,
                      animation: isSelectedPath ? "dash 2s linear infinite" : "none"
                    }}
                  />
                );
              })}

              {/* DRAW NODES */}
              {Object.values(coordinates).map((coordNode) => {
                const isSelected = selectedNode?.id === coordNode.id;
                
                // Color settings by level
                let colorTheme = { bg: "#15151a", stroke: "#262626", text: "#d1d5db", accent: "#6366f1" };
                if (coordNode.level === 0) {
                  colorTheme = { bg: "#131124", stroke: "#4f46e5", text: "#f8fafc", accent: "#818cf8" };
                } else if (coordNode.level === 1) {
                  colorTheme = { bg: "#04140f", stroke: "#059669", text: "#f1f5f9", accent: "#34d399" };
                }

                if (isSelected) {
                  colorTheme.stroke = "#f59e0b"; // Highlight amber
                }

                // Layout parameters
                const nodeWidth = 160;
                const nodeHeight = 50;

                return (
                  <g
                    key={coordNode.id}
                    transform={`translate(${coordNode.x - nodeWidth / 2}, ${coordNode.y - nodeHeight / 2})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNode(coordNode);
                    }}
                    className="cursor-pointer group"
                  >
                    {/* Glowing highlight ring */}
                    {isSelected && (
                      <rect
                        x="-4"
                        y="-4"
                        width={nodeWidth + 8}
                        height={nodeHeight + 8}
                        rx="16"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="2.5"
                        filter="url(#glow)"
                        className="animate-pulse"
                      />
                    )}

                    {/* Node Background card */}
                    <rect
                      x="0"
                      y="0"
                      width={nodeWidth}
                      height={nodeHeight}
                      rx="12"
                      fill={colorTheme.bg}
                      stroke={colorTheme.stroke}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      className="transition-all group-hover:stroke-indigo-400 group-hover:fill-white/5"
                    />

                    {/* Level marker strip (left-edge accent) */}
                    <rect
                      x="0"
                      y="0"
                      width="6"
                      height={nodeHeight}
                      rx="3"
                      fill={colorTheme.accent}
                    />

                    {/* Label Text Centered */}
                    <text
                      x={nodeWidth / 2 + 3}
                      y={nodeHeight / 2 + 5}
                      textAnchor="middle"
                      fill={colorTheme.text}
                      fontSize="11.5"
                      fontWeight="bold"
                      className="font-sans select-none tracking-tight pointer-events-none"
                    >
                      {coordNode.label.length > 20 
                        ? `${coordNode.label.slice(0, 18)}...` 
                        : coordNode.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right Side: Informational Detail Drawer panel (1/4 width) */}
        <div className="lg:col-span-1 bg-[#141414] border border-white/5 rounded-3xl p-6 flex flex-col justify-between shadow-sm min-h-[400px]">
          <div className="space-y-4">
            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full inline-block border border-indigo-500/20">
              Concept Detail Drawer
            </span>

            {selectedNode ? (
              <div className="space-y-4 animate-fade-in">
                <h4 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  {selectedNode.label}
                </h4>

                <div className="border-t border-white/5 pt-3">
                  <span className="text-xs font-bold text-gray-500 block mb-1">
                    RELATION LEVEL
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${
                    selectedNode.parentId === null || selectedNode.id === rootNode.id
                      ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20"
                      : selectedNode.parentId === rootNode.id
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20"
                        : "bg-white/5 text-gray-300 border border-white/5"
                  }`}>
                    {selectedNode.parentId === null || selectedNode.id === rootNode.id
                      ? "Root Core Topic"
                      : selectedNode.parentId === rootNode.id
                        ? "Primary Pillar"
                        : "Detailed Sub-topic"}
                  </span>
                </div>

                <div className="pt-2">
                  <span className="text-xs font-bold text-gray-500 block mb-1">
                    CONCEPT EXPLANATION
                  </span>
                  <p className="text-sm text-gray-400 leading-relaxed font-sans">
                    {selectedNode.description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Move className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs leading-normal">
                  Click on any node in the interactive mind-map to read its concept description.
                </p>
              </div>
            )}
          </div>

          <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-3 text-[10px] text-gray-500 leading-normal mt-4 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            <span>Interactive view: nodes are positioned logically by the AI hierarchy.</span>
          </div>
        </div>
      </div>

      {/* Styled animation keyframe for dashed glowing connections */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -40;
          }
        }
      `}</style>
    </div>
  );
}
