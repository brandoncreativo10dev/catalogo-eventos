"use client";

import { useState } from "react";

// Datos de ejemplo para los eventos
const EVENTOS_INICIALES = [
  {
    id: 1,
    titulo: "Boda de Lujo en Jardín",
    categoria: "Bodas",
    capacidad: "200 personas",
    precio: "$45,000 MXN",
    descripcion: "Servicio integral con banquete de 3 tiempos, iluminación arquitectónica y pista de cristal.",
    imagen: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    titulo: "Convención Anual Corporativa",
    categoria: "Empresariales",
    capacidad: "500 personas",
    precio: "$85,000 MXN",
    descripcion: "Pantallas LED gigantes, audio profesional, catering continuo y registro digital.",
    imagen: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    titulo: "Gala de Graduación",
    categoria: "Graduaciones",
    capacidad: "350 personas",
    precio: "$60,000 MXN",
    descripcion: "DJ en vivo, photobooth 360°, cena gourmet y decoración temática.",
    imagen: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800",
  },
];

export default function Home() {
  const [categoriaSel, setCategoriaSel] = useState("Todos");

  const categorias = ["Todos", "Bodas", "Empresariales", "Graduaciones"];

  const eventosFiltrados =
    categoriaSel === "Todos"
      ? EVENTOS_INICIALES
      : EVENTOS_INICIALES.filter((e) => e.categoria === categoriaSel);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans">
      {/* Encabezado */}
      <header className="max-w-6xl mx-auto text-center space-y-4 mb-12">
        <span className="bg-indigo-500/10 text-indigo-400 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-500/20 uppercase tracking-wider">
          Portafolio de Servicios
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
          Catálogo Exclusivo de Eventos
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Explora nuestros paquetes diseñados para experiencias memorables.
        </p>

        {/* Filtros de Categorías */}
        <div className="flex flex-wrap justify-center gap-2 pt-6">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaSel(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                categoriaSel === cat
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Grid de Tarjetas de Eventos */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {eventosFiltrados.map((evento) => (
          <article
            key={evento.id}
            className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="h-48 overflow-hidden relative">
                <img
                  src={evento.imagen}
                  alt={evento.titulo}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-xs font-medium text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">
                  {evento.categoria}
                </span>
              </div>
              <div className="p-6 space-y-3">
                <h3 className="text-xl font-bold text-white">{evento.titulo}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {evento.descripcion}
                </p>
                <div className="text-xs text-indigo-400 font-semibold pt-2">
                  Capacidad: {evento.capacidad}
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-800/50 mt-4">
              <div>
                <span className="text-xs text-slate-500 block">Desde</span>
                <span className="text-lg font-bold text-emerald-400">
                  {evento.precio}
                </span>
              </div>
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
                Cotizar Evento
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}