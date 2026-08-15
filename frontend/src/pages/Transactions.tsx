import {
  useEffect,
  useState,
} from 'react';

import {
  ArrowLeftRight,
  RefreshCw,
} from 'lucide-react';

import { api } from '../api/api';

interface Transaction {
  id?: string;
  transactionId?: string;
  type?: string;
  status?: string;
  amount?: number;
  description?: string;
  createdAt?: string;
  externalReference?: string;
}

function money(value?: number) {
  return new Intl.NumberFormat(
    'pt-BR',
    {
      style: 'currency',
      currency: 'BRL',
    },
  ).format((value ?? 0) / 100);
}

export default function Transactions() {
  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [status, setStatus] =
    useState('');

  const [type, setType] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  async function loadTransactions() {
    setLoading(true);

    try {
      const response =
        await api.get(
          '/wallet/transactions',
          {
            params: {
              ...(status && {
                status,
              }),
              ...(type && {
                type,
              }),
              limit: 50,
            },
          },
        );

      const data =
        response.data;

      setTransactions(
        Array.isArray(data)
          ? data
          : data.transactions ?? [],
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <div>
      <header className="page-header dashboard-header">
        <div>
          <span className="dashboard-eyebrow">
            MOVIMENTAÇÕES
          </span>

          <h1>
            Transações
          </h1>

          <p>
            Consulte e filtre as
            movimentações da sua carteira.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={
            loadTransactions
          }
        >
          <RefreshCw size={16} />
          Atualizar
        </button>
      </header>

      <section className="card">
        <div className="filters-row">
          <div>
            <label>
              Status
            </label>

            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value,
                )
              }
            >
              <option value="">
                Todos
              </option>

              <option value="APPROVED">
                Aprovado
              </option>

              <option value="DENIED">
                Negado
              </option>

              <option value="PENDING">
                Pendente
              </option>
            </select>
          </div>

          <div>
            <label>
              Tipo
            </label>

            <select
              value={type}
              onChange={(event) =>
                setType(
                  event.target.value,
                )
              }
            >
              <option value="">
                Todos
              </option>

              <option value="PIX">
                Pix
              </option>

              <option value="CARD">
                Cartão
              </option>

              <option value="WITHDRAWAL">
                Saque
              </option>
            </select>
          </div>

          <button
            className="button-primary filter-button"
            onClick={
              loadTransactions
            }
          >
            Aplicar filtros
          </button>
        </div>
      </section>

      <section className="card transactions-table-card">
        <div className="card-header">
          <div>
            <h2>
              Extrato da carteira
            </h2>

            <p>
              {transactions.length}{' '}
              movimentações encontradas.
            </p>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Descrição</th>
                <th>Status</th>
                <th>Referência</th>
                <th>Valor</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="table-empty"
                  >
                    Carregando...
                  </td>
                </tr>
              ) : transactions.length ===
                0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="table-empty"
                  >
                    Nenhuma transação
                    encontrada.
                  </td>
                </tr>
              ) : (
                transactions.map(
                  (
                    transaction,
                    index,
                  ) => (
                    <tr
                      key={
                        transaction.id ??
                        transaction.transactionId ??
                        index
                      }
                    >
                      <td>
                        <div className="table-type">
                          <ArrowLeftRight
                            size={15}
                          />

                          {transaction.type ??
                            '-'}
                        </div>
                      </td>

                      <td>
                        {transaction.description ??
                          'Movimentação financeira'}
                      </td>

                      <td>
                        <span
                          className={`status-badge status-${(
                            transaction.status ??
                            'pending'
                          ).toLowerCase()}`}
                        >
                          {transaction.status ??
                            'PENDING'}
                        </span>
                      </td>

                      <td className="reference-cell">
                        {transaction.externalReference ??
                          '-'}
                      </td>

                      <td className="table-money">
                        {money(
                          transaction.amount,
                        )}
                      </td>
                    </tr>
                  ),
                )
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}