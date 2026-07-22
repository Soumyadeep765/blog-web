type IconProps = {
  size?: number;
  className?: string;
};

export function XLogo({ size = 18, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M18.244 2H21.5l-7.5 8.57L22.5 22h-6.59l-5.16-6.74L5.1 22H1.84l8.03-9.17L1.5 2h6.75l4.66 6.18L18.244 2Zm-1.16 18.1h1.83L7.05 3.8H5.09L17.084 20.1Z" />
    </svg>
  );
}

export function LinkedInLogo({ size = 18, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.23 0Z" />
    </svg>
  );
}

export function FacebookLogo({ size = 18, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.62 23.09 24 18.1 24 12.07Z" />
    </svg>
  );
}

export function WhatsAppLogo({ size = 18, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.64-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35ZM12.05 21.8h-.01a9.8 9.8 0 0 1-5-.14l-.36-.12-3.71.97 1-3.62-.24-.37a9.83 9.83 0 0 1-1.5-5.22 9.84 9.84 0 0 1 9.84-9.82c2.63.01 5.1 1.03 6.96 2.89a9.78 9.78 0 0 1 2.88 6.95 9.84 9.84 0 0 1-9.86 9.86Zm8.36-18.2A11.75 11.75 0 0 0 12.04 0C5.4 0 .02 5.37.01 11.99a11.95 11.95 0 0 0 1.6 6l.1.16L0 24l5.98-1.57.15.09A11.97 11.97 0 0 0 12.04 24h.01c6.62 0 12.01-5.38 12.02-12.01a11.93 11.93 0 0 0-3.66-8.39Z" />
    </svg>
  );
}

export function TelegramLogo({ size = 18, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M11.94 0C5.34 0 0 5.35 0 11.96c0 2.1.55 4.07 1.51 5.8L.06 23.4l5.83-1.53A11.9 11.9 0 0 0 11.94 24C18.54 24 24 18.65 24 12.04 24 5.43 18.54 0 11.94 0Zm6.95 16.36c-.29.82-1.7 1.49-2.38 1.58-.48.07-1.1.12-3.17-.68-2.65-1.03-4.3-3.65-4.43-3.82-.13-.17-1.06-1.41-1.06-2.69 0-1.28.67-1.91.91-2.17.24-.26.52-.32.7-.32h.5c.16 0 .37-.06.58.44.22.53.73 1.83.8 1.96.06.13.1.29.02.46-.09.17-.13.29-.26.45-.13.15-.28.34-.4.46-.13.13-.27.27-.12.53.16.26.7 1.15 1.5 1.86 1.03.92 1.9 1.2 2.17 1.34.26.13.42.11.57-.07.16-.17.67-.78.85-1.05.17-.26.35-.22.59-.13.24.09 1.53.72 1.79.85.26.13.43.2.5.31.06.11.06.65-.23 1.47Z" />
    </svg>
  );
}

export function LinkLogo({ size = 18, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}
