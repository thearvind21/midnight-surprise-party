import { useEffect, useRef } from "react";

const Sparkles = ({ trigger }: { trigger: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!trigger) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationFrameId: number;
    const sparkleCount = 60;
    const sparkles: any[] = [];
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    for (let i = 0; i < sparkleCount; i++) {
      sparkles.push({
        x: Math.random() * W,
        y: Math.random() * H * 0.7,
        r: Math.random() * 2.2 + 1.2,
        alpha: Math.random(),
        dx: (Math.random() - 0.5) * 0.3,
        dy: -Math.random() * 0.2 - 0.1,
        twinkle: Math.random() * Math.PI * 2,
        color: `rgba(255,255,255,1)`
      });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < sparkleCount; i++) {
        const s = sparkles[i];
        s.twinkle += 0.08 + Math.random() * 0.04;
        s.alpha = 0.5 + 0.5 * Math.sin(s.twinkle);
        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.shadowColor = "#fffbe6";
        ctx.shadowBlur = 12;
        ctx.fillStyle = s.color;
        ctx.fill();
        ctx.restore();
        s.x += s.dx;
        s.y += s.dy;
        if (s.y < -10 || s.x < -10 || s.x > W + 10) {
          s.x = Math.random() * W;
          s.y = H + 10;
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      cancelAnimationFrame(animationFrameId);
      ctx.clearRect(0, 0, W, H);
    };
  }, [trigger]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 1001,
        display: trigger ? "block" : "none"
      }}
    />
  );
};

export default Sparkles; 