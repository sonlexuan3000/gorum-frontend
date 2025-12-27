export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* 1. Bong bóng chat (Màu kem đậm/Nâu nhạt) */}
      <path 
        d="M50 88C74.8528 88 95 72.33 95 53C95 33.67 74.8528 18 50 18C25.1472 18 5 33.67 5 53C5 68.3 17.5 81.3 35 86L32 96L45 87.8C46.6 87.9 48.3 88 50 88Z" 
        fill="#e6dace" 
        stroke="#5e4b35" 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* 2. Mầm cây (Màu xanh sage) */}
      <path 
        d="M50 55C50 55 45 40 30 35M50 55C50 55 55 35 75 30" 
        stroke="#7a9e7e" 
        strokeWidth="6" 
        strokeLinecap="round"
      />
      <path 
        d="M30 35C25 32 25 20 35 25C40 28 35 35 30 35Z" 
        fill="#7a9e7e"
      />
      <path 
        d="M75 30C80 28 82 15 70 20C65 22 70 30 75 30Z" 
        fill="#7a9e7e"
      />
    </svg>
  );
}