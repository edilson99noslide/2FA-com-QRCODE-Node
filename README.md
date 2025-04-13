## Implementando 2FA com QR Code em Node.js

### Rodando o projeto

- **Instalar dependências**
```shell
npm i
```

- **Buildando o docker**: É importante rodar no terminal do linux
```shell
docker-compose up --force-recreate --build
```

- **Rodando as migrates**
```shell
npm run sequelize:migrate
```

- **Rodando as seed**
```shell
npm run sequelize:seed
```

- **Rodando o projeto**
```shell
npm run dev
```

- **Rodando o docker**
```shell
docker-compose up -d
```

### Libs utilizadas

- **otplib**
```shell
npm i otplib
```

- **Gerar QRCode**
```shell
npm i qrcode
```

- **Configuração do banco**: Fica em `docker-compose.yml`

### Conceitos

- **OTP**: Senha de uso único, ou seja, pode ser usada apenas uma vez. Após isso, será invalidada — isso ajuda a proteger contra ataques de repetição. Pode ser implementada
de diversas formas, como HOTP ou TOTP. Um exemplo é quando você recebe um código por SMS ou por aplicativo autenticador.

- **HOTP**: Usa uma chave secreta fixa e um contador que é incrementado a cada uso. O código gerado muda conforme o contador avança.
1. Baseado em eventos: o código só muda quando algo acontece (ex: o usuário solicita uma nova senha).
2. Requer sincronização do contador entre cliente e servidor.

- **TOTP**: Parecido com HOTP, mas o "fator de movimento" é baseado no tempo atual (geralmente em janelas de 30 segundos).
1. Baseado em tempo: o código muda automaticamente a cada intervalo de tempo.
2. Muito usado com aplicativos como Google Authenticator.
3. É o que aparece quando você escaneia um QR Code para configurar 2FA.

### Como testar

- **Crie as rotas no seu client HTTP**
1. POST de login http://localhost:3000/auth
```json
{
    "email": "teste@user.com",
    "password": "1234"
}
```

2. POST para gerar um QRCode http://localhost:3000/generate-qr-code


3. POST para ativar o 2FA no login http://localhost:3000/activate-two-factor
```json
{
  "token": "123456"
}
```

- **Fluxo de teste**
1. Após criar as rotas, faça login na rota de login somente com o email e senha
2. Faça uma requisição para a rota de gerar token, ele irá retornar uma imagem do QRCode
3. Escaneie o QRCode em algum app de autenticação, você pode usar o Authenticator do google
4. Após escanear o QRCode, irá aparecer um timer com um código, encima do código aparecerá o nome
do app como QR Code Rocketseat: ${userId}
5. Faça uma requisição para a rota de ativar o 2FA passando o token gerado pelo app
6. Após ativar o 2FA no usuário, você deve passar mais um campo no login, o twoFactorToken
```json
{
  "email": "teste@user.com",
  "password": "1234",
  "twoFactorToken": "123456"
}
```
