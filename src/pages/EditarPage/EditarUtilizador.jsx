import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import * as Api from "../../api/api";
import { useNavigate, useParams } from 'react-router-dom';
import TextInput from "../../components/common/TextInput";
import SubmitButton from "../../components/common/SubmitButton";
import EditarPage from "./EditarPage";
import ReturnButton from "../../components/common/ReturnButton";

export default function EditarUtilizador() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [emailConfirmed, setEmailConfirmed] = useState(false);
    const [roleId, setRoleId] = useState("");
    const [escolaId, setEscolaId] = useState("");
    const [codCurso, setCodCurso] = useState("");
    const [escolas, setEscolas] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [carregado, setCarregado] = useState(false);
    const [loading, setLoading] = useState(false);


    const navigate = useNavigate();
    const { id } = useParams();

    // Carregar dados do utilizador
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await Api.getDetalhesUtilizador(id);
                const data = await res.json();

                setNome(data.nome || "");
                setEmail(data.email || "");
                setEmailConfirmed(data.emailConfirmed || false);
                setRoleId(data.roleId || "");
                setEscolaId(data.escolaId ? data.escolaId.toString() : "");
                setCodCurso(data.codCurso ? data.codCurso.toString() : "");

                setCarregado(true);
            } catch (err) {
                console.error("Erro ao carregar dados:", err);
                toast.error("Erro ao carregar os dados.");
            }
        };

        const fetchEscolas = async () => {
            try {
                const res = await Api.getEscola();
                const data = await res.json();
                setEscolas(data);
            } catch (err) {
                console.error("Erro ao carregar escolas:", err);
            }
        };

        const fetchCursos = async () => {
            try {
                const res = await Api.getCursos();
                const data = await res.json();
                setCursos(data);
            } catch (err) {
                console.error("Erro ao carregar cursos:", err);
            }
        };

        fetchData();
        fetchEscolas();
        fetchCursos();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!nome) {
            toast.error("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        const dto = {
            Id: parseInt(id),
            Nome: nome,
            EmailConfirmed: emailConfirmed,
            RoleId: roleId || null,
            EscolaId: escolaId ? parseInt(escolaId) : null,
            CodCurso: codCurso ? parseInt(codCurso) : null
        };

        setLoading(true);

        try {
            const response = await Api.updateUtilizador(id, dto);

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text);
            }

            const text = await response.text();
            const data = text ? JSON.parse(text) : {};

            if (data.erro) {
                toast.error(data.erro);
            } else {
                toast.success("Utilizador editado com sucesso!");
                navigate('/utilizadores');
            }
        } catch (error) {
            toast.error("Ocorreu um erro ao editar o utilizador.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!carregado) return <div>Carregando...</div>;

    return (
        <EditarPage titulo="Editar Utilizador">
            <form onSubmit={handleSubmit}>
                <TextInput
                    id="nome"
                    label="Nome do Utilizador"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />

                <div className="form-group mt-3">
                    <label htmlFor="email">Email do Utilizador</label>
                    <input
                        type="email"
                        id="email"
                        className="form-control"
                        value={email}
                        disabled
                    />
                </div>

                <div className="form-group mt-3">
                    <label htmlFor="emailConfirmed">Email Confirmado</label>
                    <select
                        id="emailConfirmed"
                        className="form-control"
                        value={emailConfirmed ? "true" : "false"}
                        onChange={(e) => setEmailConfirmed(e.target.value === "true")}
                    >
                        <option value="true">Sim</option>
                        <option value="false">Não</option>
                    </select>
                </div>

                <div className="form-group mt-3">
                    <label htmlFor="roleId">Função</label>
                    <select
                        id="roleId"
                        className="form-control"
                        value={roleId}
                        onChange={(e) => setRoleId(e.target.value)}
                    >
                        <option value="">-- Selecione uma função --</option>
                        <option value="A">Administrador</option>
                        <option value="CH">Comissão de Horários</option>
                        <option value="CC">Comissão de Curso</option>
                    </select>
                </div>

                <div className="form-group mt-3">
                    <label htmlFor="escolaId">Escola</label>
                    <select
                        id="escolaId"
                        className="form-control"
                        value={escolaId}
                        onChange={(e) => setEscolaId(e.target.value)}
                    >
                        <option value="">-- Selecione uma escola --</option>
                        {escolas.map((escola) => (
                            <option key={escola.id} value={escola.id}>
                                {escola.nome}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group mt-3">
                    <label htmlFor="codCurso">Curso</label>
                    <select
                        id="codCurso"
                        className="form-control"
                        value={codCurso}
                        onChange={(e) => setCodCurso(e.target.value)}
                    >
                        <option value="">-- Selecione um curso --</option>
                        {cursos.map((curso) => (
                            <option key={curso.codCurso} value={curso.codCurso}>
                                {curso.nome}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="d-flex justify-content-between mt-4">
                    <SubmitButton loading={loading} text="Editar Utilizador" disabled={loading} />
                    <ReturnButton text="Voltar" endpoint="/utilizadores" />
                </div>
            </form>
        </EditarPage>
    );
}
