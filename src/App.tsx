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

  const isOverflow = (pos: { x: number; y: number }, monitor: Monitor) =>
    pos.x < 0 ||
    pos.y < 0 ||
    pos.x + monitor.width > frameSize.width ||
    pos.y + monitor.height > frameSize.height;

  const centerMonitor = (monitor: Monitor) => {
    return {
      ...monitor,
      x: Math.max(
        0,
        Math.min(
          (frameSize.width - monitor.width) / 2,
          frameSize.width - monitor.width
        )
      ),
      y: Math.max(
        0,
        Math.min(
          (frameSize.height - monitor.height) / 2,
          frameSize.height - monitor.height
        )
      ),
    };
  };

  const snapToClosest = (
    dragged: Monitor,
    others: Monitor[],
    dropDirection: "top" | "bottom" | "left" | "right" | null
  ): { x: number; y: number; pushedMonitors?: Monitor[] } => {
    let best = { x: dragged.x, y: dragged.y };
    let minDist = Infinity;

    let closestMonitor: Monitor | null = null;

    for (const fixed of others) {
      const directions = {
        top: {
          x: fixed.x - dragged.width + 20,

          y: fixed.y - dragged.height,
          dist: Math.abs(dragged.y + dragged.height - fixed.y),
        },
        bottom: {
          x: fixed.x - dragged.width + 20,
          y: fixed.y + fixed.height,
          dist: Math.abs(dragged.y - (fixed.y + fixed.height)),
        },
        left: {
          x: fixed.x - dragged.width,
          y: fixed.y - dragged.height + 20,
          dist: Math.abs(dragged.x + dragged.width - fixed.x),
        },
        right: {
          x: fixed.x + fixed.width,
          y: fixed.y - dragged.height + 20,
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
          // snappedDir = dir;
        }
      }
    }

    if (dropDirection && closestMonitor) {
      switch (dropDirection) {
        case "top":
          best = {
            x: Math.min(
              Math.max(dragged.x, closestMonitor.x - dragged.width + 20),
              closestMonitor.x + closestMonitor.width - 20
            ),
            y: closestMonitor.y - dragged.height,
          };
          break;
        case "bottom":
          best = {
            x: Math.min(
              Math.max(dragged.x, closestMonitor.x - dragged.width + 20),
              closestMonitor.x + closestMonitor.width - 20
            ),
            y: closestMonitor.y + closestMonitor.height,
          };
          break;
        case "left":
          best = {
            x: closestMonitor.x - dragged.width,
            y: Math.min(
              Math.max(dragged.y, closestMonitor.y - dragged.height + 20),
              closestMonitor.y + closestMonitor.height - 20
            ),
          };
          break;
        case "right":
          best = {
            x: closestMonitor.x + closestMonitor.width,
            y: Math.min(
              Math.max(dragged.y, closestMonitor.y - dragged.height + 20),
              closestMonitor.y + closestMonitor.height - 20
            ),
          };
          break;
      }
    }

    if (closestMonitor && isOverflow(best, dragged)) {
      const centered = centerMonitor(closestMonitor);

      let draggedPos = best;
      switch (dropDirection) {
        case "top":
          draggedPos = { x: centered.x, y: centered.y - dragged.height };
          break;
        case "bottom":
          draggedPos = { x: centered.x, y: centered.y + centered.height };
          break;
        case "left":
          draggedPos = { x: centered.x - dragged.width, y: centered.y };
          break;
        case "right":
          draggedPos = { x: centered.x + centered.width, y: centered.y };
          break;
        default:
          draggedPos = {
            x: Math.max(
              0,
              Math.min(
                (frameSize.width - dragged.width) / 2,
                frameSize.width - dragged.width
              )
            ),
            y: Math.max(
              0,
              Math.min(
                (frameSize.height - dragged.height) / 2,
                frameSize.height - dragged.height
              )
            ),
          };
          break;
      }

      draggedPos.x = Math.max(
        0,
        Math.min(draggedPos.x, frameSize.width - dragged.width)
      );
      draggedPos.y = Math.max(
        0,
        Math.min(draggedPos.y, frameSize.height - dragged.height)
      );

      return { x: draggedPos.x, y: draggedPos.y, pushedMonitors: [centered] };
    }

    best.x = Math.max(0, Math.min(best.x, frameSize.width - dragged.width));
    best.y = Math.max(0, Math.min(best.y, frameSize.height - dragged.height));

    return { x: best.x, y: best.y };
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (draggingId === null) return;

    const dragged = monitors.find((m) => m.id === draggingId);
    if (!dragged) return;

    const others = monitors.filter((m) => m.id !== draggingId);
    if (others.length === 0) {
      setDraggingId(null);
      return;
    }

    let direction: "top" | "bottom" | "left" | "right" | null = null;

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;

      if (Math.abs(dx) > Math.abs(dy)) {
        direction = dx > 0 ? "right" : "left";
      } else {
        direction = dy > 0 ? "bottom" : "top";
      }
    }

    const result = snapToClosest(dragged, others, direction);

    setMonitors((prev) => {
      let updated = prev.map((m) =>
        m.id === draggingId ? { ...m, x: result.x, y: result.y } : m
      );

      if (result.pushedMonitors) {
        for (const pushed of result.pushedMonitors) {
          updated = updated.map((m) =>
            m.id === pushed.id ? { ...m, x: pushed.x, y: pushed.y } : m
          );
        }
      }

      return updated;
    });

    setDraggingId(null);
  };

  const handleClick = (id: number) => {
    setMonitorId(id);
  };

  const handleTouchStart = (e: React.TouchEvent, id: number) => {
    e.preventDefault();
    const touch = e.touches[0];
    const monitor = monitors.find((m) => m.id === id);
    if (!monitor) return;

    setDraggingId(id);
    setOffset({ x: touch.clientX - monitor.x, y: touch.clientY - monitor.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (draggingId === null) return;
    e.preventDefault();

    const touch = e.touches[0];
    const newX = touch.clientX - offset.x;
    const newY = touch.clientY - offset.y;

    setMonitors((prev) =>
      prev.map((m) => (m.id === draggingId ? { ...m, x: newX, y: newY } : m))
    );
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (draggingId === null) return;
    e.preventDefault();

    const touch = e.changedTouches[0];

    const dragged = monitors.find((m) => m.id === draggingId);
    if (!dragged) return;

    const others = monitors.filter((m) => m.id !== draggingId);
    if (others.length === 0) {
      setDraggingId(null);
      return;
    }

    let direction: "top" | "bottom" | "left" | "right" | null = null;

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = touch.clientX - centerX;
      const dy = touch.clientY - centerY;

      if (Math.abs(dx) > Math.abs(dy)) {
        direction = dx > 0 ? "right" : "left";
      } else {
        direction = dy > 0 ? "bottom" : "top";
      }
    }

    const result = snapToClosest(dragged, others, direction);

    setMonitors((prev) => {
      let updated = prev.map((m) =>
        m.id === draggingId ? { ...m, x: result.x, y: result.y } : m
      );

      if (result.pushedMonitors) {
        for (const pushed of result.pushedMonitors) {
          updated = updated.map((m) =>
            m.id === pushed.id ? { ...m, x: pushed.x, y: pushed.y } : m
          );
        }
      }

      return updated;
    });

    setDraggingId(null);
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
        className="relative w-full h-96 border border-gray-400 bg-gray-100 rounded overflow-hidden"
        ref={containerRef}
        style={{ width: 800, height: 400 }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {monitors.map(({ id, x, y, width, height }) => (
          <div
            key={id}
            className={`absolute rounded-md cursor-pointer border-2 ${
              id === monitorId ? "border-blue-600" : "border-zinc-500"
            }`}
            onMouseDown={(e) => handleMouseDown(e, id)}
            onTouchStart={(e) => handleTouchStart(e, id)}
            onClick={() => handleClick(id)}
            style={{
              width: width,
              height: height,
              left: x,
              top: y,
              userSelect: "none",
              backgroundColor: "#eee",
              boxShadow: id === draggingId ? "0 0 8px 3px #0066ff88" : "none",
              transition: draggingId === id ? "none" : "left 0.3s, top 0.3s",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              fontSize: 18,
              zIndex: draggingId === id ? 2 : 1,
            }}
          >
            {id}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
