
# C.T.C_Creation.Tool.Checklist

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Unlicense License][license-shield]][license-url]

---

## Sobre o Projeto

**Ferramenta de criação de checklist para auditoria de software**

### Controlador de verção e Editores

- [![GITHUB][GITHUB]][GITHUB-url] [![GIT][GIT]][GIT-url]
- [![VISUAL STUDIO CODE][VS]][VS-url]

---

### Tecnologias Utilizadas

- [![HTML5][HTML5.html]][HTML5-url] [![CSS3][CSS3.css]][CSS3-url]
- [![JS][JS.js]][JS-url]
- [![REACT][react.jsx]][react-url]
- [![VITE][vite.config.js]][vite-url]
- [![PYTHON][python.py]][python-url]
- [![FLASK][flask.py]][flask-url]
- [![SQLITE][sqlite.db]][sqlite-url]

---

## Funcionalidades

- [ IN DEVELOMENT ]

---

## Como rodar o projeto

Siga os passos seguintes para configurar o backend (flask) e frontend (React/Vite)

1. Clonar o repositóriio:

    ```bash
    git clone https://github.com/LucasAioriaSerpa/C.T.C_Creation.Tool.Checklist.git
    ```

    ```bash
    cd C.T.C_Creation.Tool.Checklist
    ```

Configuração do backend

2. Navegue até a pasta do backend [![FLASK][flask.py]][flask-url] :

    ```bash
    cd CTC/backend/API
    ```

3. Criar o ambiente virtual, caso não exista:

    Linux/Mac

    ```warp
    python3 -m venv venv
    ```

    Windows

    ```powershell
    python -m venv venv
    ```

4. Ativando o ambiente virtual:

    Linux/Mac

    ```warp
    source venv/bin/activate
    ```

    Windows

    ```powershell
    venv\Scripts\Activate.ps1
    ```

5. Instalando as dependências do backend:

    ```
    pip install -r requirements.txt
    ```

6. Rodar a API Flask:

    Linux/Mac

    ```warp
    venv/bin/python -m flask run --no-debugger
    ```

    Windows

    ```powershell
    venv\Scripts\python -m flask run --no-debugger
    ```

    ps: O flask vai iniciar na porta 5000 por padrão
    Certifique que a rota `/API/status` existe para o frontend.

Configurando o Frontend ( [![REACT][react.jsx]][react-url] + [![VITE][vite.config.js]][vite-url] ) :

7. Abra outro terminal e navegue até o frontend:

    ```bash
    cd CTC/frontend/react
    ```

8. Instale as dependencias do frontend:

    ```bash
    npm install
    ```

9. Rodando o frontend:

    ```bash
    npm run dev
    ```

    ps: O front vai iniciar na porta 5173

Acessar o projeto

10. Abra o navegador e acesse: http://localhost:5173

---

<!-- //? LINKS & IMAGES -->

[contributors-shield]: https://img.shields.io/github/contributors/LucasAioriaSerpa/C.T.C_Creation.Tool.Checklist.svg?style=for-the-badge
[contributors-url]: https://github.com/LucasAioriaSerpa/C.T.C_Creation.Tool.Checklist/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/LucasAioriaSerpa/C.T.C_Creation.Tool.Checklist.svg?style=for-the-badge
[forks-url]: https://github.com/LucasAioriaSerpa/C.T.C_Creation.Tool.Checklist/network/members
[stars-shield]: https://img.shields.io/github/stars/LucasAioriaSerpa/C.T.C_Creation.Tool.Checklist.svg?style=for-the-badge
[stars-url]: https://github.com/LucasAioriaSerpa/C.T.C_Creation.Tool.Checklist/stargazers
[issues-shield]: https://img.shields.io/github/issues/LucasAioriaSerpa/C.T.C_Creation.Tool.Checklist.svg?style=for-the-badge
[issues-url]: https://github.com/LucasAioriaSerpa/C.T.C_Creation.Tool.Checklist/issues
[license-shield]: https://img.shields.io/github/license/LucasAioriaSerpa/C.T.C_Creation.Tool.Checklist.svg?style=for-the-badge
[license-url]: https://github.com/LucasAioriaSerpa/C.T.C_Creation.Tool.Checklist/blob/master/LICENSE.txt

<!-- //? TOOLS -->
[GITHUB]: https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white
[GITHUB-url]: https://github.com
[GIT]: https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white
[GIT-url]: https://git-scm.com/doc
[VS]: https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white
[VS-url]: https://code.visualstudio.com

<!-- //? TECNOLOGY -->
[HTML5.html]: https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white
[HTML5-url]: https://developer.mozilla.org/docs/Web/HTML
[CSS3.css]: https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white
[CSS3-url]: https://developer.mozilla.org/docs/Web/CSS
[JS.js]: https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black
[JS-url]: https://developer.mozilla.org/docs/Web/JavaScript
[react.jsx]: https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB
[react-url]: https://react.dev
[vite.config.js]: https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white
[vite-url]: https://vite.dev
[python.py]: https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54
[python-url]: https://www.python.org
[flask.py]: https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white
[flask-url]: https://flask.palletsprojects.com/en/stable
[sqlite.db]: https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white
[sqlite-url]: https://sqlite.org
