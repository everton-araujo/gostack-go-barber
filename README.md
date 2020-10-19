# Funcionalidades a serem desenvolvidas
****
## Recuperação de senha 

**RF**

- Usuário pode recuperar sua senha informando seu e-mail
- Usuário recebe e-mail com as instruções de recuperação de senha;
- Usuário consegue redefinir sua senha;

**RNF**

- Utilizar Mailtrap para testar envios de e-mail em ambiente de desenvolvimento;
- Utilizar Amazon SES para envios de e-mail em ambiente de produção;
- O envio de e-mails deve acontecer em segundo plano (background job);

**RN**

- Link enviado por e-mail para redefinição de senha deve expirar em 2 horas;
- Usuário precisa confirmar nova senha na redefinição;

## Atualização do perfil

**RF**

- Usuário pode atualizar nome, e-mail e senha;

**RN**

- Usuário não pode alterar seu e-mail para um já existente no banco;
- Para atualizar senha, usuário deve informar senha antiga;
- Para atualizar senha, usuário precisa confirmar nova senha;

## Painel do prestador 

**RF**

- Prestador pode listar seus agendamentos em data específica;
- Prestador deve receber notificação sempre que houver um novo agendamento;
- Mensagens não lidas ficam destacadas;

**RNF**

- Agendamentos do prestador no dia devem ser armazenadas em cache;
- Notificações do prestador ficaram armazenadas no MongoDB;
- Notificações do prestador serão enviadas em tempo real utilizando Socket.io;

**RN**

- Notificação deve ter um status de lida ou não lida para que o prestador consiga fazer o controle;

## Agendamento de serviços 

**RF**

- Usuário pode listar todos prestadores de serviço cadastrados;
- Usuário pode listar os dias disponíveis do prestador selecionado;
- Usuário pode listar os horários disponíveis do dia selecionado do prestador;
- Usuário pode realizar novo agendamento com um prestador;

**RNF**

- Listagem de prestadores deve ser armazenada em cache;

**RN**

- Cada agendamento deve durar 1 hora;
- Os agendamentos devem estar disponíveis entre 8h às 18h  (primeiro às 8h, último às 17h);
- Usuário não pode agendar em horário já ocupado;
- Usuário não pode agendar em horário do passado;
