export default function Loading() {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
      <div className="relative w-16 h-16 animate-spin">
        <div className="absolute top-0 left-1/2 w-3 h-3 bg-gray-700 rounded-full -translate-x-1/2" />
        <div className="absolute right-0 top-1/2 w-3 h-3 bg-gray-700 rounded-full -translate-y-1/2" />
        <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-gray-700 rounded-full -translate-x-1/2" />
        <div className="absolute left-0 top-1/2 w-3 h-3 bg-gray-700 rounded-full -translate-y-1/2" />
      </div>
    </div>
  );
}
