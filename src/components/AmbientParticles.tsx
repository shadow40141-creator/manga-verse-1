const PARTICLES = [
  { left: '6%', top: '76%', size: 5, duration: '7.2s', delay: '0s', drift: '36px', tone: 'bg-rose-500/70' },
  { left: '12%', top: '88%', size: 4, duration: '8.5s', delay: '1.1s', drift: '-28px', tone: 'bg-violet-400/65' },
  { left: '18%', top: '68%', size: 6, duration: '9.1s', delay: '0.4s', drift: '48px', tone: 'bg-rose-400/60' },
  { left: '25%', top: '84%', size: 4, duration: '6.8s', delay: '2.2s', drift: '22px', tone: 'bg-amber-300/55' },
  { left: '32%', top: '72%', size: 5, duration: '8.2s', delay: '0.8s', drift: '-34px', tone: 'bg-rose-500/65' },
  { left: '40%', top: '92%', size: 4, duration: '9.8s', delay: '1.7s', drift: '40px', tone: 'bg-violet-400/60' },
  { left: '48%', top: '79%', size: 6, duration: '7.5s', delay: '0.2s', drift: '28px', tone: 'bg-rose-400/70' },
  { left: '55%', top: '87%', size: 3, duration: '8.9s', delay: '2.9s', drift: '-24px', tone: 'bg-amber-400/50' },
  { left: '62%', top: '65%', size: 5, duration: '7.8s', delay: '1.4s', drift: '46px', tone: 'bg-violet-400/65' },
  { left: '69%', top: '83%', size: 4, duration: '9.4s', delay: '0.5s', drift: '-32px', tone: 'bg-rose-500/65' },
  { left: '76%', top: '74%', size: 6, duration: '6.9s', delay: '2.1s', drift: '34px', tone: 'bg-rose-400/70' },
  { left: '83%', top: '90%', size: 4, duration: '8.3s', delay: '1.0s', drift: '-22px', tone: 'bg-violet-500/65' },
  { left: '89%', top: '70%', size: 5, duration: '7.6s', delay: '2.5s', drift: '30px', tone: 'bg-amber-300/55' },
  { left: '94%', top: '82%', size: 4, duration: '9.2s', delay: '0.7s', drift: '-36px', tone: 'bg-rose-500/70' },
];

const SLASH_STREAKS = [
  { top: '22%', duration: '7.5s', delay: '0s', gradient: 'from-transparent via-rose-500/30 to-transparent' },
  { top: '58%', duration: '9.5s', delay: '3.2s', gradient: 'from-transparent via-violet-500/25 to-transparent' },
  { top: '40%', duration: '11s', delay: '6.0s', gradient: 'from-transparent via-rose-400/20 to-transparent' },
];

export function AmbientParticles() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Drifting Ambient Aura Pools */}
      <div className="animate-aura-a absolute -left-24 -top-24 h-96 w-96 rounded-full bg-rose-600/20 blur-3xl" />
      <div className="animate-aura-b absolute -bottom-24 right-10 h-[28rem] w-[28rem] rounded-full bg-violet-600/20 blur-3xl" />

      {/* Diagonal Anime Energy Streaks */}
      {SLASH_STREAKS.map((streak, idx) => (
        <div
          key={`streak-${idx}`}
          style={{
            top: streak.top,
            ['--duration' as string]: streak.duration,
            ['--delay' as string]: streak.delay,
          }}
          className={`animate-slash-sweep absolute -left-1/4 h-[2px] w-3/4 bg-gradient-to-r ${streak.gradient} blur-[1px]`}
        />
      ))}

      {/* Rising Ember & Sakura Ink Motes */}
      {PARTICLES.map((p, idx) => (
        <span
          key={idx}
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            ['--duration' as string]: p.duration,
            ['--delay' as string]: p.delay,
            ['--drift-x' as string]: p.drift,
          }}
          className={`animate-ember absolute rounded-full ${p.tone} shadow-[0_0_8px_rgba(244,63,94,0.45)]`}
        />
      ))}
    </div>
  );
}
