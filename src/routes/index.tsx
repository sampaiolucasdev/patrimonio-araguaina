import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { useDrawerContext } from "../shared/contexts";
import {
  Dashboard,
  ListagemDeBens,
  DetalheDeBens,
  ListagemDeMovimentacao,
  DetalheDeMovimentacao,
  ListagemDeDepartamento,
  DetalheDeDepartamento,
  ListagemDeSetor,
  DetalheDeSetor,
  ListagemDeUsuario,
  DetalheDeUsuario,
  ListagemDePrediosAdmin,
  DetalheDePrediosAdmin,
  ListagemDeUbs,
  DetalheDeUbs,
  ListagemDeRelatorios,
  DetalheDeRelatorios,
} from "../pages";

export const AppRoutes = () => {
  const { setDrawerOptions } = useDrawerContext();

  useEffect(() => {
    setDrawerOptions([
      {
        icon: "home",
        path: "/pagina-inicial",
        label: "Página Incial",
      },
      {
        icon: "location_city",
        path: "/cidades",
        label: "Cidades",
      },
      {
        icon: "people",
        path: "/pessoas",
        label: "Pessoas",
      },
    ]);
  }, []);
  return (
    <Routes>
      <Route path="/pagina-inicial" element={<Dashboard />} />

      <Route path="/bens" element={<ListagemDeBens />} />
      <Route path="/bens/detalhe/:id" element={<DetalheDeBens />} />

      <Route path="/movimentacoes" element={<ListagemDeMovimentacao />} />
      <Route
        path="/movimentacoes/detalhe/:id"
        element={<DetalheDeMovimentacao />}
      />

      <Route path="/departamento" element={<ListagemDeDepartamento />} />
      <Route
        path="/departamento/detalhe/:id"
        element={<DetalheDeDepartamento />}
      />

      <Route path="/setor" element={<ListagemDeSetor />} />
      <Route path="/setor/detalhe/:id" element={<DetalheDeSetor />} />

      <Route path="/usuario" element={<ListagemDeUsuario />} />
      <Route path="/usuario/detalhe/:id" element={<DetalheDeUsuario />} />

      <Route
        path="/predios-administrativos"
        element={<ListagemDePrediosAdmin />}
      />
      <Route
        path="/predios-administrativos/detalhe/:id"
        element={<DetalheDePrediosAdmin />}
      />

      <Route path="/ubs" element={<ListagemDeUbs />} />
      <Route path="/ubs/detalhe/:id" element={<DetalheDeUbs />} />

      <Route path="/relatorios" element={<ListagemDeRelatorios />} />
      <Route path="/relatorios/detalhe/:id" element={<DetalheDeRelatorios />} />

      <Route path="*" element={<Navigate to="/pagina-inicial" />} />
    </Routes>
  );

  /*Navigate faz o redirecionamento de qualquer nome que não exista(*)
    para a página inicial, para que não apareça uma página em branco. */
};
