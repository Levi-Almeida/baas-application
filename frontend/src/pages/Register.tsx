import {
  useState,
} from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import {
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

import axios from 'axios';

import { api } from '../api/api';

type PersonType = 'PF' | 'PJ';

interface RegisterForm {
  personType: PersonType;
  name: string;
  tradingName: string;
  email: string;
  phone: string;
  document: string;
  zipCode: string;
  address: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

const initialForm: RegisterForm = {
  personType: 'PF',
  name: '',
  tradingName: '',
  email: '',
  phone: '',
  document: '',
  zipCode: '',
  address: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
};

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] =
    useState<RegisterForm>(
      initialForm,
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  function updateField(
    field: keyof RegisterForm,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post(
        '/auth/register',
        form,
      );

      setSuccess(
        'Conta criada com sucesso! Verifique seu e-mail para receber sua senha.',
      );

      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message;

        setError(
          Array.isArray(message)
            ? message.join(', ')
            : message ||
                'Não foi possível criar sua conta.',
        );
      } else {
        setError(
          'Não foi possível criar sua conta.',
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-topbar">
          <Link to="/login">
            <ArrowLeft size={17} />
            Voltar para login
          </Link>

          <div className="register-logo">
            <div className="auth-brand-icon">
              B
            </div>

            <strong>
              BranchFlow
            </strong>
          </div>
        </div>

        <div className="register-header">
          <span>
            CRIAR CONTA
          </span>

          <h1>
            Comece a operar em poucos
            minutos.
          </h1>

          <p>
            Preencha seus dados para
            criar sua conta no ambiente
            sandbox.
          </p>
        </div>

        <form
          className="register-card"
          onSubmit={handleSubmit}
        >
          <div className="form-section">
            <div className="form-section-title">
              <span>01</span>

              <div>
                <h3>
                  Dados da conta
                </h3>

                <p>
                  Informações principais
                  do titular.
                </p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>
                  Tipo de pessoa
                </label>

                <select
                  value={form.personType}
                  onChange={(event) =>
                    updateField(
                      'personType',
                      event.target.value,
                    )
                  }
                >
                  <option value="PF">
                    Pessoa Física
                  </option>

                  <option value="PJ">
                    Pessoa Jurídica
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Nome
                </label>

                <input
                  value={form.name}
                  onChange={(event) =>
                    updateField(
                      'name',
                      event.target.value,
                    )
                  }
                  placeholder="Nome completo"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Nome da loja
                </label>

                <input
                  value={
                    form.tradingName
                  }
                  onChange={(event) =>
                    updateField(
                      'tradingName',
                      event.target.value,
                    )
                  }
                  placeholder="Ex: Minha Loja"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  CPF / CNPJ
                </label>

                <input
                  value={form.document}
                  onChange={(event) =>
                    updateField(
                      'document',
                      event.target.value
                        .replace(
                          /\D/g,
                          '',
                        ),
                    )
                  }
                  placeholder="Somente números"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  E-mail
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    updateField(
                      'email',
                      event.target.value,
                    )
                  }
                  placeholder="voce@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Telefone
                </label>

                <input
                  value={form.phone}
                  onChange={(event) =>
                    updateField(
                      'phone',
                      event.target.value
                        .replace(
                          /\D/g,
                          '',
                        ),
                    )
                  }
                  placeholder="11999999999"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-divider" />

          <div className="form-section">
            <div className="form-section-title">
              <span>02</span>

              <div>
                <h3>Endereço</h3>

                <p>
                  Endereço cadastrado
                  para a conta.
                </p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>CEP</label>

                <input
                  value={form.zipCode}
                  onChange={(event) =>
                    updateField(
                      'zipCode',
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
                <label>Endereço</label>

                <input
                  value={form.address}
                  onChange={(event) =>
                    updateField(
                      'address',
                      event.target.value,
                    )
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Número</label>

                <input
                  value={form.number}
                  onChange={(event) =>
                    updateField(
                      'number',
                      event.target.value,
                    )
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Complemento
                </label>

                <input
                  value={
                    form.complement
                  }
                  onChange={(event) =>
                    updateField(
                      'complement',
                      event.target.value,
                    )
                  }
                />
              </div>

              <div className="form-group">
                <label>Bairro</label>

                <input
                  value={
                    form.neighborhood
                  }
                  onChange={(event) =>
                    updateField(
                      'neighborhood',
                      event.target.value,
                    )
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Cidade</label>

                <input
                  value={form.city}
                  onChange={(event) =>
                    updateField(
                      'city',
                      event.target.value,
                    )
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Estado</label>

                <input
                  value={form.state}
                  maxLength={2}
                  onChange={(event) =>
                    updateField(
                      'state',
                      event.target.value
                        .toUpperCase(),
                    )
                  }
                  placeholder="SP"
                  required
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          {success && (
            <div className="form-success">
              {success}
            </div>
          )}

          <div className="register-actions">
            <span>
              Sua senha será enviada
              pelo gateway para o
              e-mail informado.
            </span>

            <button
              className="button-primary"
              disabled={loading}
            >
              {loading
                ? 'Criando conta...'
                : (
                    <>
                      Criar conta
                      <ArrowRight
                        size={17}
                      />
                    </>
                  )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}