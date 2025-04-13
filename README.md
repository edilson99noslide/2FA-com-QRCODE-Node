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
