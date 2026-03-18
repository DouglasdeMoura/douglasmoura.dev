---
title: O protocolo da internet (IP)
slug: o-protocolo-da-internet-ip
locale: pt-BR
created: 2023-01-11 13:20:20.751Z
updated: 2026-03-18 21:24:53.000Z
tags:
  - Iniciantes
  - Internet
cover: ./cover.jpg
---

O protocolo de internet é, como o próprio nome já diz, um protocolo que define como blocos de dados (chamados **datagramas**) serão transmitidos entre computadores na internet. Cada computador da rede possui, pelo menos um endereço com o qual é identificado na rede. Este endereço é chamado de **endereço de IP**.

<aside data-alert data-color="blue" role="note">
<strong>Mas, o que é um protocolo?</strong>
De maneira sucinta, um protocolo é uma definição do formato e da ordem das mensagens trocadas entre duas ou mais entidades, que são, no nosso caso, computadores. Um protocolo define o que deve ser feito quando uma mensagem é enviada ou recebida, e também o que deve ser feito quando um evento ocorre.
</aside>

O protocolo de internet foi definido, pela primeira vez, no artigo "A Protocol for Packet Network Intercommunication" em maio de 1974, publicado pelo [IEEE](https://www.ieee.org/), escrito por Vinton Cerf e Robert Kahn.

O IP não requer uma conexão contínua entre os pontos de comunicação, ou seja, o computador que envia os dados não verifica se a mensagem foi recebida. Cada pacote trafegado na rede é tratado de maneira totalmente independente, sem relação com outros pacotes. Para verificar se os pacotes chegaram corretamente ao destino e rearranjá-los na ordem correta, utiliza-se o TCP (_Transmission Control Protocol_ - Protocolo de Controle de Transmissão). Sua utilização é tão comum em conjunto com o IP, que nos referimos aos dois protocolos, ao mesmo tempo, como TCP/IP. É bom salientar the o TCP não é o único protocolo da internet.

## Roteamento

Quando enviamos ou recebemos algum dado através da internet, este dado é dividido em pequenas partes chamadas de **pacotes**, que contém o endereço único do remetente e do destinatário (chamado **endereço de IP**). Estes pequenos pacotes são enviados a um _gateway_, que nada mais é do que um computador que conecta duas ou mais redes através de diferentes protocolos. Este gateway verifica se pode encontrar o endereço do destinatário em sua rede. Se não conseguir, encaminha o pacote para o gateway mais próximo, até que o endereço do destinatário seja encontrado (ou retorne um erro, caso o endereço esteja errado ou fora do ar).

Você pode ver o caminho que os pacotes traçam, entre os roteadores da rede, até o destino, com o comando [`traceroute`](https://www.ibm.com/docs/pt-br/power8?topic=commands-traceroute-command) - ou [`tracert`](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/tracert), caso esteja no Windows ou ainda, usando o `traceroute` online do [Registro.br](https://registro.br/tecnologia/ferramentas/traceroute/):

```bash
traceroute google.com
traceroute to google.com (142.251.129.46), 64 hops max, 52 byte packets
 1  192.168.0.1 (192.168.0.1)  7.353 ms  3.096 ms  1.902 ms
 2  100.65.0.1 (100.65.0.1)  8.703 ms  5.352 ms  6.726 ms
 3  45.190.209.1 (45.190.209.1)  6.509 ms  2.820 ms  4.341 ms
 4  172.16.90.1 (172.16.90.1)  9.714 ms  5.157 ms  5.715 ms
 5  172.17.16.41 (172.17.16.41)  9.328 ms  5.390 ms  4.412 ms
 6  172.17.1.74 (172.17.1.74)  8.665 ms  7.749 ms  10.623 ms
 7  142.250.166.121 (142.250.166.121)  9.529 ms  5.825 ms  6.133 ms
 8  * * *
 9  142.251.61.70 (142.251.61.70)  6.626 ms
    172.253.69.202 (172.253.69.202)  5.531 ms
    172.253.73.190 (172.253.73.190)  7.071 ms
10  74.125.243.12 (74.125.243.12)  9.858 ms
    gru06s72-in-f14.1e100.net (142.251.129.46)  7.649 ms
    142.251.76.13 (142.251.76.13)  6.488 ms
```

Como cada pacote é enviado de maneira independente, eles podem chegar ao destinatário através de gateways distintos, e em uma ordem diferente da que foram enviados. É trabalho de outro protocolo, o TCP, de reagrupar estes pacotes na ordem correta e verificar se os dados não foram corrompidos.

Outros protocolos comumente utilizados em conjunto com o IP são:

- UDP (_User Datagram Protocol_): provê um processo de comunicação de baixa latência, largamente utilizado em buscas de DNS e VoIP (_Voice Over IP_ - voz sobre IP);
- HTTP (_Hyper Text Transfer Protocol_): especifica o protocolo de comunicação que habilita os navegadores a exibirem conteúdo;
- FTP (_File Transfer Protocol_): especifica o protocolo de gerenciamento de arquivos em cliente conectados.

## Camadas de protocolos

A internet é composta por uma série de protocolos que se comunicam entre si, e que são organizados em camadas. Cada camada é responsável por uma tarefa específica, e cada camada pode ser implementada de maneira diferente, desde que mantenha a compatibilidade com as camadas superiores e inferiores.

<figure>
  <pre>
Aplicação
Transporte
Rede
Enlace
Físico
  </pre>
  <figcaption>
    A pilha de cinco camadas de protocolos da Internet.
  </figcaption>
</figure>

Uma camada de protocolo pode ser implementada com software ou hardware ou uma combinação dos dois.

### Camada de aplicação

A camada de aplicação é a camada mais próxima do usuário, fornecendo-lhe os mais diversos tipos de serviços, como e-mail, transferência de arquivos, chat, etc.
Os pacotes trafegados nessa camada são chamados de _mensagens_.

### Camada de transporte

A camada de transporte fornece serviços de transporte da camada de aplicação entre diferentes pontos da aplicação. Dois protocolos são utilizados nesta camada: TCP e UDP. O TCP fornece um serviço de transmissão confiável, isto é, este protocolo garante que o destinatário está disponível na rede, divide a mensagens em pequenos pacotes para enviá-las, verifica se as mensagens não foram corrompidas no trajeto e as reconstrói no destino. O UDP fornece um serviço de transmissão não confiável, no sentido que não garante que o destinatário está disponível na rede, não divide a mensagem em pacotes, não verifica se as mensagens não foram corrompidas no trajeto e não as reconstrói no destino. Normalmente, o UDP é utilizado para serviços de streaming, como vídeo e áudio, onde a perda de alguns pacotes não é crítica. Os pacotes trafegados nesta camada são chamados de _segmentos_.

### Camada de rede

A camada de rede fornece serviços de roteamento entre diferentes pontos de rede, de modo a movimentar os pacotes de um ponto a outro. Aqui, além do protocolo IP,
utilizam-se vários outros protocolos de roteamento. Os pacotes trafegados nesta camada são chamados de _datagramas_.

### Camada de enlace

A camada de enlace fornece serviços de transmissão de dados entre dispositivos de rede conectados por um meio de transmissão. A camada de rede depende dos serviços
desta camada para mover os pacotes de um nó a outro da rede. Os pacotes trafegados nesta camada são chamados de _frames_.

### Camada física

O trabalho desta camada consiste em moves os _bits_ individuais dentro de um _frame_ de um nó para o outro. Os protocolos utilizados nesta camada
dependem do meio de transmissão (fibra ótica, cabo coaxial, cabo de par trançado, etc.).

---

**Referências**

- [Internet Protocol (IP)](https://www.techtarget.com/searchunifiedcommunications/definition/Internet-Protocol);
- [RFC 791 - Internet Protocol](https://www.rfc-editor.org/rfc/rfc791);
- [RFC 3439 - Some Internet Architectural Guidelines and Philosophy](https://www.rfc-editor.org/rfc/rfc3439);
- [How Does the Internet Work?](http://web.stanford.edu/class/msande91si/www-spr04/readings/week1/InternetWhitepaper.htm);
- [Traceroute Using an IP Option](https://www.rfc-editor.org/rfc/rfc1393)
- [Computer Networking: A Top-Down Approach (2020, J.F. Kurose, K.W. Ross, Pearson)](http://gaia.cs.umass.edu/kurose_ross/online_lectures.htm).
