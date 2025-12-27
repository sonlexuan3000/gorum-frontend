export default function Loading({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      <div className="spinner"></div>
      <p className="mt-4 text-neutral-600">{text}</p>
    </div>
  );
}