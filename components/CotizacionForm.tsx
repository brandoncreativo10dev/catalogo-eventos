'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface CotizacionFormProps {
  eventoId: string;
  eventoTitulo: string;
}

export default function CotizacionForm({ eventoId, eventoTitulo }: CotizacionFormProps) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fecha, setFecha] = useState('');
  const [invitados, setInvitados] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    try {
      // 1. Guardar la cotización en Supabase
      const { error: supabaseError } = await supabase.from('cotizaciones').insert([
        {
          evento_id: eventoId,
          nombre_cliente: nombre,
          email_cliente: email,
          telefono_cliente: telefono || null,
          fecha_evento: fecha || null,
          numero_invitados: invitados ? parseInt(invitados) : null,
          mensaje: mensaje || null,
          estado: 'PENDIENTE',
        },
      ]);

      if (supabaseError) {
        throw new Error('Error al guardar la cotización: ' + supabaseError.message);
      }

      // 2. Enviar notificación por correo con Resend a través de la API Route
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_cliente: nombre,
          email_cliente: email,
          telefono_cliente: telefono,
          fecha_evento: fecha,
          numero_invitados: invitados,
          mensaje: mensaje,
          evento_titulo: eventoTitulo,
        }),
      });

      alert('¡Cotización enviada con éxito! Te contactaremos muy pronto.');

      // Limpiar el formulario
      setNombre('');
      setEmail('');
      setTelefono('');
      setFecha('');
      setInvitados('');
      setMensaje('');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Ocurrió un error al procesar tu solicitud.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 mt-4">
      <h3 className="text-sm font-bold text-slate-800">Cotizar este paquete</h3>

      <div>
        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nombre Completo *</label>
        <input
          type="text"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej. Brandon Rodríguez"
          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Correo Electrónico *</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@correo.com"
            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Teléfono (WhatsApp)</label>
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Ej. 8126391881"
            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Fecha del Evento</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Invitados</label>
          <input
            type="number"
            value={invitados}
            onChange={(e) => setInvitados(e.target.value)}
            placeholder="Ej. 150"
            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Mensaje o Dudas</label>
        <textarea
          rows={2}
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="¿Alguna preferencia especial?"
          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={enviando}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-sm disabled:bg-indigo-300 mt-2"
      >
        {enviando ? 'Enviando...' : 'Solicitar Cotización'}
      </button>
    </form>
  );
}