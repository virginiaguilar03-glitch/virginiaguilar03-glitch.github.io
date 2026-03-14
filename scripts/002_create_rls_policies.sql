-- RLS Policies for Organizations
-- Users can view their own organization
CREATE POLICY "organizations_select_own" ON public.organizations
  FOR SELECT USING (
    id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
  );

-- Only admins can insert organizations
CREATE POLICY "organizations_insert_admin" ON public.organizations
  FOR INSERT WITH CHECK (true);

-- Only admins can update their organization
CREATE POLICY "organizations_update_admin" ON public.organizations
  FOR UPDATE USING (
    id IN (
      SELECT organization_id FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for Profiles
-- Users can view their own profile
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Users in the same organization can view each other (for admins/recepcao)
CREATE POLICY "profiles_select_same_org" ON public.profiles
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
  );

-- Users can insert their own profile
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins can update profiles in their organization
CREATE POLICY "profiles_update_admin" ON public.profiles
  FOR UPDATE USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for Medicos
-- Anyone in the organization can view medicos
CREATE POLICY "medicos_select_same_org" ON public.medicos
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
  );

-- Admins can insert medicos
CREATE POLICY "medicos_insert_admin" ON public.medicos
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update medicos
CREATE POLICY "medicos_update_admin" ON public.medicos
  FOR UPDATE USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can delete medicos
CREATE POLICY "medicos_delete_admin" ON public.medicos
  FOR DELETE USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for Horarios
-- Anyone in the organization can view horarios
CREATE POLICY "horarios_select_same_org" ON public.horarios
  FOR SELECT USING (
    medico_id IN (
      SELECT id FROM public.medicos 
      WHERE organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
    )
  );

-- Admins can manage horarios
CREATE POLICY "horarios_insert_admin" ON public.horarios
  FOR INSERT WITH CHECK (
    medico_id IN (
      SELECT id FROM public.medicos 
      WHERE organization_id IN (
        SELECT organization_id FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );

CREATE POLICY "horarios_update_admin" ON public.horarios
  FOR UPDATE USING (
    medico_id IN (
      SELECT id FROM public.medicos 
      WHERE organization_id IN (
        SELECT organization_id FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );

CREATE POLICY "horarios_delete_admin" ON public.horarios
  FOR DELETE USING (
    medico_id IN (
      SELECT id FROM public.medicos 
      WHERE organization_id IN (
        SELECT organization_id FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );

-- RLS Policies for Consultas
-- Admins and recepcao can view all consultas in their org
CREATE POLICY "consultas_select_staff" ON public.consultas
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'recepcao', 'medico')
    )
  );

-- Pacientes can view their own consultas
CREATE POLICY "consultas_select_own" ON public.consultas
  FOR SELECT USING (paciente_id = auth.uid());

-- Staff can insert consultas
CREATE POLICY "consultas_insert_staff" ON public.consultas
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'recepcao')
    )
  );

-- Staff can update consultas
CREATE POLICY "consultas_update_staff" ON public.consultas
  FOR UPDATE USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'recepcao', 'medico')
    )
  );

-- Admins can delete consultas
CREATE POLICY "consultas_delete_admin" ON public.consultas
  FOR DELETE USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
