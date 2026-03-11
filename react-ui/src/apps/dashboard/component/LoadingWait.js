import "./loading.css";

export default function LoadingWait() {
  return (
    <div>
      <div
        className="top-0 left-0 z-50 absolute  inset-0 bg-slate-100 bg-opacity-30 flex items-center justify-center" 
      >
        <div className="border py-2 px-5 rounded-lg flex items-center flex-col z-50 bg-white">
          <div className="loader-dots relative block w-20 h-5 mt-2 -ml-16">
            <div className="absolute top-0 mt-1 w-3 h-3 rounded-full bg-slate-500"></div>
            <div className="absolute top-0 mt-1 w-3 h-3 rounded-full bg-slate-500"></div>
            <div className="absolute top-0 mt-1 w-3 h-3 rounded-full bg-slate-500"></div>
            <div className="absolute top-0 mt-1 w-3 h-3 rounded-full bg-slate-500"></div>
          </div>
          <div className="text-slate-500 text-xs font-light mt-2 text-center">
            Please wait...
          </div>
        </div>
      </div>
    </div>
  );
}
