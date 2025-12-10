import { normalizeResponse } from "../src/normalizeResponse";
import { HomeDSL } from "./dsl-home";
import { MockHomeResponse } from "./mock-home-response";

describe("normalizeResponse", () => {
  test("normaliza metatags", () => {
    const normalized = normalizeResponse(HomeDSL, MockHomeResponse);
    const meta = normalized.entity.metatags;

    expect(meta.titulo).toBe("Título META");
    expect(meta.descricao).toBe("Descrição META");
    expect(meta.imagem).toBe("http://img.com/meta.jpg");
  });

  test("normaliza banners ParagraphBanner", () => {
    const normalized = normalizeResponse(HomeDSL, MockHomeResponse);
    const banner = normalized.entity.banners[0];

    expect(banner.type).toBe("ParagraphBanner");
    expect(banner.tituloHtml).toBe("<p>A</p>");
    expect(banner.textoHtml).toBe("<p>B</p>");
    expect(banner.midiaDesktop).toBe("http://img.com/desk.jpg");
    expect(banner.midiaMobile).toBe("http://img.com/mob.jpg");
  });

  test("normaliza banners ParagraphTituloTextoImagem", () => {
    const normalized = normalizeResponse(HomeDSL, MockHomeResponse);
    const banner = normalized.entity.banners[1];

    expect(banner.type).toBe("ParagraphTituloTextoImagem");
    expect(banner.tituloHtml).toBe("<h1>TÍTULO</h1>");
    expect(banner.textoHtml).toBe("<p>TEXTO</p>");
    expect(banner.imagem).toBe("http://img.com/foto.jpg");
  });

  test("estrutura final coerente", () => {
    const normalized = normalizeResponse(HomeDSL, MockHomeResponse);

    expect(normalized.url).toBe("/home");
    expect(normalized.internal).toBe(true);
    expect(normalized.entity.id).toBe("aaa");
  });
});
