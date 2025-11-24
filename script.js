document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('botao-busca');
    const homeButton = document.querySelector('header h1');

    let allTeams = [];

    // Carrega os dados e exibe a grade de logos inicial
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            allTeams = data;
            displayLogoGrid(allTeams);
        })
        .catch(error => console.error('Erro ao carregar os dados dos times:', error));

    // Função para formatar o nome do time para o nome do arquivo de logo
    const formatTeamNameToLogoFile = (teamName) => {
        return teamName.toLowerCase().replace(/\s+/g, '_') + '.png';
    };

    // Exibe a grade de logos, separada por conferência e ordenada
    const displayLogoGrid = (teams) => {
        const eastLogosContainer = document.getElementById('east-conference-logos');
        const westLogosContainer = document.getElementById('west-conference-logos');
        const cardContainer = document.getElementById('card-container');
        const logoSection = document.getElementById('logo-section');

        // Limpa containers e garante a exibição correta
        eastLogosContainer.innerHTML = '';
        westLogosContainer.innerHTML = '';
        cardContainer.innerHTML = '';
        logoSection.style.display = 'block';
        cardContainer.style.display = 'none';

        const eastTeams = teams.filter(team => team.conferencia === 'Leste').sort((a, b) => a.nome.localeCompare(b.nome));
        const westTeams = teams.filter(team => team.conferencia === 'Oeste').sort((a, b) => a.nome.localeCompare(b.nome));

        const createLogoElement = (team) => {
            const logoFile = formatTeamNameToLogoFile(team.nome);
            const logoElement = document.createElement('div');
            logoElement.className = 'logo-item';
            logoElement.innerHTML = `<img src="logos/${logoFile}" alt="Logo ${team.nome}" title="${team.nome}"><span class="logo-name">${team.nome}</span>`;
            logoElement.addEventListener('click', () => displayTeamCard(team));
            return logoElement;
        };

        eastTeams.forEach(team => eastLogosContainer.appendChild(createLogoElement(team)));
        westTeams.forEach(team => westLogosContainer.appendChild(createLogoElement(team)));
    };

    // Cria e exibe o card de um time específico
    const displayTeamCard = (team) => {
        const cardContainer = document.getElementById('card-container');
        const logoSection = document.getElementById('logo-section');
        const logoFile = formatTeamNameToLogoFile(team.nome);

        logoSection.style.display = 'none';
        cardContainer.innerHTML = ''; // Limpa cards anteriores

        const card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = `
            <img src="logos/${logoFile}" alt="Logo ${team.nome}" class="card-logo">
            <div class="card-info">
                <button class="back-button">← Voltar</button>
                <h2>${team.nome}</h2>
                <p><strong>Ano de Fundação:</strong> ${team.data_criacao}</p>
                <p><strong>Cidade:</strong> ${team.cidade}</p>
                <p><strong>Conferência:</strong> ${team.conferencia}</p>
                <p><strong>Divisão:</strong> ${team.divisao}</p>
                <p><strong>Técnico:</strong> ${team.tecnico}</p>
                <p>${team.descricao} Para mais detalhes, você pode visitar o <a href="${team.link}" target="_blank">site oficial</a>.</p>
            </div>
        `;

        // Cria e adiciona a lista de jogadores, se existir
        if (team.jogadores && team.jogadores.length > 0) {
            const playerSection = document.createElement('div');
            playerSection.className = 'player-list-container';

            let playerHtml = `
                <h3 class="player-list-title">Elenco</h3>
                <table class="player-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nome</th>
                            <th>Pos.</th>
                            <th>Idade</th>
                            <th>Altura</th>
                            <th>Peso</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            team.jogadores.forEach(player => {
                playerHtml += `
                    <tr>
                        <td>${player.numero}</td>
                        <td>${player.nome}</td>
                        <td>${player.posicao}</td>
                        <td>${player.idade}</td>
                        <td>${player.altura}</td>
                        <td>${player.peso}</td>
                    </tr>
                `;
            });
            playerHtml += '</tbody></table>';

            playerSection.innerHTML = playerHtml;
            card.appendChild(playerSection);
        }

        cardContainer.appendChild(card);

        // Adiciona o evento de clique ao botão "Voltar" que acabamos de criar
        const backButton = card.querySelector('.back-button');
        backButton.addEventListener('click', () => displayLogoGrid(allTeams));

        cardContainer.style.display = 'flex';
    };

    // Função de busca
    const iniciarBusca = () => {
        const searchTerm = searchInput.value.toLowerCase();
        if (!searchTerm) {
            displayLogoGrid(allTeams); // Se a busca for vazia, mostra a grade de logos
            return;
        }

        const results = allTeams.filter(team => team.nome.toLowerCase().includes(searchTerm));
        
        const cardContainer = document.getElementById('card-container');
        const logoSection = document.getElementById('logo-section');

        logoSection.style.display = 'none';
        cardContainer.innerHTML = '';

        if (results.length > 0) {
            results.forEach(team => displayTeamCard(team));
        } else {
            cardContainer.innerHTML = '<p>Nenhum time encontrado.</p>';
        }
        cardContainer.style.display = 'flex';
    };

    // Event Listeners
    searchButton.addEventListener('click', iniciarBusca);
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            iniciarBusca();
        }
    });

    // Clicar no título "Guia de Times da NBA" volta para a tela inicial
    homeButton.addEventListener('click', () => displayLogoGrid(allTeams));
    homeButton.style.cursor = 'pointer';
});