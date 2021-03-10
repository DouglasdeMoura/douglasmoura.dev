import { useRouter } from 'next/router';
// Key should always be in English
const localization = {
  'MMMM, LL y': {
    'pt-BR': `LL 'de' MMMM 'de' y`,
  },
  'Skip to content': {
    'pt-BR': 'Pular para o conteúdo',
  },
  'Home': {
    'pt-BR': 'Início',
  },
  'About': {
    'pt-BR': 'Sobre',
  },
  'Contact': {
    'pt-BR': 'Contato',
  },
  'Hi, my name is <strong>Douglas Moura</strong>,<br /> Software Engineer, dad and amateur saxophonist.': {
    'pt-BR': 'Olá, meu nome é <strong>Douglas Moura</strong>,<br /> engenheiro de software, pai e saxofonista nas horas vagas.'
  },
  'Last posts': {
    'pt-BR': 'Últimos artigos',
  },
  'See all posts': {
    'pt-BR': 'Ver todos os artigos',
  },
  'Read More': {
    'pt-BR': 'Continue lendo',
  },
  '{0} minutes': {
    'pt-BR': '{0} minutos',
  },
  '1 minute': {
    'pt-BR': '1 minuto',
  },
  'Less than a minute': {
    'pt-BR': 'Menos de um minuto',
  },
  'Posted on': {
    'pt-BR': 'Publicado em',
  },
  'Updated at': {
    'pt-BR': 'Atualizado em',
  },
  'Software Engineer': {
    'pt-BR': 'Engenheiro de Software',
  },
  'by': {
    'pt-BR': 'por',
  },
  'Copy link': {
    'pt-BR': 'Copiar link',
  },
  'Share': {
    'pt-BR': 'Compartilhar',
  },
};

export function getLocale() {
  const { locale } = useRouter();
  return locale;
}

export function getDefaultLocale() {
  const { defaultLocale } = useRouter();
  return defaultLocale
}

export default function __(text: string) {
  const { locale } = useRouter();

  if (locale === 'en')
    return text;

  return localization[text][locale];
}
