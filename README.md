# Roteiro — Teleprompter

Um teleprompter leve, responsivo e sem dependências. O roteiro é guardado no armazenamento local do navegador neste dispositivo.

## Executar no computador

1. Baixe ou descompacte esta pasta.
2. Abra `index.html` em um navegador atualizado (Chrome, Edge, Firefox ou Safari).
3. Cole seu texto, ajuste velocidade e tamanho da fonte e selecione **Começar leitura**.

Também pode servir a pasta por um servidor local, se preferir. O projeto não precisa de instalação, compilação, conta ou chave de API. A fonte DM Sans/Manrope pode carregar da internet; se estiver offline, o navegador usa fontes alternativas.

## Controles

- **Começar leitura / Pausar leitura** — inicia ou pausa sem perder a posição.
- **Reiniciar** — volta ao começo.
- **Espelhar** — inverte horizontalmente a leitura para uso com espelho de teleprompter.
- **Tela cheia** — amplia a área de leitura; pressione **Esc** para sair.
- O roteiro começa na linha-guia, um pouco acima do meio da tela, e segue rolando a partir dela.
- **Velocidade** — controla o ritmo de rolagem.
- **Tamanho do texto** — ajusta o tamanho para facilitar a leitura à distância.
- **Espaço** — inicia/pausa. **R** — reinicia. **Esc** — pausa.
- O texto é salvo automaticamente neste navegador. Use **Limpar** para apagá-lo.

## Publicar na internet

É um site estático. Publique os arquivos `index.html`, `styles.css` e `script.js` em qualquer hospedagem de sites estáticos, como **GitHub Pages**, **Netlify**, **Cloudflare Pages** ou **Vercel**. Em geral, basta criar um site novo, enviar esta pasta (ou conectá-la a um repositório Git) e manter `index.html` como arquivo de entrada. Essas plataformas fornecem um endereço público HTTPS. A configuração exata varia conforme o serviço e seu plano.

### Exemplo: GitHub Pages

1. Crie um repositório no GitHub e envie os três arquivos do site.
2. No repositório, abra **Settings → Pages**.
3. Em **Build and deployment**, escolha **Deploy from a branch**, selecione a branch principal e a pasta `/ (root)`, e salve.
4. Aguarde a publicação e abra o endereço mostrado na área Pages.

## Privacidade

O roteiro não é enviado a um servidor: ele fica no `localStorage` do navegador usado. Para remover o roteiro, use **Limpar** ou apague os dados locais do site no navegador. Se abrir o site em outro navegador ou dispositivo, o roteiro não será transferido.
