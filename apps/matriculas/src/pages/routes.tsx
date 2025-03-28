import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { MatriculasPage } from './MatriculasPage'
import { MatriculaFormPage } from './MatriculaFormPage'
import { MatriculaDetailsPage } from './MatriculaDetailsPage'
import { SolicitacoesCancelamentoPage } from './SolicitacoesCancelamento'
import { AnaliseCancelamentoPage } from './AnaliseCancelamento'
import { SolicitacaoCancelamentoFormPage } from './SolicitacaoCancelamentoForm'
import { Protected } from '../components/Protected'
import { UserRole } from '../types/auth'

export function AppRoutes() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<MatriculasPage />} />

      {/* Rotas protegidas para administradores */}
      <Route
        path="/matriculas"
        element={
          <Protected requiredRoles={[UserRole.ADMIN]}>
            <MatriculasPage />
          </Protected>
        }
      />
      <Route
        path="/matriculas/nova"
        element={
          <Protected requiredRoles={[UserRole.ADMIN]}>
            <MatriculaFormPage />
          </Protected>
        }
      />
      <Route
        path="/matriculas/:id"
        element={
          <Protected requiredRoles={[UserRole.ADMIN]}>
            <MatriculaDetailsPage />
          </Protected>
        }
      />
      <Route
        path="/matriculas/:id/editar"
        element={
          <Protected requiredRoles={[UserRole.ADMIN]}>
            <MatriculaFormPage />
          </Protected>
        }
      />

      {/* Rotas para cancelamento de matrícula */}
      <Route
        path="/solicitacoes-cancelamento"
        element={
          <Protected requiredRoles={[UserRole.ADMIN]}>
            <SolicitacoesCancelamentoPage />
          </Protected>
        }
      />
      <Route
        path="/solicitacoes-cancelamento/:id"
        element={
          <Protected requiredRoles={[UserRole.ADMIN]}>
            <AnaliseCancelamentoPage />
          </Protected>
        }
      />
      <Route
        path="/solicitacoes-cancelamento/:id/analisar"
        element={
          <Protected requiredRoles={[UserRole.ADMIN]}>
            <AnaliseCancelamentoPage />
          </Protected>
        }
      />

      {/* Rota para alunos solicitarem cancelamento */}
      <Route
        path="/minhas-matriculas/:matriculaId/cancelar"
        element={
          <Protected requiredRoles={[UserRole.ALUNO]}>
            <SolicitacaoCancelamentoFormPage />
          </Protected>
        }
      />
    </Routes>
  )
} 