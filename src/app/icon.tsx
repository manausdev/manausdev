import { ImageResponse } from 'next/og';

export const size = {
  width: 512,
  height: 512,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 36 36"
        width="512"
        height="512"
      >
        <defs>
          <linearGradient id="diamond-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#009BFD" />
            <stop offset="50%" stopColor="#02B8B5" />
            <stop offset="100%" stopColor="#4BD76D" />
          </linearGradient>
        </defs>
        <rect width="36" height="36" rx="8" fill="#0c1f2e" />
        <rect x="9" y="9" width="18" height="18" rx="2" fill="url(#diamond-grad)" transform="rotate(45 18 18)" />
        <path d="M14 15.5 L11 18 L14 20.5" stroke="#0c1f2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M22 15.5 L25 18 L22 20.5" stroke="#0c1f2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M17.5 21.5 L18.5 14.5" stroke="#0c1f2e" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
    ),
    {
      ...size,
    }
  );
}
