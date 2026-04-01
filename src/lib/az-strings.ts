export const AZ = {
  instructions:
    "Xoş gəlmisiniz. Bu platforma sağlamlıq imkanları məhdud şəxslər üçün daha əlçatan istifadə təcrübəsi yaratmaq məqsədilə hazırlanmış süni intellekt əsaslı köməkçidir. Mesaj yazmaq üçün mətn sahəsindən istifadə edin. Səsli mesaj göndərmək üçün müvafiq düymədən istifadə edə bilərsiniz. Cavabı dinləmək üçün səsləndirmə düyməsinə basın. Saytdan istifadənin daha rahat olması üçün mətn ölçüsünü artırmaq və idarəetmə elementlərini daha rahat formada göstərmək mümkündür.",

  instructionBanner: "Köməkçidən istifadə etməzdən əvvəl qısa təlimatı dinləyin.",
  listenInstructions: "Təlimatları dinlə",
  stopInstructions: "Təlimatları dayandır",
  playing: "Oxunur...",

  statusLabels: {
    ready: "Təlimatlar hazırdır.",
    playing: "Təlimatlar oxunur...",
    stopped: "Təlimatlar dayandırıldı.",
    failed: "Təlimat oxunması uğursuz oldu.",
    unsupported: "Səsləndirmə bu brauzerdə dəstəklənmir.",
  } as Record<string, string>,

  shortcuts: {
    label: "Qısayollar",
    instructions: "Təlimatlar",
    record: "Yazmaq",
    playResponse: "Cavabı dinlə",
    stopSpeech: "Dayandır",
    focusInput: "Mesaj sahəsi",
  },

  voiceStatus: {
    listening: "Dinlənilir...",
    recordingStopped: "Yazma dayandırıldı.",
    submitting: "Mesaj göndərilir...",
    responding: "Köməkçi cavab verir...",
    responseReady: "Cavab hazırdır.",
    playingResponse: "Cavab oxunur...",
    playbackStopped: "Oxunma dayandırıldı.",
    recognitionFailed: "Səs tanıma uğursuz oldu.",
    micPermission: "Mikrofon icazəsi lazımdır.",
  },

  pushToTalk: {
    holdToSpeak: "Basıb saxlayın",
    listening: "Dinlənilir...",
    processing: "Emal edilir...",
    announcement: {
      listening: "Dinlənilir. İndi danışın.",
      processing: "Səs emal edilir.",
    },
    ariaLabel:
      "Səsli mesaj yazmaq üçün basıb saxlayın, və ya Alt+R ilə yazmanı başladın.",
  },

  messageStatus: {
    aiReceived: "Süni intellekt cavabı alındı",
    messageSent: "Mesaj göndərildi",
    generating: "Cavab yaradılır…",
    streaming: "Cavab göndərilir",
  },

  actions: {
    copy: "Kopyala",
    listen: "Cavabı dinlə",
    stopListening: "Dayandır",
    regenerate: "Yenidən yarat",
  },

  emptyState: {
    title: (name: string) => `Necə kömək edə bilərəm, ${name}?`,
    description: "Mənə istənilən sual verə bilərsiniz.",
  },

  composer: {
    placeholder: "Nə bilmək istərdiniz?",
    stopGenerating: "Yaratmanı dayandır",
    sending: "Mesaj göndərilir…",
    send: "Mesaj göndər",
  },

  tts: {
    loading: "Səs yüklənir...",
    error: "Səsləndirmə uğursuz oldu.",
  },
} as const;
