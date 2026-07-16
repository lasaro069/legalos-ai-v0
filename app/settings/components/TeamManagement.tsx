'use client'

import { useState } from 'react'
import { Card, CardHeader, Badge, Button, inputClass } from "@/components/ui"
import { Users, UserPlus, Trash2 } from "lucide-react"
import { inviteTeamMemberAction, deactivateMemberAction } from '../actions'

export function TeamManagement({ teamMembers, canEdit, firmaId }: { teamMembers: any[], canEdit: boolean, firmaId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('abogado')

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const res = await inviteTeamMemberAction(firmaId, inviteEmail, inviteRole)
    if (res?.error) {
      setError(res.error)
    } else {
      setShowInviteForm(false)
      setInviteEmail('')
      setInviteRole('abogado')
    }
    setLoading(false)
  }

  const handleDeactivate = async (memberUserId: string) => {
    if (!confirm('¿Estás seguro de que deseas desactivar a este miembro? Perderá acceso a la firma.')) return
    
    setLoading(true)
    setError(null)
    const res = await deactivateMemberAction(firmaId, memberUserId)
    if (res?.error) setError(res.error)
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader 
        title="Vista de equipo" 
        subtitle="Miembros de tu despacho y sus roles." 
        action={
          canEdit ? (
            <Button size="sm" variant="secondary" className="flex items-center gap-2" onClick={() => setShowInviteForm(!showInviteForm)}>
              <UserPlus className="h-4 w-4" /> Invitar Miembro
            </Button>
          ) : <Users className="h-4 w-4 text-legal-blue" />
        } 
      />
      
      {showInviteForm && (
        <div className="p-5 border-b bg-slate-50">
          <form onSubmit={handleInvite} className="grid gap-4 md:grid-cols-[1fr_200px_auto] items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <input type="email" required className={inputClass} value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rol</label>
              <select className={inputClass} value={inviteRole} onChange={e => setInviteRole(e.target.value)}>
                <option value="abogado">Abogado</option>
                <option value="auxiliar">Auxiliar Jurídico</option>
                <option value="propietario">Administrador</option>
              </select>
            </div>
            <Button type="submit" disabled={loading} variant="primary">Enviar Invitación</Button>
          </form>
          {error && <div className="mt-4 text-red-500 text-sm p-3 bg-red-50 rounded">{error}</div>}
        </div>
      )}

      <div className="grid gap-3 p-5">
        {teamMembers.map((member) => (
          <div key={member.usuario_id} className="rounded-lg border border-legal-line bg-white p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={member.rol === "propietario" ? "blue" : member.rol === "abogado" ? "green" : "amber"}>{member.rol.toUpperCase()}</Badge>
                <Badge tone={member.estado === "activo" ? "green" : member.estado === "invitado" ? "amber" : "slate"}>{member.estado.toUpperCase()}</Badge>
              </div>
              <p className="mt-3 font-bold text-slate-950">{member.usuarios?.nombre_completo || 'Usuario Pendiente'}</p>
              <p className="mt-1 text-sm text-slate-500">{member.usuarios?.email}</p>
              <p className="mt-1 text-xs font-semibold text-slate-400">{member.usuarios?.ciudad || 'Sin ubicación'}</p>
            </div>
            
            {canEdit && member.rol !== 'propietario' && (
              <div>
                <button 
                  onClick={() => handleDeactivate(member.usuario_id)} 
                  disabled={loading}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                  title="Desactivar Miembro"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
