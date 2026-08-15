import {
  useEffect,
  useState,
} from 'react';

import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Activity,
  QrCode,
  CreditCard,
} from 'lucide-react';

import {
  useNavigate,
} from 'react-router-dom';

import { api } from '../api/api';
import StatCard from '../components/StatCard';

interface WalletResponse {
  balance?: number;
  availableBalance?: number;
}

interface Transaction {
  id?: string;
  type?: string;
  status?: string;
  amount?: number;
  createdAt?: string;
  description?: string;
}

function formatCurrency(
  value?: number,
) {
  return new Intl.NumberFormat(
    'pt-BR',
    {
      style: 'currency',
      currency: 'BRL',
    },
  ).format((value ?? 0) / 100);
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [wallet, setWallet] =
    useState<WalletResponse | null>(
      null,
    );

  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [loading, setLoading] =
    useState(true);

  const userRaw =
    localStorage.getItem('user');

  const user = userRaw
    ? JSON.parse(userRaw)
    : null;

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [
          walletResponse,
          transactionsResponse,
        ] = await Promise.all([
          api.get('/wallet'),

          api.get(
            '/wallet/transactions',
            {
              params: {
                limit: 5,
              },
            },
          ),
        ]);

        setWallet(
          walletResponse.data,
        );

        const responseData =
          transactionsResponse.data;

        setTransactions(
          Array.isArray(responseData)
            ? responseData
            : responseData.transactions ??
                [],
        );
      } catch (error) {
        console.error(
          'Erro ao carregar dashboard:',
          error,
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        Carregando dashboard...
      </div>
    );
  }

  const balance =
    wallet?.availableBalance ??
    wallet?.balance ??
    0;

  return (
    <div>
      <header className="page-header dashboard-header">
        <div>
          <span className="dashboard-eyebrow">
            VISÃO GERAL
          </span>

          <h1>
            Olá
            {user?.name
              ? `, ${user.name.split(' ')[0]}`
              : ''}
            👋
          </h1>

          <p>
            Acompanhe sua operação
            financeira em tempo real.
          </p>
        </div>

        <button
          className="button-primary"
          onClick={() =>
            navigate('/payments')
          }
        >
          <QrCode size={17} />

          Novo pagamento
        </button>
      </header>

      <section className="stats-grid">
        <StatCard
          title="Saldo disponível"
          value={formatCurrency(balance)}
          subtitle="Disponível para movimentação"
          icon={<Wallet size={20} />}
        />

        <StatCard
          title="Transações recentes"
          value={String(
            transactions.length,
          )}
          subtitle="Últimas movimentações"
          icon={<Activity size={20} />}
        />

        <StatCard
          title="Entradas"
          value={formatCurrency(
            transactions
              .filter(
                (transaction) =>
                  transaction.amount &&
                  transaction.amount > 0,
              )
              .reduce(
                (total, transaction) =>
                  total +
                  (transaction.amount ??
                    0),
                0,
              ),
          )}
          subtitle="Movimentações recentes"
          icon={<ArrowUpRight size={20} />}
        />

        <StatCard
          title="Saídas"
          value={formatCurrency(
            transactions
              .filter(
                (transaction) =>
                  transaction.amount &&
                  transaction.amount < 0,
              )
              .reduce(
                (total, transaction) =>
                  total +
                  Math.abs(
                    transaction.amount ??
                      0,
                  ),
                0,
              ),
          )}
          subtitle="Movimentações recentes"
          icon={<ArrowDownLeft size={20} />}
        />
      </section>

      <section className="dashboard-grid">
        <div className="card transactions-card">
          <div className="card-header">
            <div>
              <h2>
                Atividade recente
              </h2>

              <p>
                Últimas movimentações da
                carteira.
              </p>
            </div>

            <button
              className="text-button"
              onClick={() =>
                navigate(
                  '/transactions',
                )
              }
            >
              Ver todas
            </button>
          </div>

          <div className="transactions-list">
            {transactions.length ===
            0 ? (
              <div className="empty-state">
                Nenhuma transação
                encontrada.
              </div>
            ) : (
              transactions.map(
                (
                  transaction,
                  index,
                ) => (
                  <div
                    className="transaction-row"
                    key={
                      transaction.id ??
                      index
                    }
                  >
                    <div className="transaction-left">
                      <div className="transaction-icon">
                        {transaction.type ===
                        'PIX' ? (
                          <QrCode
                            size={18}
                          />
                        ) : (
                          <CreditCard
                            size={18}
                          />
                        )}
                      </div>

                      <div>
                        <strong>
                          {transaction.type ??
                            'Transação'}
                        </strong>

                        <span>
                          {transaction.description ??
                            'Movimentação financeira'}
                        </span>
                      </div>
                    </div>

                    <div className="transaction-right">
                      <strong>
                        {formatCurrency(
                          transaction.amount,
                        )}
                      </strong>

                      <span
                        className={`status-badge status-${(
                          transaction.status ??
                          'pending'
                        ).toLowerCase()}`}
                      >
                        {transaction.status ??
                          'PENDING'}
                      </span>
                    </div>
                  </div>
                ),
              )
            )}
          </div>
        </div>

        <div className="card quick-actions">
          <div className="card-header">
            <div>
              <h2>
                Ações rápidas
              </h2>

              <p>
                Acesse as principais
                operações.
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              navigate(
                '/payments?type=pix',
              )
            }
          >
            <div className="quick-action-icon">
              <QrCode size={20} />
            </div>

            <div>
              <strong>
                Gerar Pix
              </strong>

              <span>
                Criar cobrança via Pix
              </span>
            </div>
          </button>

          <button
            onClick={() =>
              navigate(
                '/payments?type=card',
              )
            }
          >
            <div className="quick-action-icon">
              <CreditCard
                size={20}
              />
            </div>

            <div>
              <strong>
                Pagamento com cartão
              </strong>

              <span>
                Processar cartão
              </span>
            </div>
          </button>

          <button
            onClick={() =>
              navigate(
                '/withdrawals',
              )
            }
          >
            <div className="quick-action-icon">
              <ArrowDownLeft
                size={20}
              />
            </div>

            <div>
              <strong>
                Solicitar saque
              </strong>

              <span>
                Transferir saldo
              </span>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
}