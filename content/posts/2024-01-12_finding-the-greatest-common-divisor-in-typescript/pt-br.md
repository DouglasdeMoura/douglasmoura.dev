---
title: Encontrando o maior divisor comum em TypeScript
slug: encontrando-o-maior-divisor-comum-em-type-script
locale: pt-BR
created: 2024-01-25 13:47:59.773Z
updated: 2024-01-25 13:56:47.886Z
tags:
  - javascript
  - mathematic
  - typescript
cover: ./cover.jpg
type: post
---

Primeiramente descrito no clássico livro de geometria _Elementos_, pelo matemático grego antigo Euclides (cerca de 300 a.C., no livro VII, proposição 2), o método de encontrar o maior divisor comum entre os números positivos $a$ e $b$, sendo $a > b$, consiste no conhecimento de que os divisores comuns de $a$ e $b$ são os mesmos de $a - b$ e $b$. Portanto, podemos encontrar esse maior divisor comum substituindo o maior número ($a$) pela diferença entre os dois números ($a - b$), repetidamente, até que os dois números sejam iguais. Em TypeScript, podemos fazer isso assim:

```typescript
const gcd = (a: number, b: number): number => {
  // Quando `a` for igual a `b`, retorna o resultado
  if (a === b) {
    return a;
  }

  // Enquanto `a` é maior que b, chama a função novamente
  // com o novo `a` sendo `a - b`:
  if (a > b) {
    return gcd(a - b, b);
  }

  // Se o novo `b` for maior que `a`,
  // subtraia `a` de `b`.
  return gcd(a, b - a);
};
```

Este método pode ser muito lento se a diferença entre $a$ e $b$ for muito grande. Felizmente, existe outro método para encontrar o maior divisor comum entre dois números, que pode ser descrito da seguinte forma:

Para encontrar o maior divisor comum entre $a$ e $b$, sendo $a > b$, realize a divisão entre os dois números. Esta operação dará um quociente e um resto (que chamaremos de $q$ e $r$, respectivamente). Assim, $a$ pode ser descrito como $a = q \times b + r$;
Se $r$ for igual a 0, paramos, porque descobrimos que o maior divisor comum de $a$ e $b$ é $b$. Caso contrário, voltamos ao passo 1, fazendo de $b$ o novo $a$ e $r$ será o novo $b$.
Agora, podemos começar com a implementação do algoritmo acima:

```typescript
const gcd = (a: number, b: number): number => {
  // Primeiro, calculamos o resto da divisão entre `a` e `b`:
  const r = a % b;

  // Se o resto for igual a zero, significamos que já encontramos o
  // maior divisor comum, porrtanto, retornamos `b`:
  if (r === 0) {
    return b;
  }

  // Enquanto o resto não for igual a 0, chamamos a função novamente,
  // com os novos valores de `a` e `b`:
  return gcd(b, a % b);
};
```

A implementação é muito direta e pode ser lida exatamente como descrita nos passos 1 e 2. Podemos tornar a função mais simples, verificando diretamente se $b$ é igual a zero e só realizando a operação de resto depois disso. Portanto, se a função receber um $b$ que seja igual a zero, saberemos que $a$ é o maior divisor comum:

```typescript
const gcd = (a: number, b: number): number => {
  if (b === 0) {
    return a;
  }

  return gcd(b, a % b);
};
```

Esta variante é chamada de _algoritmo euclidiano_ (em contraste com a primeira, que é o _algoritmo de Euclides_) e é significativamente mais rápida do que a primeira implementação.

## Implementações alternativas

Também podemos adotar uma abordagem diferente. Em vez de chamar nossa função gcd recursivamente, podemos implementar nossa função usando um laço `while` (análogo à nossa primeira implementação acima):

```typescript
const gcd = (a: number, b: number): number => {
  // Roda este laço enquanto `a` for diferente de `b`
  while (a !== b) {
    if (a > b) {
      // Subtrai `b` de `a` enquanto `a` for maior que `b`
      a = a - b;
      // Pula para a próxima iteração
      continue;
    }
    // Subtrai `a` de `b` quanto a <= b
    b = b - a;
  }
  // Retorna o resultado
  return a;
};
```

E esta é outra maneira (análoga à nossa segunda implementação acima):

```typescript
const gcd = (a: number, b: number): number => {
  // Roda este laço enquanto `b` for diferente de 0
  while (b !== 0) {
    // Salva o novo valor em uma variável temporária
    const newA = b;
    b = a % b;
    a = newA;
  }

  return a;
};
```

## Encontrando o maior divisor comum entre três ou mais números

O maior divisor comum de três ou mais números é igual ao produto dos fatores primos comuns a todos os números (exploraremos mais isso em um futuro artigo), mas, você também pode calcular o maior divisor comum entre pares desta lista de números com as mesmas funções que já mostramos. Então, vamos refatorar nossa função`gcd` para receber múltiplos parâmetros:

```typescript
const gcd = (...numbers: number[]): number => {
  const calculateGcd = (a: number, b: number): number => {
    if (b === 0) {
      return a;
    }

    return calculateGcd(b, a % b);
  };

  return (
    numbers
      // Só por precaução, ordena os números em ordem descendente:
      .sort((a, b) => b - a)
      // Chama `calculateGcd` para cada par de números na lista:
      .reduce((a, b) => calculateGcd(a, b))
  );
};
```

## Validando nossas entradas

Vamos garantir que nossas funções devem sempre receber, pelo menos, dois números e que todos os números deve ser positivos:

```typescript
const gcd = (...numbers: number[]): number => {
  if (numbers.length < 2) {
    throw new Error("Você deve passar, pelo menos, 2 números");
  }

  if (numbers.some((number) => number < 0)) {
    throw new Error("Os números devem ser >= 0");
  }

  const calculateGcd = (a: number, b: number): number => {
    if (b === 0) {
      return a;
    }

    return calculateGcd(b, a % b);
  };

  return numbers.sort((a, b) => b - a).reduce((a, b) => calculateGcd(a, b));
};
```
