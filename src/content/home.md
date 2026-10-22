---
title: DevOps клуб ТУЕС
siteName: TUES DevOps
description: Как софтуерът стига от лаптопа до сървъра. Контейнери, автоматизация, инфраструктура.
discordUrl: https://discord.gg/F4GwberfCp
skipLink: Към съдържанието
ogImageAlt: Лого на DevOps клуб ТУЕС
school:
  name: Технологично училище "Електронни системи"
  shortName: ТУЕС
  url: https://elsys-bg.org/
nav:
  label: Основна навигация
  menuLabel: Меню
  discord: Discord
  links:
    - label: Начало
      href: /
      dir: ~/devops
    - label: Срещи
      href: /meetings
      dir: ~/devops/meetings
    - label: За клуба
      href: /about
      dir: ~/devops/about
hero:
  prompt: ~/devops $
  quote: „Ако се налага да го правиш два пъти — автоматизирай го.“
  cta: Влез в Discord
  more:
    label: Какво е DevOps
    href: /about#whatis
events:
  label: Последни събития в клуба
  command: kubectl get events -n devops
  columns: [Last seen, Reason, Message]
  soon: скоро
  pending: Pending
  pendingText: Следващата среща ще бъде обявена в Discord
  completed: Completed
  all: виж всички
  allHref: /meetings
routes:
  label: Подстраници
  items:
    - cmd: cd about
      href: /about
      title: За клуба
      text: Информация за клуба и FAQ
    - cmd: cd meetings
      href: /meetings
      title: Срещи
      text: Предстоящи срещи и материали от минали
  discord:
    cmd: xdg-open
    title: Discord
    text: Тук вземаме решения за срещите и за клуба
footer:
  email: devops-club@elsys-bg.org
  contact: Свържи се с нас
  discord: Discord
  links:
    - key: source
      label: Код на сайта
      href: https://github.com/Elsys-DevOps-Club/website
    - key: network
      label: Други клубове
      href: https://elsys.club
notFound:
  title: Страницата не е намерена
  text: Адресът е грешен или страницата вече не съществува.
  back: Към началото
---
