import React from 'react';

export const FloatingWhatsApp: React.FC = () => {
  const whatsappNumber = '+919876543210'; // Representative institute contact number
  const message = 'Hello Noble Classes, I would like to enquire about admission dates and batches.';
  const link = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300 group"
      aria-label="Contact on WhatsApp"
    >
      <span className="absolute right-full mr-3 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-slate-100 dark:border-slate-800">
        Chat with us
      </span>
      <span className="absolute w-full h-full bg-[#25D366]/30 rounded-full animate-ping -z-10"></span>
      <svg
        className="w-7 h-7 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.859-4.407 9.862-9.843.002-2.632-1.02-5.107-2.88-6.969C16.596 1.93 14.126.907 11.5.907c-5.448 0-9.873 4.41-9.877 9.847-.002 1.776.471 3.512 1.368 5.068l-.982 3.585 3.682-.966zm11.758-6.84c-.313-.157-1.854-.915-2.145-1.02-.29-.106-.5-.157-.71.157-.21.314-.813 1.02-.996 1.226-.183.207-.367.236-.68.079-.313-.157-1.32-.486-2.515-1.55-.93-.828-1.558-1.85-1.74-2.164-.183-.313-.02-.483.137-.64.14-.143.313-.365.47-.548.156-.183.21-.313.313-.522.105-.21.053-.393-.026-.55-.079-.158-.711-1.714-.974-2.348-.256-.615-.513-.53-.708-.54-.18-.01-.39-.01-.6-.01-.21 0-.55.078-.838.393-.29.313-1.1.1.077-1.1 2.33 0 1.258.9 2.502 1.44 2.8.29.3.5.343.81.183.312-.16 1.854-.915 2.145-1.02z" />
      </svg>
    </a>
  );
};

export default FloatingWhatsApp;
