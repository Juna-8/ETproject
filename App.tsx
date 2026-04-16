@import "tailwindcss";

@theme {
  --color-ewha-green: #00462a;
  --color-ewha-light: #e6ecea;
  --color-ewha-accent: #cfdcd6;
  
  --font-sans: "Pretendard", system-ui, -apple-system, sans-serif;
}

@layer base {
  body {
    @apply bg-gray-50 text-gray-900 antialiased;
  }
}

@layer components {
  .btn-primary {
    @apply bg-ewha-green text-white px-4 py-2 rounded-lg font-medium transition-all active:scale-95;
    &:hover {
      opacity: 0.9;
    }
  }
  .btn-secondary {
    @apply bg-white border border-ewha-green text-ewha-green px-4 py-2 rounded-lg font-medium transition-all active:scale-95;
    &:hover {
      @apply bg-ewha-light;
    }
  }
  .card {
    @apply bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden;
  }
}
