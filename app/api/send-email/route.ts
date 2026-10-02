import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Reemplaza 're_123456789' con tu API Key real de Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre_cliente, email_cliente, telefono_cliente, fecha_evento, numero_invitados, mensaje } = body;

    const data = await resend.emails.send({
      from: 'Cotizaciones <onboarding@resend.dev>', // Email por defecto durante pruebas
      to: ['brandon.creativo10@gmail.com'], // <-- COLOCA AQUÍ TU CORREO DONDE QUIERES RECIBIR LAS NOTIFICACIONES
      subject: `Nueva Cotización: ${nombre_cliente}`,
      html: `
        <h2>¡Nueva solicitud de cotización recibida!</h2>
        <p><strong>Cliente:</strong> ${nombre_cliente}</p>
        <p><strong>Email:</strong> ${email_cliente}</p>
        <p><strong>Teléfono:</strong> ${telefono_cliente || 'No especificado'}</p>
        <p><strong>Fecha del Evento:</strong> ${fecha_evento || 'Sin fecha'}</p>
        <p><strong>Número de Invitados:</strong> ${numero_invitados || 'No especificado'}</p>
        <p><strong>Mensaje:</strong> ${mensaje || 'Sin mensaje'}</p>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Error enviando el correo' }, { status: 500 });
  }
}