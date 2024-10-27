interface ToggleProps {
  isActive: boolean;
  onToggle: () => void;
  width?: number;
  height?: number;
  backgroundImg?: {
    active: string;
    inactive: string;
  };
  toggleSize?: number;
  padding?: number;
}

export default function Toggle({
  isActive,
  onToggle,
  width = 147,
  height = 59,
  backgroundImg = {
    active: '/images/theme/theme-dark-bg.png',
    inactive: '/images/theme/theme-light-bg.png',
  },
  toggleSize = 51,
  padding = 4,
}: ToggleProps) {
  const radius = height / 2;
  const moveDistance = width - toggleSize - padding * 2;

  return (
    <button
      onClick={onToggle}
      style={{
        width,
        height,
        borderRadius: radius,
        position: 'relative',
        backgroundImage: `url(${
          isActive ? backgroundImg.active : backgroundImg.inactive
        })`, // 배경 이미지 적용
        backgroundSize: 'cover', // 이미지가 버튼에 맞게 조정됨
        transition: 'all 0.3s ease',
      }}
    >
      {/* Toggle Knob */}
      <div
        style={{
          position: 'absolute',
          width: toggleSize,
          height: toggleSize,
          borderRadius: '50%',
          background: isActive ? backgroundImg.active : backgroundImg.inactive,
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          top: '50%',
          left: padding,
          transform: `translateY(-50%) translateX(${isActive ? moveDistance : 0}px)`,
          transition: 'transform 0.3s ease',
        }}
      >
        {/* Inactive Icon */}
        <div
          style={{
            position: 'absolute',
            width: '175px',
            height: '103px',
            opacity: isActive ? 0 : 1,
            transition: 'opacity 0.3s ease',
            backgroundImage: `url(/images/theme/theme-light-sun.png)`,
            left: '-118%',
            top: '-50%',
            backgroundPosition: 'center center',
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        >
          <img
            style={{
              position: 'absolute',
              width: '43px',
              height: 'auto',
              opacity: isActive ? 0 : 1,
              transition: 'opacity 0.3s ease',
              left: '55%',
              top: '47%',
              zIndex: 9999,
            }}
            src="/images/theme/theme-light-cloud.png"
            alt="구름 이미지"
          />
        </div>

        {/* Active Icon */}
        <div
          style={{
            position: 'absolute',
            width: '175px',
            height: '103px',
            opacity: isActive ? 1 : 0,
            transition: 'opacity 0.3s ease',
            backgroundImage: `url(/images/theme/theme-dark-moon.png)`,
            right: '-118%',
            top: '-50%',
            backgroundPosition: 'center center',
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        />
      </div>
    </button>
  );
}
