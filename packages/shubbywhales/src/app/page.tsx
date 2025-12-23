'use client';

import { useEffect, useState } from 'react';

export default function CountdownApp() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeCountdown, setActiveCountdown] = useState<'christmas' | 'newyear'>('christmas');
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const now = new Date();
    const christmas = new Date(now.getFullYear(), 11, 25);
    const newYear = new Date(now.getFullYear() + 1, 0, 1);

    // Auto-switch to New Year countdown after Christmas
    if (now > christmas && now < newYear) {
      setActiveCountdown('newyear');
    }
  }, [currentTime]);

  const calculateTimeLeft = (targetDate: Date) => {
    const now = currentTime.getTime();
    const target = targetDate.getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isPast: false,
    };
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        new Notification('🎄 Notifications Enabled!', {
          body: 'You\'ll be notified when the countdown reaches zero!',
          icon: '🎅',
        });
      }
    }
  };

  const christmas = new Date(currentTime.getFullYear(), 11, 25);
  const newYear = new Date(currentTime.getFullYear() + 1, 0, 1);
  
  const christmasTime = calculateTimeLeft(christmas);
  const newYearTime = calculateTimeLeft(newYear);

  const activeTime = activeCountdown === 'christmas' ? christmasTime : newYearTime;
  const activeTitle = activeCountdown === 'christmas' ? '🎄 Christmas' : '🎆 New Year';
  const activeEmoji = activeCountdown === 'christmas' ? '🎅' : '🎉';

  // Trigger notification when countdown reaches zero
  useEffect(() => {
    if (activeTime.isPast && notificationPermission === 'granted') {
      new Notification(`${activeEmoji} ${activeTitle} is here!`, {
        body: `Happy ${activeCountdown === 'christmas' ? 'Christmas' : 'New Year'}! 🎊`,
        icon: activeEmoji,
      });
    }
  }, [activeTime.isPast, activeCountdown, notificationPermission, activeTitle, activeEmoji]);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 text-white">
      {/* Snow animation */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="snowflake"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 20}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          >
            ❄
          </div>
        ))}
      </div>

      {/* Main content */}
      <main className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        {/* Toggle buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveCountdown('christmas')}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              activeCountdown === 'christmas'
                ? 'bg-red-600 text-white scale-110'
                : 'bg-white/20 text-white/70 hover:bg-white/30'
            }`}
          >
            🎄 Christmas
          </button>
          <button
            onClick={() => setActiveCountdown('newyear')}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              activeCountdown === 'newyear'
                ? 'bg-yellow-500 text-black scale-110'
                : 'bg-white/20 text-white/70 hover:bg-white/30'
            }`}
          >
            🎆 New Year
          </button>
        </div>

        {/* Title */}
        <h1 className="text-center text-5xl md:text-7xl font-bold mb-4 animate-pulse-slow">
          {activeTitle}
        </h1>
        <p className="text-xl md:text-2xl mb-12 text-white/80">
          {activeTime.isPast ? 'Is Here! 🎊' : 'Countdown'}
        </p>

        {/* Countdown display */}
        {!activeTime.isPast ? (
          <div className="grid grid-cols-4 gap-4 md:gap-8 mb-12">
            <div className="flex flex-col items-center">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 min-w-[80px] md:min-w-[120px] border-2 border-white/20">
                <div className="text-4xl md:text-6xl font-bold">{activeTime.days}</div>
              </div>
              <div className="mt-2 text-sm md:text-base text-white/70">Days</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 min-w-[80px] md:min-w-[120px] border-2 border-white/20">
                <div className="text-4xl md:text-6xl font-bold">{activeTime.hours}</div>
              </div>
              <div className="mt-2 text-sm md:text-base text-white/70">Hours</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 min-w-[80px] md:min-w-[120px] border-2 border-white/20">
                <div className="text-4xl md:text-6xl font-bold">{activeTime.minutes}</div>
              </div>
              <div className="mt-2 text-sm md:text-base text-white/70">Minutes</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 min-w-[80px] md:min-w-[120px] border-2 border-white/20">
                <div className="text-4xl md:text-6xl font-bold">{activeTime.seconds}</div>
              </div>
              <div className="mt-2 text-sm md:text-base text-white/70">Seconds</div>
            </div>
          </div>
        ) : (
          <div className="text-6xl md:text-8xl mb-12 animate-bounce">
            {activeEmoji}
          </div>
        )}

        {/* Notification button */}
        {notificationPermission !== 'granted' && (
          <button
            onClick={requestNotificationPermission}
            className="px-8 py-4 bg-green-600 hover:bg-green-700 rounded-full font-semibold text-lg transition-all transform hover:scale-105"
          >
            🔔 Enable Notifications
          </button>
        )}
        {notificationPermission === 'granted' && (
          <div className="text-green-400 flex items-center gap-2">
            <span>✓</span> Notifications enabled
          </div>
        )}
      </main>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 text-6xl animate-spin-slow">🎄</div>
      <div className="absolute top-20 right-20 text-5xl animate-bounce-slow">⭐</div>
      <div className="absolute bottom-20 left-20 text-5xl animate-pulse-slow">🎁</div>
      <div className="absolute bottom-10 right-10 text-6xl animate-spin-slow">❄️</div>
    </div>
  );
}

