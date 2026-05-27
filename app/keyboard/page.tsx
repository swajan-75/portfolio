import KeyboardDemo from "@/components/keyboard-demo";

export default function KeyboardTestPage() {
  return (
    <main className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center pt-20">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Keyboard Component</h1>
        <p className="text-neutral-400">Type on your physical keyboard to see it animate and play sound!</p>
      </div>
      
      <KeyboardDemo />
    </main>
  );
}
