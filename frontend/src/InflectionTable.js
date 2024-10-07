import React from 'react';

function InflectionTable({ data }) {
  if (!data || !data[0] || !data[0].bmyndir) {
    return <p>No hay datos de inflexión disponibles.</p>;
  }

  const bmyndir = data[0].bmyndir;
  const cases = ['NF', 'ÞF', 'ÞGF', 'EF'];
  const numbers = ['ET', 'FT'];

  const getForm = (casePrefix, number, definite) => {
    const suffix = definite ? 'gr' : '';
    const form = bmyndir.find(b => b.g === `${casePrefix}${number}${suffix}`);
    return form ? form.b : '-';
  };

  return (
    <div className="inflection-table">
      <h2>Tabla de Inflexiones: {data[0].ord}</h2>
      <table>
        <thead>
          <tr>
            <th>Caso</th>
            <th>Singular Indefinido</th>
            <th>Singular Definido</th>
            <th>Plural Indefinido</th>
            <th>Plural Definido</th>
          </tr>
        </thead>
        <tbody>
          {cases.map(casePrefix => (
            <tr key={casePrefix}>
              <td>{getCaseName(casePrefix)}</td>
              {numbers.map(number => (
                <React.Fragment key={number}>
                  <td>{getForm(casePrefix, number, false)}</td>
                  <td>{getForm(casePrefix, number, true)}</td>
                </React.Fragment>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p>Tipo: {data[0].ofl_heiti}, Género: {getGender(data[0].kyn)}</p>
    </div>
  );
}

function getCaseName(casePrefix) {
  switch (casePrefix) {
    case 'NF': return 'Nominativo';
    case 'ÞF': return 'Acusativo';
    case 'ÞGF': return 'Dativo';
    case 'EF': return 'Genitivo';
    default: return casePrefix;
  }
}

function getGender(kyn) {
  switch (kyn) {
    case 'kk': return 'Masculino';
    case 'kvk': return 'Femenino';
    case 'hk': return 'Neutro';
    default: return kyn;
  }
}

export default InflectionTable;