import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, WalletCards } from 'lucide-react';
import axios from 'axios';

import { api } from '../api/api';

export default function Login() {
  const navigate = useNavigate();

  const [document, setDocument] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', {
        document,
        password,
      });

      localStorage.setItem(
        'accessToken',
        response.data.accessToken,
      );

      localStorage.setItem(
        'user',
        JSON.stringify(response.data.user),
      );

      navigate('/dashboard');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message;

        setError(
          Array.isArray(message)
            ? message.join(', ')
            : message ||
                'Documento ou senha inválidos.',
        );
      } else {
        setError(
          'Não foi possível realizar o login.',
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-hero">
        <div className="auth-brand">
          <div className="auth-brand-icon">
            B
          </div>

          <div>
            <strong>BranchFlow</strong>
            <span>BaaS Platform</span>
          </div>
        </div>

        <div className="auth-hero-content">
          <span className="auth-badge">
            PLATAFORMA FINANCEIRA
          </span>

          <h1>
            Sua operação financeira,
            <br />
            em um único lugar.
          </h1>

          <p>
            Gerencie pagamentos, carteira,
            transações e saques com uma
            experiência simples e segura.
          </p>

          <div className="auth-benefits">
            <div>
              <ShieldCheck size={20} />
              Autenticação segura
            </div>

            <div>
              <WalletCards size={20} />
              Pagamentos PIX e cartão
            </div>
          </div>
        </div>

        <span className="auth-environment">
          Ambiente sandbox • Não utilize dados
          financeiros reais
        </span>
      </section>

      <section className="auth-form-section">
        <div className="auth-card">
          <div className="auth-card-header">
            <span>Bem-vindo de volta</span>

            <h2>Entre na sua conta</h2>

            <p>
              Acesse seu painel financeiro.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>CPF ou CNPJ</label>

              <input
                type="text"
                value={document}
                onChange={(event) =>
                  setDocument(
                    event.target.value.replace(
                      /\D/g,
                      '',
                    ),
                  )
                }
                placeholder="Digite seu documento"
                required
              />
            </div>

            <div className="form-group">
              <label>Senha</label>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value,
                  )
                }
                placeholder="Digite sua senha"
                required
              />
            </div>

            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            <button
              className="button-primary auth-submit"
              disabled={loading}
            >
              {loading
                ? 'Entrando...'
                : (
                    <>
                      Entrar
                      <ArrowRight size={18} />
                    </>
                  )}
            </button>
          </form>

          <div className="auth-footer">
            Ainda não possui uma conta?

            <Link to="/register">
              Criar conta
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}