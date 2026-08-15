import {
  useState,
} from 'react';

import {
  ArrowDownToLine,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

import axios from 'axios';

import { api } from '../api/api';

interface WithdrawalResult {
  id?: string;
  externalReference?: string;
  status?: string;
  amount?: number;
}

export default function Withdrawals() {
  const [amount, setAmount] =
    useState('');

  const [pixKey, setPixKey] =
    useState('');

  const [document, setDocument] =
    useState('');

  const [
    description,
    setDescription,
  ] = useState('');

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [result, setResult] =
    useState<WithdrawalResult | null>(
      null,
    );

  async function handleSubmit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const amountCents =
        Math.round(
          Number(
            amount
              .replace('.', '')
              .replace(',', '.'),
          ) * 100,
        );

      const response =
        await api.post(
          '/withdrawals',
          {
            amount: amountCents,
            pixKey,
            document,
            description,
          },
        );

      setResult(
        response.data,
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message;

        setError(
          Array.isArray(message)
            ? message.join(', ')
            : message ||
                'Não foi possível solicitar o saque.',
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <header className="page-header">
        <span className="dashboard-eyebrow">
          CARTEIRA
        </span>

        <h1>
          Solicitar saque
        </h1>

        <p>
          Transfira parte do saldo da
          sua carteira para uma chave Pix.
        </p>
      </header>

      <div className="withdrawal-layout">
        <section className="card withdrawal-form">
          <div className="card-header">
            <div>
              <h2>
                Dados do saque
              </h2>

              <p>
                Informe os dados da conta
                de destino.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label>
                Valor
              </label>

              <div className="money-input">
                <span>R$</span>

                <input
                  value={amount}
                  onChange={(event) =>
                    setAmount(
                      event.target.value,
                    )
                  }
                  placeholder="100,00"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                Chave Pix
              </label>

              <input
                value={pixKey}
                onChange={(event) =>
                  setPixKey(
                    event.target.value,
                  )
                }
                placeholder="CPF, e-mail, telefone ou chave"
                required
              />
            </div>

            <div className="form-group">
              <label>
                CPF / CNPJ
              </label>

              <input
                value={document}
                onChange={(event) =>
                  setDocument(
                    event.target.value
                      .replace(
                        /\D/g,
                        '',
                      ),
                  )
                }
                required
              />
            </div>

            <div className="form-group">
              <label>
                Descrição
              </label>

              <input
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value,
                  )
                }
                placeholder="Saque para conta pessoal"
                required
              />
            </div>

            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            <button
              className="button-primary payment-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2
                    size={17}
                    className="spin"
                  />
                  Processando...
                </>
              ) : (
                <>
                  <ArrowDownToLine
                    size={17}
                  />
                  Solicitar saque
                </>
              )}
            </button>
          </form>
        </section>

        <section className="card withdrawal-result">
          {result ? (
            <div className="payment-success">
              <div className="result-icon">
                <CheckCircle2
                  size={25}
                />
              </div>

              <span>
                SOLICITAÇÃO ENVIADA
              </span>

              <h2>
                Saque solicitado
              </h2>

              <div
                className={`result-status ${
                  result.status ===
                  'APPROVED'
                    ? ''
                    : result.status ===
                        'DENIED'
                      ? 'denied'
                      : 'pending'
                }`}
              >
                {result.status ??
                  'PENDING'}
              </div>

              <div className="result-info">
                <span>
                  Referência
                </span>

                <strong>
                  {result.externalReference ??
                    '-'}
                </strong>
              </div>
            </div>
          ) : (
            <div className="payment-placeholder">
              <ArrowDownToLine
                size={42}
              />

              <h3>
                Resultado do saque
              </h3>

              <p>
                O status da solicitação
                aparecerá aqui.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}