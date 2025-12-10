export const HomeDSL = {
  route: {
    __args: { path: "/home", langcode: "pt-br" },

    url: true,
    internal: true,

    entity: {
      id: true,
      title: true,
      path: true,

      metatags: {
        source: "paragraphMetatag",
        fields: {
          titulo: "tituloPlain",
          descricao: "descricaoPlain",
          imagem: {
            source: "MediaImage",
            fields: {
              url: "mediaImage.url"
            }
          }
        }
      },

      banners: {
        source: "paragraphBanners",
        __union: {
          ParagraphBanner: {
            tituloHtml: true,
            textoHtml: true,
            midiaDesktop: true,
            midiaMobile: true
          },
          ParagraphTituloTextoImagem: {
            tituloHtml: true,
            textoHtml: true,
            imagem: true
          },
          ParagraphTituloTexto: {
            tituloHtml: true,
            textoHtml: true
          }
        }
      }
    }
  }
};
