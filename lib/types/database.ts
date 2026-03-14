export type UserRole = 'admin' | 'recepcao' | 'medico' | 'paciente'

export type ConsultaStatus = 'agendada' | 'confirmada' | 'em_atendimento' | 'concluida' | 'cancelada'

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          organization_id: string | null
          email: string
          full_name: string | null
          role: UserRole
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          organization_id?: string | null
          email: string
          full_name?: string | null
          role?: UserRole
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string | null
          email?: string
          full_name?: string | null
          role?: UserRole
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      medicos: {
        Row: {
          id: string
          organization_id: string
          profile_id: string | null
          nome: string
          especialidade: string
          crm: string
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          profile_id?: string | null
          nome: string
          especialidade: string
          crm: string
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          profile_id?: string | null
          nome?: string
          especialidade?: string
          crm?: string
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      horarios: {
        Row: {
          id: string
          medico_id: string
          dia_semana: number
          hora_inicio: string
          hora_fim: string
          created_at: string
        }
        Insert: {
          id?: string
          medico_id: string
          dia_semana: number
          hora_inicio: string
          hora_fim: string
          created_at?: string
        }
        Update: {
          id?: string
          medico_id?: string
          dia_semana?: number
          hora_inicio?: string
          hora_fim?: string
          created_at?: string
        }
      }
      consultas: {
        Row: {
          id: string
          organization_id: string
          medico_id: string
          paciente_id: string
          data_hora: string
          status: ConsultaStatus
          motivo: string | null
          observacoes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          medico_id: string
          paciente_id: string
          data_hora: string
          status?: ConsultaStatus
          motivo?: string | null
          observacoes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          medico_id?: string
          paciente_id?: string
          data_hora?: string
          status?: ConsultaStatus
          motivo?: string | null
          observacoes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      user_role: UserRole
      consulta_status: ConsultaStatus
    }
  }
}

export type Organization = Database['public']['Tables']['organizations']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Medico = Database['public']['Tables']['medicos']['Row']
export type Horario = Database['public']['Tables']['horarios']['Row']
export type Consulta = Database['public']['Tables']['consultas']['Row']
