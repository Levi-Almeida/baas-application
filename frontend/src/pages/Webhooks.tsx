import {
  useState,
} from 'react';

import {
  Webhook,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

import axios from 'axios';

import { api } from '../api/api';

interface GatewayWebhook {
  id?: string;
  event: string;
  url: string;
  hasSecret?: boolean;
  active?: boolean;
}

export default function Webhooks() {
  const [webhooks, setWebhooks] =
    useState<GatewayWebhook[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [configured, setConfigured] =
    useState(false);

  async function configureWebhooks() {
    setLoading(true);
    setError('');

    try {
      const response =
        await api.post(
          '/webhooks/configure',
        );

      setWebhooks(
        response.data.webhooks ??
          [],
      );

      setConfigured(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data
            ?.message ||
            'Não foi possível configurar os webhooks.',
        );
      }
    } finally {
      setLoading(false);
    }
  }

  const expectedEvents = [
    {
      event: 'PAYMENT_PIX',
      title: 'Pagamento Pix',
      description:
        'Atualizações de cobranças Pix.',
    },
    {
      event: 'PAYMENT_CARD',
      title: 'Pagamento Cartão',
      description:
        'Atualizações de pagamentos com cartão.',
    },
    {
      event: 'WITHDRAWAL',
      title: 'Saques',
      description:
        'Atualizações de solicitações de saque.',
    },
  ];

  return (
    <div>
      <header className="page-header dashboard-header">
        <div>
          <span className="dashboard-eyebrow">
            INTEGRAÇÕES
          </span>

          <h1>
            Webhooks
          </h1>

          <p>
            Gerencie os eventos utilizados
            para conciliação assíncrona.
          </p>
        </div>

        <button
          className="button-primary"
          onClick={
            configureWebhooks
          }
          disabled={loading}
        >
          <RefreshCw
            size={16}
          />

          {loading
            ? 'Configurando...'
            : 'Configurar webhooks'}
        </button>
      </header>

      <section className="webhook-info-card">
        <div className="webhook-info-icon">
          <ShieldCheck
            size={22}
          />
        </div>

        <div>
          <strong>
            Validação segura
          </strong>

          <p>
            Os callbacks utilizam
            assinatura HMAC-SHA256 e são
            processados de forma
            idempotente.
          </p>
        </div>
      </section>

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      {configured && (
        <div className="webhook-success">
          <CheckCircle2 size={17} />

          Webhooks configurados com
          sucesso.
        </div>
      )}

      <div className="webhooks-grid">
        {expectedEvents.map(
          (expected) => {
            const current =
              webhooks.find(
                (item) =>
                  item.event ===
                  expected.event,
              );

            return (
              <article
                className="card webhook-card"
                key={
                  expected.event
                }
              >
                <div className="webhook-card-header">
                  <div className="webhook-event-icon">
                    <Webhook
                      size={20}
                    />
                  </div>

                  <span
                    className={
                      current?.active
                        ? 'webhook-active'
                        : 'webhook-pending'
                    }
                  >
                    {current?.active
                      ? 'ATIVO'
                      : 'AGUARDANDO'}
                  </span>
                </div>

                <h3>
                  {expected.title}
                </h3>

                <p>
                  {
                    expected.description
                  }
                </p>

                <div className="webhook-event-name">
                  {expected.event}
                </div>

                {current?.url && (
                  <div className="webhook-url">
                    <span>
                      Endpoint
                    </span>

                    <code>
                      {
                        current.url
                      }
                    </code>
                  </div>
                )}

                <div className="webhook-security">
                  <ShieldCheck
                    size={14}
                  />

                  {current?.hasSecret
                    ? 'Assinatura HMAC ativa'
                    : 'Proteção configurada pelo backend'}
                </div>
              </article>
            );
          },
        )}
      </div>
    </div>
  );
}