import { useEffect, useRef, useState } from "react";

interface Monitor {
  id: number;
  x: number;
  y: number;
  isMain: boolean;
  width: number;
  height: number;
}

function App() {
  const [monitors, setMonitors] = useState<Monitor[]>([
    { id: 1, x: 200, y: 150, isMain: true, width: 192, height: 108 },
    { id: 2, x: 390, y: 150, isMain: false, width: 144, height: 96 },
  ]);

  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [monitorId, setMonitorId] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 });

  // Get actual size of frame
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setFrameSize({ width, height });
      }
    };

    updateSize();
    const resizeObserver = new ResizeObserver(updateSize);
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  const handleMouseDown = (e: React.MouseEvent, id: number) => {
    const monitor = monitors.find((m) => m.id === id);
    if (!monitor) return;

    setDraggingId(id);
    setOffset({ x: e.clientX - monitor.x, y: e.clientY - monitor.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingId === null) return;

    const newX = e.clientX - offset.x;
    const newY = e.clientY - offset.y;

    setMonitors((prev) =>
      prev.map((m) => (m.id === draggingId ? { ...m, x: newX, y: newY } : m))
    );
  };

  const snapToClosest = (
    dragged: Monitor,
    others: Monitor[]
  ): { x: number; y: number } => {
    let best = { x: dragged.x, y: dragged.y };
    let minDist = Infinity;
    let snappedDir: "top" | "bottom" | "left" | "right" | null = null;
    let closestMonitor: Monitor | null = null;

    for (const fixed of others) {
      const directions = {
        top: {
          x: Math.max(
            fixed.x - dragged.width + 20,
            Math.min(dragged.x, fixed.x + fixed.width - 20)
          ),
          y: fixed.y - dragged.height,
          dist: Math.abs(dragged.y + dragged.height - fixed.y),
        },
        bottom: {
          x: Math.max(
            fixed.x - dragged.width + 20,
            Math.min(dragged.x, fixed.x + fixed.width - 20)
          ),
          y: fixed.y + fixed.height,
          dist: Math.abs(dragged.y - (fixed.y + fixed.height)),
        },
        left: {
          x: fixed.x - dragged.width,
          y: Math.max(
            fixed.y - dragged.height + 20,
            Math.min(dragged.y, fixed.y + fixed.height - 20)
          ),
          dist: Math.abs(dragged.x + dragged.width - fixed.x),
        },
        right: {
          x: fixed.x + fixed.width,
          y: Math.max(
            fixed.y - dragged.height + 20,
            Math.min(dragged.y, fixed.y + fixed.height - 20)
          ),
          dist: Math.abs(dragged.x - (fixed.x + fixed.width)),
        },
      };

      for (const dir of Object.keys(directions) as Array<
        keyof typeof directions
      >) {
        const { x, y, dist } = directions[dir];
        if (dist < minDist) {
          minDist = dist;
          best = { x, y };
          closestMonitor = fixed;
          snappedDir = dir;
        }
      }
    }

    const isOverflow = (pos: { x: number; y: number }) =>
      pos.x < 0 ||
      pos.y < 0 ||
      pos.x + dragged.width > frameSize.width ||
      pos.y + dragged.height > frameSize.height;

    if (closestMonitor && snappedDir && isOverflow(best)) {
      let oppositePos: { x: number; y: number } | null = null;

      switch (snappedDir) {
        case "top":
          oppositePos = {
            x: closestMonitor.x + (closestMonitor.width - dragged.width) / 2,
            y: closestMonitor.y + closestMonitor.height,
          };
          break;
        case "bottom":
          oppositePos = {
            x: closestMonitor.x + (closestMonitor.width - dragged.width) / 2,
            y: closestMonitor.y - dragged.height,
          };
          break;
        case "left":
          oppositePos = {
            x: closestMonitor.x + closestMonitor.width,
            y: closestMonitor.y + (closestMonitor.height - dragged.height) / 2,
          };
          break;
        case "right":
          oppositePos = {
            x: closestMonitor.x - dragged.width,
            y: closestMonitor.y + (closestMonitor.height - dragged.height) / 2,
          };
          break;
      }

      if (oppositePos && !isOverflow(oppositePos)) {
        best = oppositePos;
      } else {
        const tryDirections: Array<"top" | "bottom" | "left" | "right"> = [
          "top",
          "bottom",
          "left",
          "right",
        ];

        for (const dir of tryDirections) {
          if (dir === snappedDir) continue;
          if (oppositePos) {
            const oppDir =
              snappedDir === "top"
                ? "bottom"
                : snappedDir === "bottom"
                ? "top"
                : snappedDir === "left"
                ? "right"
                : "left";
            if (dir === oppDir) continue;
          }

          let posCandidate: { x: number; y: number } | null = null;

          switch (dir) {
            case "top":
              posCandidate = {
                x:
                  closestMonitor.x + (closestMonitor.width - dragged.width) / 2,
                y: closestMonitor.y - dragged.height,
              };
              break;
            case "bottom":
              posCandidate = {
                x:
                  closestMonitor.x + (closestMonitor.width - dragged.width) / 2,
                y: closestMonitor.y + closestMonitor.height,
              };
              break;
            case "left":
              posCandidate = {
                x: closestMonitor.x - dragged.width,
                y:
                  closestMonitor.y +
                  (closestMonitor.height - dragged.height) / 2,
              };
              break;
            case "right":
              posCandidate = {
                x: closestMonitor.x + closestMonitor.width,
                y:
                  closestMonitor.y +
                  (closestMonitor.height - dragged.height) / 2,
              };
              break;
          }

          if (posCandidate && !isOverflow(posCandidate)) {
            best = posCandidate;
            break;
          }
        }
      }
    }

    best.x = Math.max(0, Math.min(best.x, frameSize.width - dragged.width));
    best.y = Math.max(0, Math.min(best.y, frameSize.height - dragged.height));

    return best;
  };

  const handleMouseUp = () => {
    if (draggingId === null) return;

    const dragged = monitors.find((m) => m.id === draggingId);
    if (!dragged) return;

    const others = monitors.filter((m) => m.id !== draggingId);
    if (others.length === 0) {
      setDraggingId(null);
      return;
    }

    const { x: newX, y: newY } = snapToClosest(dragged, others);

    setMonitors((prev) =>
      prev.map((m) => (m.id === draggingId ? { ...m, x: newX, y: newY } : m))
    );

    setDraggingId(null);
  };

  const handleClick = (id: number) => {
    setMonitorId(id);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-lg font-bold mb-2">Arrange Displays</h2>
      <p className="text-sm text-gray-600 mb-4">
        To rearrange displays, drag them to the desired positions. To mirror
        displays, hold Option while dragging them on top of each other. To
        relocate the menu bar, drag it to a different display.
      </p>

      <div
        ref={containerRef}
        className="relative w-full h-96 border border-gray-400 bg-gray-100 rounded overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {monitors.map((monitor) => (
          <div
            key={monitor.id}
            onMouseDown={(e) => handleMouseDown(e, monitor.id)}
            onClick={() => handleClick(monitor.id)}
            style={{
              left: monitor.x,
              top: monitor.y,
              width: monitor.width,
              height: monitor.height,
              zIndex: monitor.isMain ? 10 : 5,
            }}
            className={`absolute flex flex-col items-center justify-center rounded-md
              cursor-${monitor.isMain ? "default" : "move"} border-2
              transition-colors duration-200 select-none
              ${
                monitor.id === monitorId
                  ? "border-blue-500 bg-blue-100"
                  : monitor.isMain
                  ? "border-black bg-white"
                  : "border-transparent bg-gray-300"
              }`}
          >
            <span className="text-xl font-semibold">Monitor {monitor.id}</span>
            <span className="text-xs text-gray-600">
              {monitor.isMain ? "Main" : "Secondary"}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-3">
        <button className="px-4 py-1 text-sm text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-md shadow-md transition-all duration-200">
          Done
        </button>
      </div>
    </div>
  );
}

export default App;
