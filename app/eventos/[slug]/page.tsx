import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import CotizacionForm from '@/components/CotizacionForm';

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventoDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Consultar el evento específico por su slug
  const { data: evento, error } = await supabase
    .from('eventos')
    .select('*')
    .eq('slug', slug)
    .eq('activo', true)
    .single();

  if (error || !evento) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 mb-6 transition-colors"
        >
          ← Volver al catálogo
        </Link>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Galería / Imagen */}
          <div className="h-72 lg:h-full relative min-h-[350px]">
            <img 
              src={evento.imagen_principal} 
              alt={evento.titulo} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Información Detallada y Formulario */}
          <div className="p-8 lg:p-10 flex flex-col justify-between">
            <div>
              <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                {evento.categoria}
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-4">
                {evento.titulo}
              </h1>
              <p className="text-slate-600 mb-6 leading-relaxed">
                {evento.descripcion_detallada || evento.descripcion_corta}
              </p>

              {/* Lista de Servicios Incluidos */}
              {evento.incluye && evento.incluye.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
                    Lo que incluye este paquete:
                  </h3>
                  <ul className="grid grid-cols-1 gap-2">
                    {evento.incluye.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-center text-slate-700 text-sm">
                        <span className="text-emerald-500 font-bold mr-2">✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Precio, Capacidad y Formulario Integrado */}
            <div className="border-t border-slate-100 pt-6 mt-6">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <span className="text-xs text-slate-400 block uppercase font-medium">Precio estimado</span>
                  <span className="text-3xl font-black text-indigo-600">
                    ${Number(evento.precio_base).toLocaleString('es-MX')} MXN
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block uppercase font-medium">Capacidad</span>
                  <span className="text-sm font-semibold text-slate-700">
                    {evento.capacidad_min} a {evento.capacidad_max} invitados
                  </span>
                </div>
              </div>

              {/* Formulario de Cotización */}
              <CotizacionForm eventoId={evento.id} eventoTitulo={evento.titulo} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}