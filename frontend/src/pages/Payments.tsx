import {
  useEffect,
  useState,
} from 'react';

import {
  CreditCard,
  QrCode,
  Copy,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

import {
  useSearchParams,
} from 'react-router-dom';

import axios from 'axios';

import { api } from '../api/api';

type PaymentType = 'pix' | 'card';

type CardBrand =
  | 'VISA'
  | 'MASTERCARD'
  | 'ELO';

interface PixResponse {
  checkoutId: string;
  externalReference: string;
  status: string;
  qrCodeBase64?: string;
  emv?: string;
  txid?: string;
}

interface CardResponse {
  checkoutId: string;
  externalReference: string;
  status: string;
  installments: number;
  feePercent: number;
}

interface Fee {
  id: string;
  brand: CardBrand;
  installments: number;
  feePercent: number;
  feePercentFormatted?: string;
}

export default function Payments() {
  const [searchParams] =
    useSearchParams();

  const initialType =
    searchParams.get('type') === 'card'
      ? 'card'
      : 'pix';

  const [type, setType] =
    useState<PaymentType>(
      initialType,
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [pixResult, setPixResult] =
    useState<PixResponse | null>(
      null,
    );

  const [cardResult, setCardResult] =
    useState<CardResponse | null>(
      null,
    );

  const [amount, setAmount] =
    useState('');

  const [description, setDescription] =
    useState('');

  const [
    payerDocument,
    setPayerDocument,
  ] = useState('');

  const [brand, setBrand] =
    useState<CardBrand>('VISA');

  const [cardNumber, setCardNumber] =
    useState('');

  const [cardHolder, setCardHolder] =
    useState('');

  const [expiryMonth, setExpiryMonth] =
    useState('');

  const [expiryYear, setExpiryYear] =
    useState('');

  const [cvv, setCvv] =
    useState('');

  const [installments, setInstallments] =
    useState(1);

  const [fees, setFees] =
    useState<Fee[]>([]);

  const [feesLoading, setFeesLoading] =
    useState(false);

  function amountInCents() {
    return Math.round(
      Number(
        amount
          .replace('.', '')
          .replace(',', '.'),
      ) * 100,
    );
  }

  useEffect(() => {
    if (type !== 'card') {
      return;
    }

    async function loadFees() {
      setFeesLoading(true);

      try {
        const response =
          await api.get('/fees', {
            params: {
              brand,
            },
          });

        setFees(
          response.data.fees ?? [],
        );

        setInstallments(1);
      } catch (error) {
        console.error(
          'Erro ao carregar taxas:',
          error,
        );

        setFees([]);
      } finally {
        setFeesLoading(false);
      }
    }

    loadFees();
  }, [brand, type]);

  async function handlePix(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    setLoading(true);
    setError('');
    setPixResult(null);

    try {
      const response =
        await api.post(
          '/checkouts/pix',
          {
            amount:
              amountInCents(),
            description,
            payerDocument,
          },
        );

      setPixResult(
        response.data,
      );
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCard(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    setLoading(true);
    setError('');
    setCardResult(null);

    try {
      const response =
        await api.post(
          '/checkouts/card',
          {
            amount:
              amountInCents(),
            description,
            brand,
            cardNumber:
              cardNumber.replace(
                /\D/g,
                '',
              ),
            cardHolder,
            expiryMonth,
            expiryYear,
            cvv,
            installments,
          },
        );

      setCardResult(
        response.data,
      );
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }

  function handleError(
    error: unknown,
  ) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message.join(', ')
          : message ||
              'Não foi possível processar o pagamento.',
      );

      return;
    }

    setError(
      'Não foi possível processar o pagamento.',
    );
  }

  async function copyPix() {
    if (!pixResult?.emv) {
      return;
    }

    await navigator.clipboard.writeText(
      pixResult.emv,
    );
  }

  const selectedFee =
    fees.find(
      (fee) =>
        fee.installments ===
        installments,
    );

  return (
    <div>
      <header className="page-header">
        <span className="dashboard-eyebrow">
          PAGAMENTOS
        </span>

        <h1>
          Novo pagamento
        </h1>

        <p>
          Gere cobranças via Pix ou
          processe pagamentos com cartão.
        </p>
      </header>

      <div className="payment-tabs">
        <button
          className={
            type === 'pix'
              ? 'active'
              : ''
          }
          onClick={() => {
            setType('pix');
            setError('');
          }}
        >
          <QrCode size={18} />
          Pix
        </button>

        <button
          className={
            type === 'card'
              ? 'active'
              : ''
          }
          onClick={() => {
            setType('card');
            setError('');
          }}
        >
          <CreditCard size={18} />
          Cartão
        </button>
      </div>

      <div className="payment-layout">
        <section className="card payment-form-card">
          {type === 'pix' ? (
            <>
              <div className="card-header">
                <div>
                  <h2>
                    Cobrança Pix
                  </h2>

                  <p>
                    O QR Code será
                    gerado automaticamente.
                  </p>
                </div>
              </div>

              <form
                onSubmit={handlePix}
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
                          event.target
                            .value,
                        )
                      }
                      placeholder="150,00"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    Descrição
                  </label>

                  <input
                    value={description}
                    onChange={(event) =>
                      setDescription(
                        event.target
                          .value,
                      )
                    }
                    placeholder="Ex: Pedido #123"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Documento do pagador
                  </label>

                  <input
                    value={
                      payerDocument
                    }
                    onChange={(event) =>
                      setPayerDocument(
                        event.target
                          .value
                          .replace(
                            /\D/g,
                            '',
                          ),
                      )
                    }
                    placeholder="CPF ou CNPJ"
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
                      Gerando Pix...
                    </>
                  ) : (
                    <>
                      <QrCode
                        size={17}
                      />
                      Gerar Pix
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="card-header">
                <div>
                  <h2>
                    Pagamento com cartão
                  </h2>

                  <p>
                    Os dados são enviados
                    diretamente ao gateway.
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleCard}
              >
                <div className="payment-form-grid">
                  <div className="form-group full">
                    <label>
                      Valor
                    </label>

                    <div className="money-input">
                      <span>R$</span>

                      <input
                        value={amount}
                        onChange={(
                          event,
                        ) =>
                          setAmount(
                            event.target
                              .value,
                          )
                        }
                        placeholder="250,00"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group full">
                    <label>
                      Descrição
                    </label>

                    <input
                      value={
                        description
                      }
                      onChange={(
                        event,
                      ) =>
                        setDescription(
                          event.target
                            .value,
                        )
                      }
                      placeholder="Compra loja online"
                      required
                    />
                  </div>

                  <div className="form-group full">
                    <label>
                      Número do cartão
                    </label>

                    <input
                      value={
                        cardNumber
                      }
                      onChange={(
                        event,
                      ) =>
                        setCardNumber(
                          event.target
                            .value,
                        )
                      }
                      placeholder="4111 1111 1111 1111"
                      required
                    />
                  </div>

                  <div className="form-group full">
                    <label>
                      Nome impresso
                    </label>

                    <input
                      value={
                        cardHolder
                      }
                      onChange={(
                        event,
                      ) =>
                        setCardHolder(
                          event.target
                            .value
                            .toUpperCase(),
                        )
                      }
                      placeholder="NOME SOBRENOME"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Mês
                    </label>

                    <input
                      value={
                        expiryMonth
                      }
                      maxLength={2}
                      onChange={(
                        event,
                      ) =>
                        setExpiryMonth(
                          event.target
                            .value
                            .replace(
                              /\D/g,
                              '',
                            ),
                        )
                      }
                      placeholder="12"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Ano
                    </label>

                    <input
                      value={
                        expiryYear
                      }
                      maxLength={4}
                      onChange={(
                        event,
                      ) =>
                        setExpiryYear(
                          event.target
                            .value
                            .replace(
                              /\D/g,
                              '',
                            ),
                        )
                      }
                      placeholder="2030"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      CVV
                    </label>

                    <input
                      type="password"
                      value={cvv}
                      maxLength={4}
                      onChange={(
                        event,
                      ) =>
                        setCvv(
                          event.target
                            .value
                            .replace(
                              /\D/g,
                              '',
                            ),
                        )
                      }
                      placeholder="123"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Bandeira
                    </label>

                    <select
                      value={brand}
                      onChange={(
                        event,
                      ) =>
                        setBrand(
                          event.target
                            .value as CardBrand,
                        )
                      }
                    >
                      <option value="VISA">
                        Visa
                      </option>

                      <option value="MASTERCARD">
                        Mastercard
                      </option>

                      <option value="ELO">
                        Elo
                      </option>
                    </select>
                  </div>

                  <div className="form-group full">
                    <label>
                      Parcelamento
                    </label>

                    <select
                      value={
                        installments
                      }
                      disabled={
                        feesLoading
                      }
                      onChange={(
                        event,
                      ) =>
                        setInstallments(
                          Number(
                            event.target
                              .value,
                          ),
                        )
                      }
                    >
                      {fees.map(
                        (fee) => (
                          <option
                            key={fee.id}
                            value={
                              fee.installments
                            }
                          >
                            {
                              fee.installments
                            }
                            x — taxa{' '}
                            {
                              fee.feePercent
                            }
                            %
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                </div>

                {selectedFee && (
                  <div className="fee-summary">
                    <span>
                      Taxa selecionada
                    </span>

                    <strong>
                      {
                        selectedFee.feePercent
                      }
                      %
                    </strong>
                  </div>
                )}

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
                      <CreditCard
                        size={17}
                      />
                      Processar cartão
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </section>

        <aside className="card payment-result-card">
          {type === 'pix' &&
          pixResult ? (
            <div className="payment-success">
              <div className="result-icon">
                <CheckCircle2
                  size={25}
                />
              </div>

              <span>
                COBRANÇA GERADA
              </span>

              <h2>
                Pix criado com sucesso
              </h2>

              <div className="result-status">
                {pixResult.status}
              </div>

              {pixResult.qrCodeBase64 && (
                <div className="pix-qrcode">
                  <img
                    src={
                      pixResult.qrCodeBase64
                    }
                    alt="QR Code Pix"
                  />
                </div>
              )}

              {pixResult.emv && (
                <button
                  className="copy-button"
                  onClick={copyPix}
                >
                  <Copy size={16} />
                  Copiar Pix
                </button>
              )}

              <div className="result-info">
                <span>
                  Referência
                </span>

                <strong>
                  {
                    pixResult.externalReference
                  }
                </strong>
              </div>
            </div>
          ) : type === 'card' &&
            cardResult ? (
            <div className="payment-success">
              <div className="result-icon">
                <CheckCircle2
                  size={25}
                />
              </div>

              <span>
                PAGAMENTO PROCESSADO
              </span>

              <h2>
                Resultado do cartão
              </h2>

              <div
                className={`result-status ${
                  cardResult.status ===
                  'APPROVED'
                    ? ''
                    : 'denied'
                }`}
              >
                {cardResult.status}
              </div>

              <div className="result-info">
                <span>
                  Referência
                </span>

                <strong>
                  {
                    cardResult.externalReference
                  }
                </strong>
              </div>

              <div className="result-info">
                <span>
                  Parcelas
                </span>

                <strong>
                  {
                    cardResult.installments
                  }
                  x
                </strong>
              </div>

              <div className="result-info">
                <span>
                  Taxa
                </span>

                <strong>
                  {
                    cardResult.feePercent
                  }
                  %
                </strong>
              </div>
            </div>
          ) : (
            <div className="payment-placeholder">
              {type === 'pix' ? (
                <QrCode size={42} />
              ) : (
                <CreditCard
                  size={42}
                />
              )}

              <h3>
                Resultado da operação
              </h3>

              <p>
                Após processar o pagamento,
                os detalhes aparecerão aqui.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}