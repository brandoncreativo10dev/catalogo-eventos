'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Cotizacion {
  id: string;
  created_at: string;
  nombre_cliente: string;
  email_cliente: string;
  telefono_cliente: string | null;
  fecha_evento: string | null;
  numero_invitados: number | null;
  mensaje: string | null;
  estado: string;
  evento_id: string | null;
}

export default function AdminCotizacionesPage() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCotizaciones = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('cotizaciones')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener cotizaciones:', error);
    } else {
      setCotizaciones(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCotizaciones();
  }, []);

  const cambiarEstado = async (id: string, nuevoEstado: string) => {
    const { error } = await supabase
      .from('cotizaciones')
      .update({ estado: nuevoEstado })
      .eq('id', id);

    if (error) {
      alert('Error al actualizar el estado: ' + error.message);
    } else {
      setCotizaciones((prev) =>
        prev.map((c) => (c.id === id ? { ...c, estado: nuevoEstado } : c))
      );
    }
  };

  const getWhatsappLink = (telefono: string | null, nombre: string) => {
    if (!telefono) return null;
    const cleanPhone = telefono.replace(/\D/g, '');
    const text = encodeURIComponent(`Hola ${nombre}, recibimos tu solicitud de cotización en EventosPro y nos gustaría ayudarte.`);
    return `https://wa.me/${cleanPhone.length === 10 ? '52' + cleanPhone : cleanPhone}?text=${text}`;
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* NAVEGACIÓN Y CABECERA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
          <div>
            <Link
              href="/"
              className="inline-flex items-center text-xs font-semibold text-indigo-400 hover:text-indigo-300 mb-2 transition-colors"
            >
              ← Volver a la página principal
            </Link>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Panel de Cotizaciones ⚙️️
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Gestiona las solicitudes recibidas y contacta a tus clientes.
            </p>
          </div>

          <button
            onClick={fetchCotizaciones}
            className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-xs font-semibold text-slate-200 transition-all hover:scale-105"
          >
            🔄 Actualizar Tabla
          </button>
        </div>

        {/* TABLA DE SOLICITUDES */}
        {loading ? (
          <div className="h-64 bg-slate-900/50 rounded-2xl animate-pulse border border-slate-800"></div>
        ) : cotizaciones.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-sm">
            No hay cotizaciones registradas aún.
          </div>
        ) : (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                    <th className="py-4 px-4">Fecha</th>
                    <th className="py-4 px-4">Cliente</th>
                    <th className="py-4 px-4">Contacto</th>
                    <th className="py-4 px-4">Detalles</th>
                    <th className="py-4 px-4">Mensaje</th>
                    <th className="py-4 px-4">Estado</th>
                    <th className="py-4 px-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {cotizaciones.map((c) => {
                    const waLink = getWhatsappLink(c.telefono_cliente, c.nombre_cliente);
                    return (
                      <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 px-4 text-slate-400 whitespace-nowrap">
                          {new Date(c.created_at).toLocaleDateString('es-MX', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-4 px-4 font-bold text-white whitespace-nowrap">
                          {c.nombre_cliente}
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-slate-300">{c.email_cliente}</div>
                          <div className="text-slate-500">{c.telefono_cliente || 'N/A'}</div>
                        </td>
                        <td className="py-4 px-4 text-slate-300 whitespace-nowrap">
                          <div>📅 {c.fecha_evento || 'Sin fecha'}</div>
                          <div>👥 {c.numero_invitados || 'N/A'} invitados</div>
                        </td>
                        <td className="py-4 px-4 text-slate-400 max-w-xs truncate">
                          {c.mensaje || 'Sin mensaje'}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <select
                            value={c.estado}
                            onChange={(e) => cambiarEstado(c.id, e.target.value)}
                            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                          >
                            <option value="PENDIENTE">PENDIENTE</option>
                            <option value="CONTACTADO">CONTACTADO</option>
                            <option value="APROBADO">APROBADO</option>
                            <option value="RECHAZADO">RECHAZADO</option>
                          </select>
                        </td>
                        <td className="py-4 px-4 text-center whitespace-nowrap">
                          {waLink ? (
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                            >
                              💬 WhatsApp
                            </a>
                          ) : (
                            <span className="text-slate-600">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}