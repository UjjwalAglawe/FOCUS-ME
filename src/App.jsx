import Timer from './components/Timer';

function App() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 font-sans text-white">
      <div className="bg-gray-900 shadow-lg rounded-xl p-8 max-w-md w-full text-center border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-3">FOCUS-ME</h1>
        <p className="text-gray-400 text-sm mb-6">
          A minimal focus timer extension that blocks distracting websites while you work.
        </p>
        <Timer />
      </div>
    </div>
  );
}

export default App;
