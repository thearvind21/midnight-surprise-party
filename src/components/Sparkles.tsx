
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
    const sparkleCount = 100; // Increased number of sparkles
    const sparkles: any[] = [];
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    // Color palette for sparkles
    const sparkleColors = [
      'rgba(255,215,0,0.9)',  // Gold
      'rgba(255,255,255,0.9)', // White
      'rgba(255,192,203,0.9)', // Pink
      'rgba(173,216,230,0.9)', // Light blue
      'rgba(255,160,122,0.9)'  // Light salmon
    ];

    for (let i = 0; i < sparkleCount; i++) {
      sparkles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 3 + 1, // Larger sparkles
        alpha: Math.random(),
        dx: (Math.random() - 0.5) * 0.7, // Faster horizontal movement
        dy: -Math.random() * 0.5 - 0.1,  // Faster vertical movement
        twinkle: Math.random() * Math.PI * 2,
        color: sparkleColors[Math.floor(Math.random() * sparkleColors.length)]
      });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < sparkleCount; i++) {
        const s = sparkles[i];
        s.twinkle += 0.08 + Math.random() * 0.05;
        s.alpha = 0.5 + 0.5 * Math.sin(s.twinkle);
        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.beginPath();
        
        // Star shape for some sparkles
        if (i % 5 === 0) {
          drawStar(ctx, s.x, s.y, 5, s.r, s.r/2);
        } else {
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        }
        
        ctx.shadowColor = s.color.replace('rgba', 'rgb').replace(/,[^,]*\)/, ')');
        ctx.shadowBlur = 15;
        ctx.fillStyle = s.color;
        ctx.fill();
        ctx.restore();
        s.x += s.dx;
        s.y += s.dy;
        if (s.y < -10 || s.x < -10 || s.x > W + 10) {
          s.x = Math.random() * W;
          s.y = H + 10;
          s.r = Math.random() * 3 + 1;
          s.dx = (Math.random() - 0.5) * 0.7;
          s.dy = -Math.random() * 0.5 - 0.1;
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    }
    
    // Function to draw star shape
    function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
      let rot = Math.PI / 2 * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
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
