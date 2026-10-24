---
kind: meetings
title: Срещи
description: Предстоящи и архив на минали срещи.
prompt: ~/devops/meetings $
lead: Срещите се провеждат след часовете, веднъж на една-две седмици. За повече подробности следи [Discord].
upcoming: Предстоящи
past: Досега
plannedStatus: Scheduled
upcomingCommand: kubectl get meetings --field-selector status=Pending
upcomingEmpty: No resources found in devops namespace.
discordCta: Следи в Discord
roomLabel: стая
onlineRoom: Discord
listCommand: kubectl get meetings -n devops
columns: [Date, Name]
describeCommand: kubectl describe meeting
fields:
  time: Time
  room: Room
  speaker: Speaker
  materials: Materials
materialsPrefix: "[repo]"
---
