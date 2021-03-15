import styled from 'styled-components';

export const ExemploPlanetas = styled.aside`
  [aria-busy] {
    transition: opacity 0.2s linear;
    position: relative;
  }

  [aria-busy="true"] * {
    opacity: 0.7;
  }

  [aria-busy="true"]:before {
    content: '';
    display: block;
    border: 6px solid transparent;
    border-top-color: purple;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    animation: spin 1.2s infinite linear;
    position: absolute;
    left: calc(50% - 18px);
    top: calc(50% - 18px);
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
`;
