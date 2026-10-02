'use client';

import { useState } from 'react';

export default function ChatIA() {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<{ origen: 'user' | 'ia'; texto: string }[]>([
    { origen: 'ia', texto: '¡Hola! 🤖 Soy tu asistente virtual de EventosPro. ¿Qué tipo de evento estás planeando y para cuántas personas?' }
  ]);
  const [input, setInput] = useState('');
  const [cargando, setCargando] = useState(false);

  const enviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || cargando) return;

    const mensajeUsuario = input;
    setInput('');
    setMensajes((prev) => [...prev, { origen: 'user', texto: mensajeUsuario }]);
    setCargando(true);

    try {
      const res = await fetch('/api/chat-ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje: mensajeUsuario }),
      });

      const data = await res.json();

      if (data.respuesta) {
        setMensajes((prev) => [...prev, { origen: 'ia', texto: data.respuesta }]);
      } else {
        setMensajes((prev) => [...prev, { origen: 'ia', texto: 'Lo siento, ocurrió un error al consultar las recomendaciones.' }]);
      }
    } catch (error) {
      setMensajes((prev) => [...prev, { origen: 'ia', texto: 'Ocurrió un problema de conexión. Inténtalo de nuevo.' }]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* BOTÓN FLOTANTE */}
      {!abierto && (
        <button
          onClick={() => setAbierto(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-4 py-3 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 border border-indigo-400/30"
        >
          <span className="text-lg">✨</span>
          <span className="text-xs">Asistente IA</span>
        </button>
      )}

      {/* VENTANA DEL CHAT */}
      {abierto && (
        <div className="w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[450px] backdrop-blur-xl">
          {/* CABECERA */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl">✨</span>
              <div>
                <h3 className="text-xs font-bold">Asistente Virtual IA</h3>
                <p className="text-[10px] text-indigo-200">Recomendador de paquetes</p>
              </div>
            </div>
            <button
              onClick={() => setAbierto(false)}
              className="text-slate-200 hover:text-white text-xs bg-black/20 hover:bg-black/40 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>

          {/* CUERPO DE MENSAJES */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {mensajes.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.origen === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl ${
                    m.origen === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-bl-none'
                  }`}
                >
                  {m.texto}
                </div>
              </div>
            ))}
            {cargando && (
              <div className="flex justify-start">
                <div className="bg-slate-800 border border-slate-700/60 p-3 rounded-2xl rounded-bl-none text-slate-400 animate-pulse text-[11px]">
                  Escribiendo recomendación... 🤖
                </div>
              </div>
            )}
          </div>

          {/* FORMULARIO DE ENVÍO */}
          <form onSubmit={enviarMensaje} className="p-3 border-t border-slate-800 bg-slate-950 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ej. Boda para 150 personas..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={cargando}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-3 py-2 rounded-xl text-xs transition-colors disabled:opacity-50"
            >
              Enviar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}