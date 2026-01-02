# 🐷 PigCoin - Controle Financeiro Gamificado

O **PigCoin** é um aplicativo de controle financeiro desenvolvido em React Native e TypeScript, focado em simplicidade, gamificação e uma estética premium.

## 🚀 Funcionalidades Principais

- **📊 Gestão de Transações:** Adicione receitas e despesas com categorização automática.
- **🎯 Desafio de Metas (Grid):** Sistema inovador de economia. Defina um valor alvo e o app gera um grid incremental para você marcar cada item economizado.
- **📈 Gráficos Dinâmicos:** Visualize a distribuição das suas despesas e o histórico dos últimos 7 dias.
- **💾 Persistência de Dados:** Dados salvos localmente com `AsyncStorage`.
- **🏆 Feedback de Conquista:** Alertas de celebração ao concluir desafios.

## 🎨 Design System

- **Fundo:** `#F7F9FC`
- **Primária:** `#F4C95D` (Amarelo Pig)
- **Secundária:** `#1F4E5F` (Azul Petróleo)
- **Acento:** `#2AC47A` (Verde)

## 🛠️ Tecnologias

- **Framework:** Expo 52 (SDK 52)
- **Linguagem:** TypeScript
- **Navegação:** React Navigation 7
- **UI:** Custom components with Reanimated 3
- **Build:** EAS Build (Android APK)

## 📦 Como rodar

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o Expo:
   ```bash
   npx expo start
   ```

3. Para gerar APK via EAS:
   ```bash
   eas build -p android --profile preview
   ```

---
Desenvolvido por Alison Alves. 🐷🚀
