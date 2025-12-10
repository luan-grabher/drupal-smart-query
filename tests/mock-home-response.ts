export const MockHomeResponse = {
  data: {
    route: {
      __typename: "RouteInternal",
      url: "/home",
      internal: true,
      entity: {
        __typename: "NodeHome",
        id: "aaa",
        title: "Página Inicial",
        path: "/home",

        paragraphMetatag: {
          __typename: "ParagraphMetatag",
          id: "meta1",
          tituloPlain: "Título META",
          descricaoPlain: "Descrição META",
          imagem: {
            __typename: "MediaImage",
            mediaImage: {
              url: "http://img.com/meta.jpg"
            },
            url: "http://img.com/meta.jpg"
          }
        },

        paragraphBanners: [
          {
            __typename: "ParagraphBanner",
            id: "b1",
            tituloHtml: { value: "<p>A</p>" },
            textoHtml: { value: "<p>B</p>" },
            midiaDesktop: {
              __typename: "MediaImage",
              mediaImage: { url: "http://img.com/desk.jpg" },
              url: "http://img.com/desk.jpg"
            },
            midiaMobile: {
              __typename: "MediaImage",
              mediaImage: { url: "http://img.com/mob.jpg" },
              url: "http://img.com/mob.jpg"
            }
          },
          {
            __typename: "ParagraphTituloTextoImagem",
            id: "b2",
            tituloHtml: { processed: "<h1>TÍTULO</h1>" },
            textoHtml: { processed: "<p>TEXTO</p>" },
            imagem: {
              __typename: "MediaImage",
              mediaImage: { url: "http://img.com/foto.jpg" },
              url: "http://img.com/foto.jpg"
            }
          }
        ]
      }
    }
  }
};
