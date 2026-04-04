export const SectionTitle = ({ children }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="flex items-center gap-1">
      <div className="w-1.5 h-6 bg-red-600 rounded-full" />
      <div className="w-1 h-4 bg-red-300 rounded-full" />
    </div>
    <h2 className="text-lg font-black tracking-tight" style={{ color: 'var(--text)' }}>
      {children}
    </h2>
  </div>
);
