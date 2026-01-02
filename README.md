# 🐷 PigCoin - Controle Financeiro Gamificado

O **PigCoin** é um aplicativo de controle financeiro desenvolvido em React Native e TypeScript, focado em simplicidade, gamificação e uma estética premium.

## 🚀 Funcionalidades Principais

- **📊 Gestão de Transações:** Adicione receitas e despesas com categorização automática.
- **🎯 Desafio de Metas (Grid):** Sistema inovador de economia. Defina um valor alvo e o app gera um grid incremental (1, 2, 3... R$) para você marcar cada item economizado.
- **📈 Gráficos Dinâmicos:** Visualize a distribuição das suas despesas e o histórico dos últimos 7 dias em gráficos de pizza e barras.
- **💾 Persistência de Dados:** Todos os seus dados são salvos localmente utilizando `AsyncStorage`.
- **🏆 Feedback de Conquista:** Alertas de celebração ao concluir 100% de um desafio de meta.

## 🎨 Design System (Retro Modern)

O app utiliza uma paleta de cores sofisticada e moderna para fugir do "clichê" de apps financeiros:

- **Fundo:** Cinza Claro (`#F7F9FC`)
- **Títulos e Textos:** Azul Petróleo (`#243B46`)
- **Destaques:** Amarelo Mostarda (`#F4C95D`)
- **Sucesso/Progresso:** Verde Menta (`#27AE60`)
- **Perigo/Negativo:** Vermelho Suave (`#E76F51`)

A navegação foi otimizada para Android, com barras de sistema integradas e altura de tab bar ajustada para gestos de sistema.

## 🛠️ Tecnologias Utilizadas

- **Framework:** Expo (React Native)
- **Linguagem:** TypeScript
- **Navegação:** React Navigation (Bottom Tabs)
- **Gráficos:** React Native Chart Kit
- **Ícones:** Expo Vector Icons (Ionicons)
- **Storage:** @react-native-async-storage/async-storage

## 📂 Estrutura do Projeto

- `/src/components`: Componentes reutilizáveis (Cards, Modais, Logo).
- `/src/context`: Gerenciamento de estado global com Context API.
- `/src/screens`: Telas principais (Home, Gráficos, Metas).
- `/src/constants`: Paleta de cores e constantes globais.
- `/src/types`: Definições de tipos TypeScript.

---

Desenvolvido para ajudar você a conquistar seus objetivos de forma divertida e organizada! 🐷🚀
