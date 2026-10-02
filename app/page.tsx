'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ChatIA from '@/components/ChatIA';

interface Evento {
  id: string;
  titulo: string;
  slug: string;
  categoria: string;
  descripcion_corta: string;
  precio_base: number;
  capacidad_min: number;
  capacidad_max: number;
  imagen_principal: string;
}

export default function HomePage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('TODOS');
  const [busqueda, setBusqueda] = useState('');

  const categorias = ['TODOS', 'Bodas', 'Empresariales', 'Graduaciones', 'Cumpleaños', 'Sociales'];

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .eq('activo', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEventos(data || []);
    } catch (error) {
      console.error('Error cargando eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrado dinámico
  const eventosFiltrados = eventos.filter((e) => {
    const coincideCategoria =
      categoriaSeleccionada === 'TODOS' || e.categoria.toLowerCase() === categoriaSeleccionada.toLowerCase();
    const coincideBusqueda =
      e.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.descripcion_corta?.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* BACKGROUND DECORATION */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl"></div>
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-500/30">
              E
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              Eventos<span className="text-indigo-400">Pro</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <a href="#catalogo" className="hover:text-indigo-400 transition-colors">Catálogo</a>
            <a href="#nosotros" className="hover:text-indigo-400 transition-colors">Por qué elegirnos</a>
            <a href="#contacto" className="hover:text-indigo-400 transition-colors">Contacto</a>
          </nav>

          <Link
            href="/admin/cotizaciones"
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 transition-all hover:scale-105"
          >
            Panel Admin ⚙️
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-16 pb-20 md:pt-28 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-6 shadow-inner">
          <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-ping"></span>
          <span>✨ Experiencias Memorables y Eventos Únicos</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight mb-6">
          Diseñamos tu evento ideal con el <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">toque perfecto</span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Explora nuestros paquetes exclusivos para bodas, graduaciones, eventos corporativos y fiestas privadas. Solicita tu cotización en segundos.
        </p>

        {/* BUSCADOR RÁPIDO */}
        <div className="max-w-xl mx-auto relative mb-12">
          <input
            type="text"
            placeholder="🔍 Buscar paquetes por nombre o tipo de evento..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-slate-900/90 border border-slate-800 focus:border-indigo-500 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xl transition-all"
          />
        </div>

        {/* MÉTRICAS / TRUST BADGES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8 border-t border-slate-800/60">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-indigo-400">+250</div>
            <div className="text-xs text-slate-500 mt-1">Eventos Realizados</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-purple-400">100%</div>
            <div className="text-xs text-slate-500 mt-1">Satisfacción Garantizada</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-pink-400">&lt; 2 hrs</div>
            <div className="text-xs text-slate-500 mt-1">Respuesta a Cotizaciones</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">5.0 ★</div>
            <div className="text-xs text-slate-500 mt-1">Calificación Promedio</div>
          </div>
        </div>
      </section>

      {/* CATÁLOGO Y FILTROS */}
      <section id="catalogo" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Paquetes Disponibles</h2>
            <p className="text-slate-400 text-sm">Selecciona una categoría para explorar opciones personalizadas</p>
          </div>

          {/* FILTROS DE CATEGORÍA */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 mt-6 md:mt-0 no-scrollbar">
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaSeleccionada(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  categoriaSeleccionada === cat
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* LISTADO DE EVENTOS */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-3xl bg-slate-900/60 animate-pulse border border-slate-800/50"></div>
            ))}
          </div>
        ) : eventosFiltrados.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800">
            <p className="text-slate-400 text-sm">No se encontraron paquetes con esos criterios.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventosFiltrados.map((evento) => (
              <div
                key={evento.id}
                className="group bg-slate-900/80 border border-slate-800/80 rounded-3xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between"
              >
                <div>
                  {/* IMAGEN Y CATEGORÍA */}
                  <div className="h-52 relative overflow-hidden">
                    <img
                      src={evento.imagen_principal || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3'}
                      alt={evento.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                    <span className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-indigo-300 text-[11px] font-semibold px-3 py-1 rounded-full">
                      {evento.categoria}
                    </span>
                  </div>

                  {/* CONTENIDO */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                      {evento.titulo}
                    </h3>
                    <p className="text-slate-400 text-xs line-clamp-2 mb-6 leading-relaxed">
                      {evento.descripcion_corta}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-400 pb-4 border-b border-slate-800/60 mb-4">
                      <span>👥 {evento.capacidad_min} - {evento.capacidad_max} Invitados</span>
                      <span className="text-emerald-400 font-semibold">★ Paquete Top</span>
                    </div>
                  </div>
                </div>

                {/* PRECIO Y BOTÓN */}
                <div className="px-6 pb-6 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Desde</span>
                    <span className="text-lg font-black text-white">
                      ${Number(evento.precio_base).toLocaleString('es-MX')} <span className="text-xs font-normal text-slate-400">MXN</span>
                    </span>
                  </div>

                  <Link
                    href={`/eventos/${evento.slug}`}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md hover:shadow-indigo-500/25"
                  >
                    Ver y Cotizar →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

     {/* FOOTER */}
      <footer className="border-t border-slate-800/80 py-10 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} EventosPro. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* ASISTENTE VIRTUAL IA */}
      <ChatIA />
    </div>
  );
}