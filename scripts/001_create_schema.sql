-- Create custom types
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'recepcao', 'medico', 'paciente');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE consulta_status AS ENUM ('agendada', 'confirmada', 'em_atendimento', 'concluida', 'cancelada');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Organizations table (multi-tenant)
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role DEFAULT 'paciente',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Medicos table
CREATE TABLE IF NOT EXISTS public.medicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  especialidade TEXT NOT NULL,
  crm TEXT NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Horarios table (medico availability)
CREATE TABLE IF NOT EXISTS public.horarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medico_id UUID NOT NULL REFERENCES public.medicos(id) ON DELETE CASCADE,
  dia_semana INTEGER NOT NULL CHECK (dia_semana >= 0 AND dia_semana <= 6),
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Consultas table (appointments)
CREATE TABLE IF NOT EXISTS public.consultas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  medico_id UUID NOT NULL REFERENCES public.medicos(id) ON DELETE CASCADE,
  paciente_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  data_hora TIMESTAMPTZ NOT NULL,
  status consulta_status DEFAULT 'agendada',
  motivo TEXT,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_organization ON public.profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_medicos_organization ON public.medicos(organization_id);
CREATE INDEX IF NOT EXISTS idx_medicos_especialidade ON public.medicos(especialidade);
CREATE INDEX IF NOT EXISTS idx_horarios_medico ON public.horarios(medico_id);
CREATE INDEX IF NOT EXISTS idx_consultas_organization ON public.consultas(organization_id);
CREATE INDEX IF NOT EXISTS idx_consultas_medico ON public.consultas(medico_id);
CREATE INDEX IF NOT EXISTS idx_consultas_paciente ON public.consultas(paciente_id);
CREATE INDEX IF NOT EXISTS idx_consultas_data ON public.consultas(data_hora);
CREATE INDEX IF NOT EXISTS idx_consultas_status ON public.consultas(status);

-- Enable Row Level Security on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultas ENABLE ROW LEVEL SECURITY;
